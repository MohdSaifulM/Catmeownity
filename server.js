require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("./lib/passportConfig");
const path = require('path');

require('./lib/connection');

/* middleware */
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cors());

/* public routes */
app.use("/api/public", require("./routes/public.routes"));
app.use("/api/user", require("./routes/user.routes"));
/* private routes */
app.use("/api/auth/cats", passport.authenticate('jwt', { session: false }), require("./routes/cat.routes"));
app.use("/api/auth/user", passport.authenticate('jwt', { session: false }), require("./routes/authUser.routes"));
app.use("/api/auth/location", passport.authenticate('jwt', { session: false}), require("./routes/authLocation.routes"));
app.use("/api/auth/comment", passport.authenticate('jwt', { session: false}), require("./routes/comment.routes"));
app.get("/api/*", (req, res) => {
    res.status(404).json({ message: "Server route not found" });
});
app.get('/app', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });

app.listen(process.env.PORT, () => {
    console.log(`Connected on ${process.env.PORT}`);
});