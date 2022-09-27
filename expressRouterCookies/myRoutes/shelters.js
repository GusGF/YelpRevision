const express = require('express')

/* A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. */
const shelterRouter = express.Router();

// Any route ending in the following suffixes will be matched
shelterRouter.get('/', (req, res) => {
  res.send("View All Shelters")
})

shelterRouter.get('/:id', (req, res) => {
  res.send("View a specific Shelter")
})

shelterRouter.get('/:id/edit', (req, res) => {
  res.send("Edit a Shelter")
})

shelterRouter.post('/', (req, res) => {
  res.send("Create a Shelter")
})

module.exports = shelterRouter;