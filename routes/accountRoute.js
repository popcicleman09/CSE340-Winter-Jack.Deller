// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const Util = require("../utilities/")
const regValidate = require('../utilities/account-validation')
//Route for account pages
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
    (req, res) => {
      res.status(200).send('login process')
    }
)
module.exports = router;