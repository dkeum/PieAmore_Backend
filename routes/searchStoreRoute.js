const express = require("express");
const router = express.Router();
const searchStoreController = require("../controllers/searchStoreController");


router.post("/pizza-store", searchStoreController.searchStores); //sender id in the params

module.exports = router;