const express = require("express");
const router = express.Router();
const { auth, authAdmin } = require("../middleware/auth");
const { TravelModel } = require("../models/travels.model");
const { travelSchemaValidate } = require("../validations/travels.validation");

router.get("/", (req, res) => {
  res.json({ msg: "travels work project 3" });
});

router.get("/allTravelsList", authAdmin, async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 4;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await TravelModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.get("/travelsUserList", auth, async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 4;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await TravelModel.find({ user_id: req.tokenData._id })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.get("/single/:idTravel", auth, async (req, res) => {
  let idTravel = req.params.idTravel;
  try {
    let data = await TravelModel.findOne({ _id: idTravel });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.get("/search", auth, async (req, res) => {
  let searchPrice = req.query.price;
  let searchPaymentType = req.query.payment_type;
  let sort = req.query.sort || "ticket.price";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await TravelModel.find({
      $or: [
        { "ticket.price": { $eq: searchPrice } },
        { "ticket.payment_type": { $eq: searchPaymentType } },
      ],
      user_id: req.tokenData._id,
    }).sort({ [sort]: reverse });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error occurred", error: err });
  }
});

router.get("/searchByPriceRange", auth, async (req, res) => {
  const minPrice = req.query.min;
  const maxPrice = req.query.max;
  let sort = req.query.sort || "ticket.price";
  let reverse = req.query.reverse == "yes" ? -1 : 1;


  try {
    let data = await TravelModel.find({
      'ticket.price': { $gte: minPrice, $lte: maxPrice },
      user_id: req.tokenData._id,
    }) .sort({ [sort]: reverse });

    console.log("data", data);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error occurred", error: err });
  }
});


router.post("/", auth, async (req, res) => {
  let validBody = travelSchemaValidate(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let travel = new TravelModel(req.body);
    travel.user_id = req.tokenData._id;
    await travel.save();
    res.status(201).json(travel);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.put("/:idEdit", auth, async (req, res) => {
  let validBody = travelSchemaValidate(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  let idEdit = req.params.idEdit;
  try {
    let data;
    if (req.tokenData.role == "admin") {
      data = await TravelModel.updateOne({ _id: idEdit }, req.body);
    } else {
      data = await TravelModel.updateOne(
        { _id: idEdit, user_id: req.tokenData._id },
        req.body
      );
    }
    let countM = res.modfiedCount;
    console.log("mod",res.modfiedCount);
    console.log("mod",res.matchedCount);

    console.log(countM);
    if ((data.modifiedCount != 1)) {
      return res
        .status(400)
        .json({ msg: "you cannot edit somthing you not add" });
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.delete("/:idDelete", auth, async (req, res) => {
  let idDelete = req.params.idDelete;
  try {
    let data;
    if (req.tokenData.role == "admin") {
      console.log("delete admin");
      data = await TravelModel.deleteOne({ _id: idDelete });
    } else {
      data = await TravelModel.deleteOne({
        _id: idDelete,
        user_id: req.tokenData._id,
      });
    }
    if (!(data.deletedCount == 1)) {
      return res
        .status(400)
        .json({ msg: "you cannot delete somthing you not add" });
    }
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

module.exports = router;
