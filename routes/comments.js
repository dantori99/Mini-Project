const express = require("express");

// import validators
const {
  createOrUpdateCommentValidator,
} = require("../middlewares/validators/comments");
const { isLogged } = require("../middlewares/auth");
// import controllers
const {
  getAllComment,
  createComment,
  getDetailComment,
  deleteComment,
  updateComment,
} = require("../controllers/comments");

const router = express.Router();

// it will find route that has / first. after that it, will find is it GET or POST
router
  .route("/")
  .get(isLogged, getAllComment)
  .post(isLogged, createOrUpdateCommentValidator, createComment);

// it will find route that has /: id first. after that, it will find is it GET or PUT or DELETE
router
  .route("/:id")
  .get(isLogged, getDetailComment)
  .put(isLogged, createOrUpdateCommentValidator, updateComment)
  .delete(isLogged, deleteComment);

module.exports = router;
