const express = require('express')
const adminRouter = express.Router()

adminRouter.use((req, res, next) => {
  if (req.query.isAdmin) {
    next()
  } else {
    res.send("You are not an admin!")
  }
})

adminRouter.get('/', (req, res) => {
  res.send("You are an admin")
})

module.exports = adminRouter