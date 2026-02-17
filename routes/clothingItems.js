const router = require("express").Router();
const {
  getClothingItems,
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
} = require("../controllers/clothingitems");

router.get("/", getClothingItems);

router.post("/", createClothingItem);

router.patch("/:itemId", updateClothingItem);
router.delete("/:itemId", deleteClothingItem);
router.put("/:itemId/likes", likeClothingItem);
router.delete("/:itemId/likes", dislikeClothingItem);

module.exports = router;