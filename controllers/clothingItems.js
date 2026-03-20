const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

const getClothingItems = (req, res, next) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);

const createClothingItem = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError("Unauthorized"));
  }
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;
  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      next(err);
    });
};

const updateClothingItem = (req, res, next) => {
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
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Clothing item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("The id string is in an invalid format"));
      }
      next(err);
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user?._id;

  return ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      const isOwner = currentUserId && item.owner.equals(currentUserId);
      if (!isOwner) {
        return next(new ForbiddenError("You may only delete items you have added."));
      }
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(200).send({ message: "Item deleted successfully!" })
      );
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Clothing item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("The id string is in an invalid format"));
      }
      next(err);
    });
};

const likeClothingItem = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError("Unauthorized"));
  }
  const { itemId } = req.params;
  const userId = req.user._id;
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Clothing item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("The id string is in an invalid format"));
      }
      next(err);
    });
};

const dislikeClothingItem = (req, res, next) => {
  if (!req.user) {
    return next(new UnauthorizedError("Unauthorized"));
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
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Clothing item not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("The id string is in an invalid format"));
      }
      next(err);
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