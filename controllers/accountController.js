const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const reviewModel = require("../models/review-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()
/* **
* Build login view
* **/

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login",{
        title: "Login",
        nav,
        errors: null,
    })
}
/* **************
* build register view
* ***************/
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register",{
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
  
    // Hash the password before storing
    let hashedPassword
    try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
    })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )

    
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
      })
    }
  }

  /*
  * Process update user information
  */

  async function updateUserInformation(req, res) {
    let nav = await utilities.getNav()
    const {account_id, account_firstname, account_lastname, account_email} = req.body

    const updateResult = await accountModel.updateUserInformation(
      account_id,account_firstname,account_lastname,account_email
    )

    if(updateResult){
      req.flash("notice", `Your account has been updated`)
      res.status(201).render("account/managment", {
        title: "account managment",
        nav
      })
    } else {
      req.flash("notice", "Sorry, the update failed")
      res.status(501).render("account/managment", {
        title: "account managment",
        nav
      })
    }
  }

  /*
  * Process update password
  */

  async function updatePassword(req, res) {
    let nav = await utilities.getNav()
    const {account_id, account_password} = req.body

    let hashedPassword
    try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
    })
    }

    const updateResult = await accountModel.updatePassword(
      account_id,account_password
    )

    if(updateResult){
      req.flash("notice", `Your account has been updated`)
      res.status(201).render("account/managment", {
        title: "account managment",
        nav
      })
    } else {
      req.flash("notice", "Sorry, the update failed")
      res.status(501).render("account/managment", {
        title: "account managment",
        nav
      })
    }
  }

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  console.log("login attempt")
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

async function buildManagment(req, res, next) {
  const nav = await utilities.getNav()
  const token = jwt.decode(req.cookies.jwt)
  console.log(jwt.decode)
  const reviews = await utilities.buildReviewsByAccount(token.account_id)
  res.render("account/managment",{
    title: "account managment",
    nav,
    reviews
  }
  ) 
}

/**
 * update user information
 */

async function buildUpdate(req,res,next) {
  const account_id = parseInt(req.params.account_id)
  const nav = await utilities.getNav()
  const userData = await accountModel.getAccountById(account_id)
  res.render("account/update",{
    title:`Update Account:${userData.account_id}`,
    nav,
    account_id: userData.account_id,
    account_firstname: userData.account_firstname,
    account_lastname: userData.account_lastname,
    account_email: userData.account_email,
    account_password: null,
    errors: null,
  })
}

// delete review
async function deleteReview(req,res) {
  const review_id = req.params.review_id
  console.log("deleting review: " + review_id )
  await reviewModel.deleteReview(review_id)

  const nav = await utilities.getNav()
  const token = jwt.decode(req.cookies.jwt)
  console.log(jwt.decode)
  const reviews = await utilities.buildReviewsByAccount(token.account_id)
  res.redirect("account/managment",{
    title: "account managment",
    nav,
    reviews
  }
  ) 
  
}

//update review
async function updateReview(req,res) {
  const {review_id, review_text} = req.body
  console.log("updating review: " + review_id + " With text: " + review_text)
  await reviewModel.updateReview(review_id, review_text)

  const nav = await utilities.getNav()
  const token = jwt.decode(req.cookies.jwt)
  console.log(jwt.decode)
  const reviews = await utilities.buildReviewsByAccount(token.account_id)
  res.render("account/managment",{
    title: "account managment",
    nav,
    reviews
  }
  ) 
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagment, buildUpdate,updateUserInformation,updatePassword, updateReview,deleteReview}