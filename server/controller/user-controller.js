const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/user/createAbl");
const ListAbl = require("../abl/user/listAbl");
const UpdateAbl = require("../abl/user/updateAbl");
const GetAbl = require("../abl/user/getAbl");

router.post("/create", (req, res) => {
  CreateAbl(req, res);
});

router.get("/list", (req, res) => {
  ListAbl(req, res);
});

router.get("/get", (req, res) => {
	GetAbl(req, res);
  });

router.post("/update", (req, res) => {
  UpdateAbl(req, res);
});

module.exports = router;
