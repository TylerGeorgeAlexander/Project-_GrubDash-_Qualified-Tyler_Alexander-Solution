const path = require("path");
// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));
// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// ORDERS
// TODO
function create(req, res) {
  const { data: { obj } = {} } = req.body;
  const newOrder = {
    id: nextId,
    deliverTo,
    mobileNumber,
    status,
    dishes,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

// Validation functions

function deliverToValidation(req, res, next) {
  const { data: { deliverTo } = {} } = req.body;
  if (deliverTo) {
    return next();
  }
  next({ status: 400, message: "Order must include a deliverTo" });
}

function mobileNumberValidation(req, res, next) {
  const { data: { mobileNumber } = {} } = req.body;
  if (mobileNumber) {
    return next();
  }
  next({ status: 400, message: "Order must include a mobileNumber" });
}

function dishesValidation(req, res, next) {
  const { data: { dishes } = {} } = req.body;
  if (dishes) {
    return next();
  }
  next({ status: 400, message: "Order must include at least one dish" });
}

function quantityValidation(req, res, next) {
  const { data: { quantity } = {} } = req.body;
  if (quantity) {
    return next();
  }
  next({
    status: 400,
    message: `Dish ${index} must have a quantity that is an integer greater than 0`,
  });
}

// DONE
function read(req, res) {
  const { orderId } = req.params;
  const orderFound = orders.find((order) => order.id === orderId);
  res.json({ data: orderFound });
}

// TODO
function update(req, res) {
  // const foundUse = res.locals.use;
  const orderId = Number(req.params.orderId);
  const orderFound = orders.find((order) => order.id === orderId);
  const { data: { text } = {} } = req.body;
  orderFound.text = text;
  res.json({ data: orderFound });
}

function destroy(req, res) {
  const { orderId } = req.params;
  const index = orders.findIndex((order) => order.id === Number(orderId));
  if (index > -1) {
    orders.splice(index, 1);
  }
  res.sendStatus(204);
}

// DONE
function list(req, res) {
  res.json({ data: orders });
}

module.exports = {
  create: [
    deliverToValidation,
    mobileNumberValidation,
    dishesValidation,
    quantityValidation,
    create,
  ],
  read,
  update: [
    deliverToValidation,
    mobileNumberValidation,
    dishesValidation,
    quantityValidation,
    update,
  ],
  delete: [destroy],
  list,
};
