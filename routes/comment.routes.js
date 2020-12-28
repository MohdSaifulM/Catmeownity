const router = require("express").Router();
const Cat = require("../models/cats.model");
const User = require("../models/user.model");
const Desc = require("../models/desc.model");

// add new comment && push to cat model
router.post("/:catID/desc/:userID", async (req, res) => {
    try {
        let { catDescription } = req.body;
        let user = await User.findById(req.params.userID);
        let cat = await Cat.findById(req.params.catID);
        /* New Description */
        let desc = new Desc({
            catDescription,
            byUser: req.params.userID,
            forCat: req.params.catID
        });
        await desc.save();

        //push to Cat
        await Cat.findByIdAndUpdate(req.params.catID, {
            $push: {
                desc: {
                    $each: [desc._id],
                    $position: 0
                }
            }
        })
        await cat.save();

        //push to User
        await User.findByIdAndUpdate(req.params.userID, {
            $push: {
                descForCats: {
                    $each: [desc._id],
                    $position: 0
                }
            }
        })
        await user.save();

        res.status(201).json({ message: "Comment has been added" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Could not add comment" })
    }
})

//delete comment
router.delete("/:descID/:userID/:catID", async (req, res) => {
    try {
        let curr = await Desc.findById(req.params.descID);
        /* Remove from user */
        await User.findByIdAndUpdate(req.params.userID, {
            $pull: {
                descForCats: curr._id,
            }
        })
        /* Remove from cat */
        await Cat.findByIdAndUpdate(req.params.catID, {
            $pull: {
                desc: curr._id,
            }
        })
        /* Delete comment */
        await Desc.findByIdAndDelete(req.params.descID);
        res.status(200).json({ message: "Comment has been deleted" });
    } catch (error) {
        res.status(400).json({ message: "Could not do this" });
    }
})

//edit comment
router.put("/:descID", async (req, res) => {
    try {
        let { catDescription } = req.body;
        await Desc.findByIdAndUpdate(req.params.descID, {
            catDescription
        });
        res.status(200).json({ message: "Successfully updated comment" });
    } catch (error) {
        res.status(400).json({ message: "Trouble updating comment" });
    }
})

module.exports = router;