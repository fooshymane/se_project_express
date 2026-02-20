const router = require("express").Router();

const auth = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingitems");

router.use((req, res, next) => {
  const isSignin = req.method === "POST" && req.path === "/signin";
  const isSignup = req.method === "POST" && req.path === "/signup";
  const isGetItems = req.method === "GET" && req.path === "/items";
  if (isSignin || isSignup || isGetItems) {
    return next();
  }
  return auth(req, res, next);
});

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found." });
});

module.exports = router;