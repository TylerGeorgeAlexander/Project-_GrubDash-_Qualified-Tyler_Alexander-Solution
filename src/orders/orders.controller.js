const path = require("path");
// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));
// const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// ORDERS
// TODO
function create(req, res) {
  const { data: obj = {} } = req.body;
  const newOrder = {
    id: nextId(),
    ...obj,
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
  if (!Array.isArray(dishes) || !dishes || dishes.length === 0) {
    return next({
      status: 400,
      message: "Order must include at least one dish",
    });
  }
  return next();
}

function quantityValidation(req, res, next) {
  next();
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
  const orderId = req.params.orderId;
  const orderFound = orders.find((order) => order.id === orderId);
  const { data: { text } = {} } = req.body;
  orderFound.text = text;
  res.json({ data: orderFound });
}

function orderExists(req, res, next) {
  const orderId = req.params.orderId;
  const foundOrder = orders.find((order) => order.id === orderId);
  if (foundOrder) {
    res.locals.use = foundOrder;
    return next();
  }
  if (orders.id !== req.body.orderId) {
    next({
      status: 404,
      message: `Order id does not match route id. Order: ${orders.id}, Route: ${orderId}.`,
    });
  }
  next({
    status: 404,
    message: `${orderId}`,
  });
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
    orderExists,
    update,
  ],
  delete: [orderExists, destroy],
  list,
};
