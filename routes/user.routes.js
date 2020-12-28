// login, register
const router = require("express").Router();
const User = require("../models/user.model");
var passport = require("../lib/passportConfig");
const jwt = require("jsonwebtoken");
const bcrpyt = require("bcrypt");

/* Register */
router.post("/register", async (req, res) => {
    try {
        let { email, password, name, image } = req.body;
        let hashedPassword = await bcrpyt.hash(password, 10);
        let user = new User(
            {
                email,
                password: hashedPassword,
                name,
                image,
            }
        );
        await user.save();
        // give token to user upon successful registration
        const body = { _id: user._id };
        const token = jwt.sign({ user: body }, process.env.TOP_SECRET, { expiresIn: 84600000 });
        return res.status(200).json({ user, token });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "This email address has already been registered" })
        } else {
            res.status(400).json({ message: "Error here!" })
        }
    }
});

/* Login */
router.post('/login', async (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
        try {
            if (err) {
                const error = new Error('An error occurred.');
                return next(error);
            }
            if (!user) {
                return res.status(400).json({ msg: 'Invalid email or password' })
            }

            req.login(
                user,
                { session: false },
                async (error) => {
                    if (error) return next(error);

                    const body = { _id: user._id };
                    const token = jwt.sign({ user: body }, process.env.TOP_SECRET, { expiresIn: 84600000 });

                    return res.status(200).json({ token });
                }
            );
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});

/* Get user profile */
router.get('/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id).populate(
            {
                path: 'favourites',
                model: 'Cat',
            },
        ).populate(
            {
                path: 'descForCats',
                model: 'Desc',
                populate: {
                    path: 'forCat',
                    select: 'names',
                }
            }
        ).populate(
            {
                path: 'trackedLocations',
                model: 'Location',
                select: 'street',
                populate: {
                    path: 'district',
                    select: 'name locality',
                }
            }
        ).populate(
            {
                path: 'fed',
                model: 'Fed',
                populate: {
                    path: 'forCat',
                    model: 'Cat',
                    select: 'names',
                }
            }
        )

        if (user) {
            return res.status(200).json({ user });
        } else {
            res.status(400).json({ user: false })
        }
    } catch (e) {
        res.status(400).json({ message: 'error fetching user' })
    }
})

/* Check if email exists */
router.get('/check/:email', async (req, res) => {
    try {
        let user = await User.find({ email: req.params.email })
        if (user.length) {
            return res.status(200).json({ found: true });
        } else {
            res.status(200).json({ found: false })
        }
    } catch (e) {
        res.status(400).json({ message: 'error searching' })
        console.log(e)
    }
})

module.exports = router;