const router = require("express").Router();
const District = require("../models/district.model");
const Location = require("../models/location.model");
const Cat = require("../models/cats.model");

//get location
router.get("/:locationID", async (req, res) => {
    try {
        let location = await Location.findById(req.params.locationID).populate(
            {
                path: 'district',
                select: 'name locality',
            }
        ).populate(
            {
                path: 'cats',
                select: 'names',
            }
        )
        return res.status(200).json({
            location,
            message: "Successfully fetched location!"
        });
    } catch (error) {
        res.status(400).json({ message: "Problem fetching data!" });
    }
})

// create location by district
router.post("/:districtID", async (req, res) => {
    try {
        let { street } = req.body;
        let temp = ""
        street.split(' ').forEach(x => {
            temp += (x[0].toUpperCase() + x.slice(1) + ' ')
        })
        let check = await Location.find({ street: temp.trim() })

        if (check.length > 0) {
            res.status(400).json({ exists: true, message: "Location already exists" })
        }

        let location = new Location(
            {
                street: temp.trim(),
                district: req.params.districtID,
            }
        );
        await location.save();

        res.status(201).json({ message: "Location has been added" });
    } catch (error) {
        res.status(400).json({ message: "Could not add location" })
    }
})

// add cat to location
router.put("/:locationID/add/:catID", async (req, res) => {
    try {
        let location = await Location.findByIdAndUpdate(req.params.locationID, {
            $push: {
                cats: req.params.catID,
            }
        })

        await location.save();

        res.status(201).json({ message: "Successfully added cat" })
    } catch (error) {
        res.status(400).json({ message: "Could not do this" });
    }
})

//edit location
router.put("/:locationID", async (req, res) => {
    try {
        let { street } = req.body;
        let location = await Location.findByIdAndUpdate(req.params.locationID, {
            street,
        })

        await location.save();

        res.status(201).json({ message: "Successfully updated location" })
    } catch (error) {
        res.status(400).json({ message: "Could not do this" });
    }
})

//delete location
router.delete("/:locationID", async (req, res) => {
    try {
        await Location.findByIdAndDelete(req.params.locationID);
        res.status(200).json({ message: "location has been deleted" });
    } catch (error) {
        res.status(400).json({ message: "Could not do this" });
    }
})

module.exports = router;