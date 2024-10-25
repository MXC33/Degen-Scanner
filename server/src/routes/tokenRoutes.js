// server/src/routes/tokenRoutes.js

const express = require("express");
const router = express.Router();
const {
  fetchTokenInfo,
  compareTokens,
  fetchTokenAccountsController,
} = require("../controllers/tokenController");

// Route to get token information
router.get("/token-info/:mintAddress", fetchTokenInfo);

// Route to compare two tokens
router.get("/token-compare/:mintAddress1/:mintAddress2", compareTokens);

// Route to get all token accounts (owners) for a token
router.get("/token-accounts/:mintAddress", fetchTokenAccountsController);

module.exports = router;
