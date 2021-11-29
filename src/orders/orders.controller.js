const path = require("path");
// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));
// const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// ORDERS
function create(req, res) {
  const { data: obj = {} } = req.body;
  const newOrder = {
    id: nextId(),
    ...obj,
  };
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function read(req, res, next) {
  const { orderId } = req.params;
  const orderFound = orders.find((order) => order.id === orderId);

  if (orderFound) {
    res.json({ data: orderFound });
    return next();
  }
  next({
    status: 404,
    message: `Order id does not exist: ${orderId}`,
  });
}

function update(req, res) {
  const { data: { deliverTo, mobileNumber, dishes, status } = {} } = req.body;

  res.locals.order = {
    id: res.locals.order["id"],
    deliverTo,
    mobileNumber,
    dishes,
    status,
  };

  res.json({ data: res.locals.order });
}

function destroy(req, res) {
  const orderIndex = orders.indexOf(res.locals.order);
  orders.splice(orderIndex, 1);

  res.sendStatus(204);
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
  const dishes = req.body.data.dishes;
  for (let index = 0; index < dishes.length; index++) {
    if (!dishes[index].quantity || typeof dishes[index].quantity !== "number") {
      return next({
        status: 400,
        message: `Dish ${index} must have a quantity that is an integer greater than 0`,
      });
    }
  }
  next();
}

function statusValidator(req, res, next) {
  const { data: { status } = {} } = req.body;

  if (
    status !== ("pending" || "preparing" || "out-for-delivery" || "delivered")
  ) {
    return next({
      status: 400,
      message:
        "Order must have a status of pending, preparing, out-for-delivery, delivered",
    });
  }
  if (status === "delivered") {
    return next({
      status: 400,
      message: "A delivered order cannot be changed",
    });
  }
  next();
}

function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);

  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }

  next({
    status: 404,
    message: `Order id does not exist: ${orderId}`,
  });
}

function validateDestroy(req, res, next) {
  if (res.locals.order.status !== "pending") {
    return next({
      status: 400,
      message: "An order cannot be deleted unless it is pending",
    });
  }

  next();
}

function list(req, res) {
  res.json({ data: orders });
}

function matchId(req, res, next) {
  const { orderId } = req.params;
  const { id } = req.body.data;

  if (id && id !== orderId) {
    return next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}`,
    });
  }
  next();
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
    statusValidator,
    matchId,
    update,
  ],
  delete: [orderExists, validateDestroy, destroy],
  list,
};
