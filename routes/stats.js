const express = require("express");
const router = express.Router();
const { getMutationStats } = require("../controllers/stats.controller");

router.get("/", getMutationStats);

module.exports = router;
