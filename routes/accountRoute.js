// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const Util = require("../utilities/")

//Route for account pages
router.get("/login", Util.handleErrors(accountController.buildLogin))
router.get("/register", Util.handleErrors(accountController.buildRegister))


module.exports = router;