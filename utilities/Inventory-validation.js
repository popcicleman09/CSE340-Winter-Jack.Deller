const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const inventoryModel = require("../models/inventory-model")

  validate.inventoryRules = () => {
    return [
        body("inv_make")
        .trim()
        .escape()
        .notEmpty().withMessage("inventory make is required")
        .isLength({min: 1}).withMessage("inventory make must be at least 1 character long")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("inventory make must only have letters and numbers"),

        body("classification_id")
        .trim()
        .notEmpty().withMessage("Classification selection is required")
        .isInt({ min: 1}).withMessage("Invalid classification selection"),

        body("inv_model")
        .trim()
        .escape()
        .notEmpty().withMessage("inventory model is required")
        .isLength({min: 1}).withMessage("inventory model must be at least 1 character long")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("inventory model must only have letters and numbers"),

        body("inv_year")
        .trim()
        .escape()
        .notEmpty().withMessage("inventory year is required")
        .isLength({min: 1}).withMessage("inventory year must be at least 1 character long")
        .matches(/^[0-9]+$/).withMessage("inventory year must only be numbers"),

        body("inv_description")
        .trim()
        .escape()
        .notEmpty().withMessage("inventory description is required")
        .isLength({min: 1}).withMessage("inventory description must be at least 1 character long")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("inventory description must only have letters and numbers"),

        body("inv_image")
        .trim()
        .notEmpty().withMessage("Inventory image is required")
        .isLength({ min: 1 }).withMessage("Inventory image must be at least 1 character long")
        .matches(/^[a-zA-Z0-9._\/-]+$/).withMessage("Inventory image must only contain letters, numbers, dots, underscores, dashes, and slashes"),

        body("inv_thumbnail")
        .trim()
        .notEmpty().withMessage("inventory thumbnail is required")
        .isLength({min: 1}).withMessage("inventory thumbnail must be at least 1 character long")
        .matches(/^[a-zA-Z0-9._\/\\-]+$/).withMessage("inventory thumbnail must only have letters and numbers"),

        body("inv_price")
        .trim()
        .escape()
        .notEmpty().withMessage("inventory price is required")
        .isLength({min: 1}).withMessage("inventory price must be at least 1 character long")
        .matches(/^[0-9]+$/).withMessage("inventory price must only be numbers"),

        body("inv_miles")
        .trim()
        .escape()
        .notEmpty().withMessage("inventory miles is required")
        .isLength({min: 1}).withMessage("inventory miles must be at least 1 character long")
        .matches(/^[0-9]+$/).withMessage("inventory miles must only be numbers"),

        body("inv_color")
        .trim()
        .escape()
        .notEmpty().withMessage("inventory color is required")
        .isLength({min: 1}).withMessage("inventory color must be at least 1 character long")
        .matches(/^[a-zA-Z0-9]+$/).withMessage("inventory color must only have letters and numbers"),
    ]
  }

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

  validate.checkInventoryData = async (req, res, next) => {
    const {inv_make,inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        let classification_list = await utilities.buildClassificationList()
        res.render("inventory/addInventory", {
            errors,
            title: "Add Inventory",
            nav,
            inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color,
            classification_list,
        });
        return
    }
    next();
  };

  validate.checkUpdateData = async (req, res, next) => {
    const {inv_id, classification_id ,inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()){
      let nav = await utilities.getNav()
      const inventory_id = parseInt(req.params.inventory_id)
      let classification_list = await utilities.buildClassificationList(classification_id)

      console.log(`Editing Inventory ID:${inventory_id}`)
      console.log(`classificaiton ID: ${classification_id}`)
      const title = `Edit Inventory: ${inv_make} ${inv_model}`
      res.render("inventory/editInventory",{
        title,
        nav,
        classification_list,
        errors,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
      })
      
        return
    }
    next();
  };

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