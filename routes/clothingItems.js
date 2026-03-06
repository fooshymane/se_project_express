const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingItems");
const { validateId } = require("../middlewares/validators");
const {
  validateCardBody,
  validateCardBodyUpdate,
} = require("../middlewares/validation");

router.get("/", getClothingItems);

router.post("/", validateCardBody, createClothingItem);

router.patch(
  "/:itemId",
  validateId,
  validateCardBodyUpdate,
  updateClothingItem
);
router.delete("/:itemId", validateId, deleteClothingItem);
router.put("/:itemId/likes", validateId, likeClothingItem);
router.delete("/:itemId/likes", validateId, dislikeClothingItem);

module.exports = router;