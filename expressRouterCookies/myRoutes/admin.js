const express = require('express')
const adminRouter = express.Router()
const cookieParser = require('cookie-parser')

adminRouter.use(cookieParser('forSigningCookies'))
adminRouter.use((req, res, next) => {
  if (req.query.isAdmin) {
    next()
  } else {
    res.send("You are not an admin!")
  }
})

adminRouter.get('/', (req, res) => {
  res.cookie('Barbed Wire', 'Yes', { signed: true })
  res.cookie('notASignedCookie', 101)
  // This won't display signed cookies
  console.log(req.cookies)
  // This will display signed cookies
  console.log(req.signedCookies)
  res.send("You are an admin, and cookie has been signed")
})

module.exports = adminRouter