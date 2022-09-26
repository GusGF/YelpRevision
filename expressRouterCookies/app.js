const express = require('express')
const app = express()
const shelterRoutes = require('./myRoutes/shelters')

// Only requests to '/abc/*' will be sent to this router (prefix)
app.use('/abc', shelterRoutes)

app.listen(3005, () => {
  console.log('I am listening on port: 3005')
})