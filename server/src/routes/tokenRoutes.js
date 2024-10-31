// server/src/routes/tokenRoutes.js

const express = require("express");
const router = express.Router();
const {
  fetchTokenInfo,
  compareTokens,
} = require("../controllers/tokenController");

// Route to get token information
router.get("/token-info/:mintAddress", fetchTokenInfo);

// Route to compare two tokens
router.get("/token-compare/:mintAddress1/:mintAddress2", compareTokens);


module.exports = router;
