const router = require("express").Router();
const Cat = require("../models/cats.model");
const User = require("../models/user.model");
const Location = require("../models/location.model");
const District = require("../models/district.model");
const Desc = require("../models/desc.model");
const Fed = require("../models/feeding.model");
const cloudinary = require('cloudinary').v2;

// add new cat
router.post("/add", async (req, res) => {
    try {
        let {
            name, breed, gender, colour,
            catDescription, location, image, sterilised,
            userID, imgDesc } = req.body;
        let names = [name];
        let colours = colour.split(",");

        let cat = new Cat({
            names, location, breed, gender, colours, sterilised
        });
        let newDesc = new Desc({
            catDescription,
            byUser: userID,
            forCat: cat._id
        })
        if (image) {
            let newPhoto = {
                isDefault: true,
                image,
                desc: imgDesc,
                uploadedBy: userID,
            }
            cat.photos = [newPhoto];
        }
        newDesc.save();
        cat.desc = [newDesc._id];

        await cat.save();

        res.status(201).json({ cat, message: "Cat has been added" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Could not add cat" })
    }
})

// edit cat for profile modal --> use cat ID
router.put("/:catID", async (req, res) => {
    try {
        // DOUBLE CHECK THAT COLOUR IS ARRAY
        let { names, breed, gender, colour } = req.body;
        await Cat.findByIdAndUpdate(req.params.catID, {
            names,
            breed,
            gender,
            colour
        });
        res.status(200).json({ message: "Successfully updated cat profile" });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding cat data" });
    }
})

// add another name for cat 
router.put("/name/:catID", async (req, res) => {
    try {
        let { names } = req.body;
        await Cat.findByIdAndUpdate(req.params.catID, {
            $push: {
                names
            }
        });
        res.status(200).json({ message: "Successfully updated cat profile" });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding cat data" });
    }
})

// delete name for cat
router.put("/delname/:catID", async (req, res) => {
    try {
        let { names } = req.body;
        await Cat.findByIdAndUpdate(req.params.catID, {
            $pull: {
                names
            }
        });
        res.status(200).json({ message: "Successfully updated cat profile" });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding cat data" });
    }
})

// feed cat --> use user ID & cat ID
router.post("/:userID/feed/:catID", async (req, res) => {
    try {
        let { foodDescription } = req.body;
        let user = await User.findById(req.params.userID);
        let cat = await Cat.findById(req.params.catID);

        let fed = new Fed({
            foodDescription,
            byUser: req.params.userID,
            forCat: req.params.catID,
        })

        await fed.save()

        await Cat.findByIdAndUpdate(req.params.catID, {
            $push: {
                fed: {
                    $each: [fed._id],
                    $position: 0
                }
            }
        })
        await cat.save();

        await User.findByIdAndUpdate(req.params.userID, {
            $push: {
                fed: {
                    $each: [fed._id],
                    $position: 0
                }
            }
        })
        await user.save();

        res.status(201).json({ message: "Successfully updated feeding records" })
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Could not do this" });
    }
})

// mark potential duplicate --> use cat ID
router.put("/:catID/duplicate", async (req, res) => {
    try {
        await Cat.findByIdAndUpdate(req.params.catID, {
            duplicate: true,
        })
        res.status(200).json({ message: "Successfully marked" });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding cat data" });
    }
})

// mark potential missing --> use cat ID
router.put("/:catID/missing", async (req, res) => {
    try {
        await Cat.findByIdAndUpdate(req.params.catID, {
            missing: true,
        })
        res.status(200).json({ message: "Successfully marked" });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding cat data" });
    }
})

// mark cat found --> use cat ID
router.put("/:catID/found", async (req, res) => {
    try {
        await Cat.findByIdAndUpdate(req.params.catID, {
            missing: false,
        })
        res.status(200).json({ message: "Successfully marked" });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding cat data" });
    }
})

/* Add cat photo */
router.put('/addphoto/:catID', async (req, res) => {
    try {
        let { image, isDefault, desc, uploadedBy } = req.body;

        let photo = {
            image,
            desc,
            isDefault,
            uploadedBy,
        }
        await Cat.findByIdAndUpdate(req.params.catID, {
            $push: {
                photos: photo
            }
        })

        res.status(200).json({ message: "successfully added photo to cat" });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "This email address has already been registered" })
        } else {
            res.status(400).json({ message: "Error here!" })
        }
    }
})

/* Del cat photo */
router.put('/delphoto/:catID', async (req, res) => {
    try {
        let { image } = req.body;
        let start = image.indexOf('catmeownity')
        let end = image.split('').reverse().join('').indexOf('.')

        let publicID = image.slice(start, image.length - (end + 1))

        cloudinary.api.delete_resources([publicID],
            function (error, result) { console.log(result, error); });

        await Cat.findByIdAndUpdate(req.params.catID, {
            $pull: {
                photos: {
                    image
                }
            }
        })

        res.status(200).json({ message: "successfully deleted photo from cat" });
    } catch (error) {
        console.log(error)
    }
})

// add another colour for cat 
router.put("/colour/:catID", async (req, res) => {
    try {
        let { colours } = req.body;
        await Cat.findByIdAndUpdate(req.params.catID, {
            $push: {
                colours
            }
        });
        res.status(200).json({ message: "Successfully updated cat profile" });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding cat data" });
    }
})

// delete colour for cat
router.put("/delcolour/:catID", async (req, res) => {
    try {
        let { colours } = req.body;
        await Cat.findByIdAndUpdate(req.params.catID, {
            $pull: {
                colours
            }
        });
        res.status(200).json({ message: "Successfully updated cat profile" });
    } catch (error) {
        res.status(400).json({ message: "Trouble finding cat data" });
    }
})

// delete cat --> use cat ID
// PROBLEM - HOW TO REMOVE CAT FROM FAVOURITES LISTS?
router.delete("/:catID", async (req, res) => {
    try {
        await Cat.findByIdAndDelete(req.params.catID);
        res.status(200).json({ message: "Cat has been deleted" });
    } catch (error) {
        res.status(400).json({ message: "Could not do this" });
    }
})

module.exports = router;