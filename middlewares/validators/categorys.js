const path = require("path");
const validator = require("validator");
const { event } = require("../../models");

exports.createOrUpdateCategoryValidator = async (req, res, next) => {
  try {
    const errors = [];

    if (validator.isEmpty(req.body.name)) {
      errors.push(" name must be filled");
    }

    if (errors.length > 0) {
      return res.status(404).json({ errors: errors });
    }
    next();
  } catch (error) {
    res.status(500).json({ status: 500, errors: "Internal Server Error validator create update category", message: error });
  }
};
