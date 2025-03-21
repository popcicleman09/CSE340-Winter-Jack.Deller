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
router.get("/update/:account_id", Util.handleErrors(accountController.buildUpdate))
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

//logout of account //TODO its not done or working at all
router.get("/logout", (req, res) =>{
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/")
});

router.post(
  "/update/user", 
  regValidate.updateUserInformationRules(),
  regValidate.checkUpdateUserInformation,
  Util.handleErrors(accountController.updateUserInformation)
)

router.post(
  "/update/password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePassword,
  Util.handleErrors(accountController.updatePassword)
)
module.exports = router;