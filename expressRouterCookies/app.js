const express = require('express')
const app = express()
const shelterRoutes = require('./myRoutes/shelters')
const adminRoutes = require('./myRoutes/admin')


// Only requests to these matching prefixes will be sent to the respective router
app.use('/shelter', shelterRoutes)
app.use('/admin', adminRoutes)

app.listen(3005, () => {
  console.log('I am listening on port: 3005')
})