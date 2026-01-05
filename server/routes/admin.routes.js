const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUser,
  addUser,
  removeUser,
} = require("../controllers/adminController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken);
router.get("/", getAllUsers);
router
  .get("/:id", getUser)
  .put("/:id", addUser)
  .delete("/:id", removeUser);

module.exports = router;
