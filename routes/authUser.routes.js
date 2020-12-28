const router = require("express").Router();
const Cat = require("../models/cats.model");
const User = require("../models/user.model");
const Location = require("../models/location.model");
const District = require("../models/district.model");
const cloudinary = require('cloudinary').v2;

//get user
router.get("/:userID", async (req, res) => {
    try {
        let user = await User.findById(req.params.userID).populate(
            {
                path: 'favourites',
                model: 'Cat',
                populate: {
                    path: 'location',
                    model: 'Location',
                }
            },
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
        )
        return res.status(200).json({
            user,
            message: "Successfully fetched user!"
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Problem fetching data!" });
    }
})

// edit user
router.put("/:userID", async (req, res) => {
    try {
        let { name, email } = req.body;
        await User.findByIdAndUpdate(req.params.userID, { name, email });
        res.status(200).json({ message: "Successfully updated user profile" });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding user" });
    }
})

//add user photo
router.put('/addphoto/:userID', async (req, res) => {
    try {
        let { image } = req.body;
        await User.findByIdAndUpdate(req.params.userID, { image })
        res.status(200).json({ message: "successfully added photo to user" });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "This email address has already been registered" })
        } else {
            console.log(error)
            res.status(400).json({ message: "Error here!" })
        }
    }
})
//change user photo
router.put('/changephoto/:userID', async (req, res) => {
    try {
        let { image } = req.body;
        let user = await User.findById(req.params.userID);

        let temp = user.image;
        let start = temp.indexOf('catmeownity');
        let end = temp.split('').reverse().join('').indexOf('.')

        let publicID = temp.slice(start, temp.length - (end + 1))

        cloudinary.api.delete_resources([publicID],
            function (error, result) { console.log(result, error); });

        user.image = image;
        user.save();
        res.status(200).json({ message: "successfully changed user photo" });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "This email address has already been registered" })
        } else {
            console.log(error)
            res.status(400).json({ message: "Error here!" })
        }
    }
})
//delete user photo
router.delete('/delphoto/:userID', async (req, res) => {
    try {
        let user = await User.findById(req.params.userID)

        let temp = user.image;
        let start = temp.indexOf('catmeownity');
        let end = temp.split('').reverse().join('').indexOf('.')

        let publicID = temp.slice(start, temp.length - (end + 1))

        cloudinary.api.delete_resources([publicID],
            function (error, result) { console.log(result, error); });

        await User.findByIdAndUpdate(req.params.userID, { image: null })

        res.status(200).json({ message: "successfully deleted user photo" });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "This email address has already been registered" })
        } else {
            console.log(error)
            res.status(400).json({ message: "Error here!" })
        }
    }
})

//add tracked location
router.put("/:userID/tracked/:locationID", async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userID, {
            $push: {
                trackedLocations: {
                    $each: [req.params.locationID],
                    $position: 0
                }
            }
        })
        res.status(200).json({ message: "Successfully added tracked location" });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding user" });
    }
})

//remove tracked location
router.put("/:userID/untrack/:locationID", async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userID, {
            $pull: {
                trackedLocations: req.params.locationID
            }
        })
        res.status(200).json({ message: "Successfully removed tracked location" });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding user" });
    }
})

/* get favorites from user */
router.get("/get-favourites/:userID", async (req, res) => {
    try {
        let user = await User.findById(req.params.userID);
        return res.status(200).json({
            favourites: user.favourites,
            message: "Successfully fetched user favourites!"
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Problem fetching data!" });
    }
})

/* add favorites */
router.put("/:userID/favourite/:catID", async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userID, {
            $push: {
                favourites: {
                    $each: [req.params.catID],
                    $position: 0
                }
            }
        })
        res.status(200).json({
            message: "Successfully added cat to favorites"
        });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding user" });
    }
})

/* remove favorites */
router.put("/:userID/unfavourite/:catID", async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userID, {
            $pull: {
                favourites: req.params.catID
            }
        })
        res.status(200).json({ message: "Successfully removed cat from favorites" });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding user" });
    }
})

/* get tracked locations from user */
router.get("/tracked/:userID", async (req, res) => {
    try {
        let user = await User.findById(req.params.userID);
        return res.status(200).json({
            tracked: user.trackedLocations,
            message: "Successfully fetched user favourites!"
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Problem fetching data!" });
    }
})

//delete profile
router.delete("/:userID", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userID);
        res.status(200).json({ message: "Successfully deleted user profile" });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding user" });
    }
})


module.exports = router;