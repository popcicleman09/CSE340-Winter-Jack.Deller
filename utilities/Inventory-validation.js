const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const inventoryModel = require("../models/inventory-model")

  validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .escape()
        .notEmpty().withMessage("Classification name is required")
        .isLength({min: 1}).withMessage("Classification name must be at least 1 character long")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("Only letters and numbers")
    ]
  }

  validate.checkClassData = async (req, res, next) => {
    const {classification_name} = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("inventory/addClassification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        });
        return
    }
    next();
  };

  module.exports =  validate