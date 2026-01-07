const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  savePhoto,
} = require("../controllers/user.controller");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateToken, currentUser);
router.put("/save-photo", validateToken, savePhoto);

module.exports = router;