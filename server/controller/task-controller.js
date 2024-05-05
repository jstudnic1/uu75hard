const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/task/createAbl");
const ListAbl = require("../abl/task/listAbl");
const UpdateAbl = require("../abl/task/updateAbl");
const GetAbl = require("../abl/task/getAbl");
const AddAbl = require("../abl/task/addAbl");
const DeleteAbl = require("../abl/task/deleteAbl");
const LoginAbl = require("../abl/user/loginAbl");

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

router.post("/:id/add", (req, res) => {
  AddAbl(req, res);
});

router.delete('/:id/delete', (req, res) => {
  DeleteAbl(req, res);
});

router.post("/login", (req, res) => {
    LoginAbl(req, res);
});


module.exports = router;
