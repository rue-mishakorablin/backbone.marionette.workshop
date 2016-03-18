var _ = require('lodash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var usernames = [
    'bob',
    'john',
    'zamir',
    'izaak',
    'nate',
    'misha',
    'shannon',
    'ari',
    'devin',
    'kayleigh',
    'matt',
    'zak',
    'darren',
    'troy',
    'ken',
    'andy'
];

var userData = usernames.map(function(username) {
    return createUser(username, 'testing');
});

function findUser(username) {
    return _.findWhere(userData, {username: username});
}

function findUserById(id) {
    return _.findWhere(userData, {id: id});
}

function generateId() {
    var id = Math.floor(10000000000 * Math.random());
    if (findUserById(id)) {
        id = id * Math.pow(10, Math.floor(100 * Math.random()));
    } else {
        return id;
    }
}

function createUser(username, password) {
    return {
        username: username,
        password: 'testing',
        id: generateId()
    }
}

function sanitizeUser(user) {
    return _.omit(user, 'password');
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(403).json({errorMessage: "This endpoint requires authentication."});
    }
  }

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
    var existingUser = findUserById(id);
    if (existingUser) {
        done(null, sanitizeUser(existingUser));
    } else {
        done(true, false);
    }
});

passport.use('login', new LocalStrategy(
  function(username, password, done) {
    var existingUser = findUser(username);
    if (existingUser && existingUser.password == password) {
        return done(null, sanitizeUser(existingUser));
    } else {
        return done(null, false);
    }
  }
));

passport.use('signup', new LocalStrategy(
  function(username, password, done) {
    process.nextTick(function() {
        var existingUser = findUser(username);
        if (!existingUser) {
            var newUser = createUser(username, password);
            userData.push(newUser);
            done(null, sanitizeUser(newUser));
        } else {
            done(null, false, {
                message: 'Such user already exists',
                code: 409
            });
        }
    });
  }
));

module.exports = function(app) {

    app.post(
        '/login',  
        passport.authenticate('login'), 
        function(req, res) {
            res.json(req.user);
        });

    app.post(
        '/register',
        function(req, res, next) {
            passport.authenticate('signup', function(err, user, info) {
                if (!user) {
                    res.status(info.code || 400).json(_.omit(info, 'code'));
                } else {
                    next();
                }
            })(req, res);
        },
        passport.authenticate('login'),
        function(req, res) {
            res.json(req.user);
        });

    app.post('/logout', function(req, res) {
        req.logout();
        res.status(200).send();
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.status(200).send();
    });

    app.get('/me',
        isLoggedIn,
        function(req, res) {
            res.json(req.user);
        }
    );

    app.get('/', function(req, res) {
        res.status(200).json('OK');
    });
};