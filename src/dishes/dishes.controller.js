const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
/*
{
  "data": [
    {
      "id": "d351db2b49b69679504652ea1cf38241",
      "name": "Dolcelatte and chickpea spaghetti",
      "description": "Spaghetti topped with a blend of dolcelatte and fresh chickpeas",
      "price": 19,
      "image_url": "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?h=530&w=350"
    }
  ]
}
*/

// TODO
function create(req, res) {
    const { data: { href } = {} } = req.body;
    const newUrls = {
      id: urls.length + 1,
      href,
    };
    urls.push(newUrls);
    res.status(201).json({ data: newUrls });
  }

function nameValidation(req, res, next){
    const { data: { name } = {} } = req.body;

    if (name) {
      return next();
    }
    next({ status: 400, message: "A 'href' property is required." });
}

// DONE
function read(req, res, next) {
  const { dishId } = req.params;
  const dishFound = dishes.find((dish) => dish.id === dishId);
  res.json({ data: dishFound });
}

// TODO
function update(req, res) {
  const foundUse = res.locals.use;
  const { data: { text } = {} } = req.body;
  foundUse.text = text;
  res.json({ data: foundUse });
}

// DONE
function list(req, res, next) {
  res.json({ data: dishes });
}

module.exports = {
  create,
  read,
  update,
  list,
};
