const express = require("express"); // Import Express

// Import Validators
const {
  createOrUpdateCategoryValidator,
} = require("../middlewares/validators/categorys");

const {
  isLogged
} = require('../middlewares/auth')

// Import controllers
const {
  getAllCategory,
  createCategory,
  getOneCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/categorys");

const router = express.Router();

router
  .route("/")
  .get(getAllCategory)
// .post(isLogged, createOrUpdateCategoryValidator, createCategory);

router
  .route("/:id")
  .get(isLogged, getOneCategory)
// .put(isLogged, createOrUpdateCategoryValidator, updateCategory)
// .delete(isLogged, deleteCategory);

// Exports
module.exports = router;
