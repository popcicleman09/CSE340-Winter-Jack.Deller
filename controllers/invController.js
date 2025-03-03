const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/**
 * build by inventory id
 */
invCont.buildByInventoryId = async function (req, res, next) {
  console.log("requested inventory_id", req.params.inventory_id)
  const inventory_id = req.params.inventory_id
  const data = await invModel.getInventoryById(inventory_id)
  console.log("query result: ", data)
  const details = await utilities.buildInventoryDetails(data)
  let nav = await utilities.getNav()
  const title = `${data.inv_make} ${data.inv_model}`
  res.render("inventory/details",{
    title,
    nav,
    details,
  })
}

/**
 * Inventory managment
 */

invCont.buildInventoryManagement = async function (req, res, next) {
  console.log("Inventory Management being accessed")
  let nav = await utilities.getNav()
  const title = "Inventory Management"
  res.render("inventory/management",{
    title,
    nav,
  })
  
}

/**
 * Build Add new Inventory
 */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classification_list = await utilities.buildClassificationList()
  const title = "Add Inventory"
  res.render("inventory/addInventory",{
    title,
    nav,
    classification_list,
    errors: null,
  })
  
}

/**
 * Build Add new classification
 */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const title = "Add Classification"
  res.render("inventory/addClassification",{
    title,
    nav,
    errors: null,
  })
  
}

/**
 * process new inventory
 */
invCont.addInventory = async function (req, res) {
  try {
    const { inv_make, classification_id, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body;

    const result = await invModel.addInventory(inv_make, classification_id, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color);

    if (result.rowCount > 0) {
      req.flash("success", "Inventory item added successfully!");
      return res.redirect("/inv");
    } else {
      req.flash("error", "Failed to add inventory item.");
      return res.redirect("/inv/addInventory");
    }
  } catch (error) {
    console.error("Error adding inventory:", error);
    req.flash("error", "An unexpected error occurred.");
    return res.redirect("/inv/addInventory");
  }
};

/**
 * process new classificaiton
 */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  try {
    const existing = await invModel.getClassification(classification_name)
    if (existing > 0){
      let nav = await utilities.getNav()
      const title = "Add Classification"
      req.flash("notice", 'classification already exists')
      return res.status(400).render("inventory/addClassification",{
        title,
        nav,
        errors: null,
        classification_name,

      });
    }

    // classification doesnt already exist
    const result = await invModel.addClassification(classification_name)
    if (result.rowCount > 0) {
      req.flash("success", "Classification added successfully!");
      return res.redirect("/inv/");
    } else {
      throw new Error("Database insert failed");
    }
  }catch (error){
    console.error("error adding classification", error);
    req.flash("error", "An unexpected error occurred");
    res.status(500).redirect("/inv/addClassification");
  }
}

module.exports = invCont