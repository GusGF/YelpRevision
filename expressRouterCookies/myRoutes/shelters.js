const express = require('express')
const cookieParser = require('cookie-parser')

/* A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. */
const shelterRouter = express.Router();

shelterRouter.use(cookieParser())

// Any route ending in the following suffixes will be matched
shelterRouter.get('/', (req, res) => {
  res.cookie('name', 'Fergus')
  res.cookie('animal', 'Harlequin')
  res.cookie('music', 'Hot Chip')
  res.send("View All Shelters: Cookie set")
})

shelterRouter.get('/:id', (req, res) => {
  console.log(req.cookies)
  res.send("View a specific Shelter")
})

shelterRouter.get('/:id/edit', (req, res) => {
  res.send("Edit a Shelter")
})

shelterRouter.post('/', (req, res) => {
  res.send("Create a Shelter")
})

module.exports = shelterRouter;