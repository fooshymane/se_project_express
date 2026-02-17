const ClothingItem = require("../models/clothingItem");

const getClothingItems = (req, res) => ClothingItem.find({})
  .then((items) => res.status(200).send({ data: items }))
  .catch((err) => {
    console.error(err);
    res.status(500).send({ message: err.message });
  });

const createClothingItem = (req, res) => {
  if (!req.user) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const owner = req.user._id; 
  const { name, weather, imageUrl } = req.body;
  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
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
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  return ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({ message: "Item deleted successfully!" }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const likeClothingItem = (req, res) => {
  if (!req.user) {
    return res.status(401).send({ message: "Unauthorized" });
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
        return res.status(404).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const dislikeClothingItem = (req, res) => {
  if (!req.user) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const { itemId } = req.params;
  const userId = req.user._id; 
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
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