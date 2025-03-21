const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()
/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/*************
* Build details page html
***************/
Util.buildInventoryDetails = async function (data) {
  let detail = ""


  detail += "<div id='Horizontal_split'>"
    detail += "<div>"
      detail += `<img src=${data.inv_image} alt=${data.inv_model}>`
    detail += "</div>"

    detail += "<div>"
      detail += `<p>Price: $${parseInt(data.inv_price).toLocaleString()}</p>`
      detail += `<p>Year: ${data.inv_year}</p>`
      detail += `<p>Miles: ${data.inv_miles.toLocaleString()}</p>`
      detail += `<p>Color: ${data.inv_color}</p>`
      detail += `<p>Description: ${data.inv_description}</p>`
    detail += "</div>"
  detail += "</div>"
  return detail
}

/**
 * build classification list
 */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList = '<select name="classification_id" id="classificationList" required>';

  let hasSelected = false; // Track if any option is selected

  data.rows.forEach((row) => {
    let selectedAttr = "";
    if (classification_id != null && row.classification_id == classification_id) {
      selectedAttr = " selected"; // Ensure correct space before attribute
      hasSelected = true;
    }

    classificationList += `<option value="${row.classification_id}"${selectedAttr}>${row.classification_name}</option>`;
  });

  // Only add "Choose a Classification" if no option was pre-selected
  if (!hasSelected) {
    classificationList += "<option value='' selected>Choose a Classification</option>";
  } else {
    classificationList += "<option value=''>Choose a Classification</option>";
  }

  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  res.locals.loggedin=0;
  res.locals.accountData=null;

  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login/")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /*
 * check for admin/employe
 */
Util.requireEmployeeOrAdmin = (req, res, next) => {
  if(!res.locals.loggedin){
    req.flash("notice", "You must be logged in to access this page");
    return res.redirect("/account/login")
  }

  const {account_type} = res.locals.accountData;

  if(account_type === "Employee" || account_type === "Admin"){
    next();
  } else {
    req.flash("notice", "You do not have the permission to view this page.")
    return res.redirect("/account/login")
  }
}

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


module.exports = Util