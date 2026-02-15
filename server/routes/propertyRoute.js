const express = require("express");
const {
  getAllProperties,
  getFeaturedProperties,
  getPropertyById,
} = require("../controllers/propertyController");

const router = express.Router();

// GET /api/properties/featured — must be before /:id to avoid matching "featured" as an id
router.route("/featured").get(getFeaturedProperties);

// GET /api/properties
router.route("/").get(getAllProperties);

// GET /api/properties/:id
router.route("/:id").get(getPropertyById);

module.exports = router;
