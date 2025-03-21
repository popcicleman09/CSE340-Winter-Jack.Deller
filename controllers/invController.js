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
  const classificationSelect = await utilities.buildClassificationList()
  const title = "Inventory Management"
  res.render("inventory/management",{
    title,
    nav,
    classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/**
 * build confirm delete view
 */
invCont.buildDeleteConfirmation = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inventory_id = parseInt(req.params.inventory_id)
  const inventory_data = await invModel.getInventoryById(inventory_id)
  let classification_list = await utilities.buildClassificationList(inventory_data.classification_id)

  console.log(`Confirming delete Inventory ID:${inventory_id}`)
  const title = `Delete Inventory: ${inventory_data.inv_make} ${inventory_data.inv_model}`
  res.render("inventory/delete-confirm",{
    title,
    nav,
    classification_list,
    errors: null,
    inv_id: inventory_data.inv_id,
    inv_make: inventory_data.inv_make,
    inv_model: inventory_data.inv_model,
    inv_year: inventory_data.inv_year,
    inv_description: inventory_data.inv_description,
    inv_image: inventory_data.inv_image,
    inv_thumbnail: inventory_data.inv_thumbnail,
    inv_price: inventory_data.inv_price,
    inv_miles: inventory_data.inv_miles,
    inv_color: inventory_data.inv_color,
    classification_id: inventory_data.classification_id
  })
}

/**
 * build edit inventory item
 */
invCont.buildEditInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inventory_id = parseInt(req.params.inventory_id)
  const inventory_data = await invModel.getInventoryById(inventory_id)
  let classification_list = await utilities.buildClassificationList(inventory_data.classification_id)

  console.log(`Editing Inventory ID:${inventory_id}`)
  console.log(`classificaiton ID: ${inventory_data.classification_id}`)
  const title = `Edit Inventory: ${inventory_data.inv_make} ${inventory_data.inv_model}`
  res.render("inventory/editInventory",{
    title,
    nav,
    classification_list,
    errors: null,
    inv_id: inventory_data.inv_id,
    inv_make: inventory_data.inv_make,
    inv_model: inventory_data.inv_model,
    inv_year: inventory_data.inv_year,
    inv_description: inventory_data.inv_description,
    inv_image: inventory_data.inv_image,
    inv_thumbnail: inventory_data.inv_thumbnail,
    inv_price: inventory_data.inv_price,
    inv_miles: inventory_data.inv_miles,
    inv_color: inventory_data.inv_color,
    classification_id: inventory_data.classification_id
  })
  
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
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
  }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
  } = req.body
  const updateResult = await invModel.deleteInventory(
    inv_id,  

  )

  if (updateResult) {
    req.flash("notice", `The ${inv_id} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    req.flash("error", `The ${inv_id} was not deleted`)
    res.redirect(`/inv/delete/${inv_id}`)
    }
  }

module.exports = invCont