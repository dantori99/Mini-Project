const express = require("express");

// import validators
const {
  createOrUpdateCommentBookmark,
} = require("../middlewares/validators/bookmarks");
const { isLogged } = require("../middlewares/auth");

// import controllers
const {
  getAllBookmark,
  createBookmark,
  getDetailBookmark,
  deleteBookmark,
  updateBookmark,
  getMyBookmark
} = require("../controllers/bookmarks");

const router = express.Router();

// it will find route that has / first, after that it will find is it GET or POST
// router.get('/MyBookmark', getMyBookmark)
router
  .route("/")
  .get(getMyBookmark)
  .post(isLogged, createOrUpdateCommentBookmark, createBookmark);

//   it will find route that has /:id first, after that it will find is it GET or PUT or DELETE
router
  .route("/:id")
  // .get(isLogged, getDetailBookmark)
  // .put(isLogged, createOrUpdateCommentBookmark, updateBookmark)
  .delete(isLogged, deleteBookmark);

module.exports = router;
