const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
  SERVER_ERROR,
} = require("../utils/errors");

const getClothingItems = (req, res) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });

const createClothingItem = (req, res) => {
  if (!req.user) {
    return res.status(UNAUTHORIZED).send({ message: "Unauthorized" });
  }
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;
  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

const updateClothingItem = (req, res) => {
  const { itemId } = req.params;
  const { name, weather, imageUrl } = req.body;
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { name, weather, imageUrl },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Clothing item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  const currentUserId = req.user?._id;

  return ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      const isOwner = currentUserId && item.owner.equals(currentUserId);
      if (!isOwner) {
        return res.status(FORBIDDEN).send({ message: "You may only delete items you have added." });
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(200).send({ message: "Item deleted successfully!" })
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Clothing item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

const likeClothingItem = (req, res) => {
  if (!req.user) {
    return res.status(UNAUTHORIZED).send({ message: "Unauthorized" });
  }
  const { itemId } = req.params;
  const userId = req.user._id;
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Clothing item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

const dislikeClothingItem = (req, res) => {
  if (!req.user) {
    return res.status(UNAUTHORIZED).send({ message: "Unauthorized" });
  }
  const { itemId } = req.params;
  const userId = req.user._id;
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "Clothing item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};
module.exports = {
  getClothingItems,
  createClothingItem,
  updateClothingItem,
  deleteClothingItem,
  likeClothingItem,
  dislikeClothingItem,
};