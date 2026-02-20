const router = require("express").Router();
const { login, getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);
router.post("/login", login);

module.exports = router;