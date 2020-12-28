const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/user.model");
const ExtractJWT = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const bcrypt = require("bcrypt");

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use("login", new localStrategy(
    {
        usernameField: "email",
        passwordField: "password",
    },
    function (email, password, done) {
        User.findOne({ email: email }, async function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: "Incorrect email" });
            }
            let compare = await bcrypt.compare(password, user.password);

            if (compare) {
                return done(null, user);
            } else {
                return done(null, false, { message: "Incorrect password!" });
            }
        });
    }
));

var opts = {};
opts.jwtFromRequest = ExtractJWT.fromHeader("x-auth-token");
opts.secretOrKey = process.env.TOP_SECRET;
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ id: jwt_payload.sub}, function (err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else { 
            return done(null, false);
        }
    });
}));

module.exports = passport;
