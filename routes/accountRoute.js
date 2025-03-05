// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const Util = require("../utilities/")
const regValidate = require('../utilities/account-validation')
//Route for account pages
router.get("/", Util.checkLogin , Util.handleErrors(accountController.buildManagment))
router.get("/login", Util.handleErrors(accountController.buildLogin))
router.get("/register", Util.handleErrors(accountController.buildRegister))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    Util.handleErrors(accountController.registerAccount)
)

  // Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogInData,
    Util.handleErrors(accountController.accountLogin)
)
module.exports = router;