// view cats, view location
const router = require("express").Router();
const Cat = require("../models/cats.model.js");
const District = require("../models/district.model");
const Location = require("../models/location.model.js");
const mongoose = require('mongoose')

/* get cat data from location*/
router.get('/cats/:location', async (req, res) => {
    try {
        let locationID = req.params.location;
        let locationName = await Location.findById(locationID);
        let cats = await Cat.find({ location: locationID }
        );

        return res.status(200).json({
            location: locationName.street,
            cats,
            message: "Successfully fetched cats!",
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Problem fetching cats data!" })
    }
});
/* get single cat data */
router.get("/cat/:catID", async (req, res) => {
    try {
        let cat = await Cat.findById(req.params.catID)
            .populate({
                path: 'location',
                populate: {
                    path: 'district',
                }
            })
            .populate({
                path: 'desc',
                populate: {
                    path: 'byUser',
                    model: 'User',
                    select: 'name'
                }
            })
            .populate({
                path: 'fed',
                populate: {
                    path: 'byUser',
                    model: 'User',
                    select: 'name'
                }
            })
            .populate({
                path: 'photos',
                populate: {
                    path: 'uploadedBy',
                    select: 'name'
                }
            })

        return res.status(200).json({
            cat,
            message: "Successfully fetched cat!"
        });
    } catch (error) {
        res.status(400).json({ message: "Problem fetching data!" });
        console.log(error)
    }
})
/* get district data from NSEW*/
router.get('/district/:area', async (req, res) => {
    try {
        let area = req.params.area;
        if (area === "all") {
            let districts = await District.find();
            return res.status(200).json({
                districts,
                message: "Successfully fetched all districts"
            })
        } else {
            area = area[0].toUpperCase() + area.slice(1);
            let districts = await District.find({ locality: area });
            return res.status(200).json({
                districts,
                message: "Successfully fetched district"
            })
        }

    } catch (error) {
        res.status(400).json({ message: "Problem fetching district data!" })
    }
})
/* get locations in a district */
router.get('/location/:area', async (req, res) => {
    try {
        let district = req.params.area;
        let locations = await Location.find({ district });
        return res.status(200).json({
            locations,
            message: "Successfully fetched district"
        })
    } catch (error) {
        res.status(400).json({ message: "Problem fetching location data" })
    }
})
/* get location data */
router.get('/where/:id', async (req, res) => {
    try {
        let location = await Location.findById(req.params.id)
            .populate('district');
        return res.status(200).json({
            location,
            message: "Successfully fetched location"
        })
    } catch (error) {
        res.status(400).json({ message: "Problem fetching location data" })
    }
})
/* find cats with same name */
router.post('/same/:id/', async (req, res) => {
    try {
        let { name } = req.body;
        let temp = "";

        if (name.includes(' ')) {
            name.split(' ').forEach(x => {
                temp += (x[0].toUpperCase() + x.slice(1) + ' ')
            })
        } else {
            temp = name[0].toUpperCase() + name.slice(1);
        }
        let cat = await Cat.find({ names: temp })
        let found = false;
        let similarCats = [];
        cat.forEach(c => {
            if (c.location == req.params.id) {
                found = true;
                similarCats.push(c);
            }
        })
        if (found) {
            return res.status(200).json({
                similarCats,
                found,
                message: "found similar cat"
            })
        }
        return res.status(200).json({
            found,
            message: "no similar cat"
        })
    } catch (error) {
        res.status(400).json({ message: "Problem fetching location data" })
    }
})

module.exports = router;