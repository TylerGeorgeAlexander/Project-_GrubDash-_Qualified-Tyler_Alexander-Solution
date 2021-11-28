const path = require("path");
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

function create(req, res) {
  const { data: obj = {} } = req.body;
  const newDish = {
    id: nextId(),
    ...obj,
  };
  dishes.push(newDish);
  res.status(201).json({ data: newDish });
}

// Validation functions
function nameValidation(req, res, next) {
  const { data: { name } = {} } = req.body;

  if (name) {
    return next();
  }
  next({ status: 400, message: "Dish must include a name" });
}

function descriptionValidation(req, res, next) {
  const { data: { description } = {} } = req.body;

  if (description) {
    return next();
  }
  next({ status: 400, message: "Dish must include a description" });
}

function priceValidation(req, res, next) {
  const { data: { price } = {} } = req.body;

  if (!price) {
    return next({ status: 400, message: "Dish must include a price" });
  } else if (typeof price !== "number" || price < 1) {
    return next({
      status: 400,
      message: "Dish must have a price that is an integer greater than 0",
    });
  }
  return next();
}

function imageUrlValidation(req, res, next) {
  const { image_url } = req.body.data;

  if (image_url) {
    return next();
  }
  next({ status: 400, message: "Dish must include a image_url" });
}

function idValidation(req, res, next) {
  const { dishId } = req.params;
  const dishFound = dishes.find((dish) => dish.id === dishId);
  if (dishFound) {
    res.locals.dish = dishFound;
    return next();
  }
  next({ status: 404, message: `Dish does not exist: ${dishId}` });
}

function read(req, res) {
  const dishFound = res.locals.dish;
  res.json({ data: dishFound });
}

function updateValidation(req, res, next) {
  const { dishId } = req.params;
  const { data: { id } = {} } = req.body;

  if (!id || id === dishId) {
    res.locals.dishId = dishId;
    return next();
  }

  next({
    status: 400,
    message: `Dish id does not match route id. Dish: ${id}, Route: ${dishId}`,
  });
}

function update(req, res) {
  const { data: { name, description, price, image_url } = {} } = req.body;

  res.locals.dish = {
    id: res.locals.dishId,
    name,
    description,
    price,
    image_url,
  };

  res.json({ data: res.locals.dish });
}

function list(req, res) {
  res.json({ data: dishes });
}

module.exports = {
  create: [
    nameValidation,
    descriptionValidation,
    priceValidation,
    imageUrlValidation,
    create,
  ],
  read: [idValidation, read],
  update: [
    idValidation,
    nameValidation,
    descriptionValidation,
    priceValidation,
    imageUrlValidation,
    updateValidation,
    update,
  ],
  list,
};
