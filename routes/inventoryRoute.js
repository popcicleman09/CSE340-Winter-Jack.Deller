// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const Util = require("../utilities/")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventory_id", invController.buildByInventoryId)


// File Not Found Route - must be last route in list
router.get("/cause-error", Util.handleErrors((req, res, next) => {
    const error = new Error("This is an intentional server error.")
    error.status = 500  // Explicitly set status to 500
    next(error)  // Pass the error to the global error handler
}))

module.exports = router;