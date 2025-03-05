// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities/")
const invValidate = require('../utilities/Inventory-validation')
// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventory_id", Util.handleErrors(invController.buildByInventoryId))
router.get("/", Util.handleErrors(invController.buildInventoryManagement))
router.get("/addInventory" , Util.handleErrors(invController.buildAddInventory))
router.get("/addClassification", Util.handleErrors(invController.buildAddClassification))

//addClassificaiton post 
router.post(
    "/addClassification", 
    invValidate.classificationRules(),
    invValidate.checkClassData,
    Util.handleErrors(invController.addClassification)

)

//addInventory post
router.post(
    "/addInventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    Util.handleErrors(invController.addInventory)
)
// File Not Found Route - must be last route in list
router.get("/cause-error", Util.handleErrors((req, res, next) => {
    const error = new Error("This is an intentional server error.")
    error.status = 500
    next(error)
}))

//find by clssification_id
router.get("/getInventory/:classification_id",
    Util.handleErrors(invController.getInventoryJSON)
)

//edit inventory item
router.get("/edit/:inventory_id",
    Util.handleErrors(invController.buildEditInventoryItem)
)
router.post("/update/",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    Util.handleErrors(invController.updateInventory)
)

module.exports = router;