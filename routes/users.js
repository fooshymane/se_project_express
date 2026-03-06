const router = require("express").Router();
const { login, getCurrentUser, updateProfile } = require("../controllers/users");
const {
  validateLoginBody,
  validateProfileBody,
} = require("../middlewares/validation");

router.get("/me", getCurrentUser);
router.patch("/me", validateProfileBody, updateProfile);
router.post("/login", validateLoginBody, login);

module.exports = router;