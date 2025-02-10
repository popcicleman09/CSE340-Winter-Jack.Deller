// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities/")
// Route to build inventory by classification view
router.get("/type/:classificationId", Util.handleErrors(invController.buildByClassificationId));
router.get("/detail/:inventory_id", Util.handleErrors(invController.buildByInventoryId))


// File Not Found Route - must be last route in list
router.get("/cause-error", Util.handleErrors((req, res, next) => {
    const error = new Error("This is an intentional server error.")
    error.status = 500
    next(error)
}))

module.exports = router;