const express = require('express')
const app = express()
const session = require('express-session')

/* This middleware automatically sends a cookie to the browser which contains a unique ID called a session I.D. SID, which will link to a memory space on the server where I can store info  */
app.use(session({ secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false }))
// app.use(session({ secret: 'thisisnotagoodsecret' }))

app.get('/viewcount', (req, res) => {
  // Here we add a variable to the session calling it 'count'
  // this will be stored server side
  if (req.session.count) {
    req.session.count += 1
  } else {
    req.session.count = 1
  }
  res.send(`You have like this page ${req.session.count} times`)
})

app.get('/register', (req, res) => {
  const { username = "No name" } = req.query
  req.session.username = username
  res.redirect('/greet')
})

app.get('/greet', (req, res) => {
  const { username } = req.session
  const { count } = req.session
  res.send(`Welcome ${username} you have ${count} calls`)
})

app.listen(3003, () => {
  console.log('Listening on Port 3003')
})