"use strict"
const express = require("express")
const config = require("../config")
const api = express.Router()

api.get("/", (req, res) => {
  res.render("index", { title: config.app.indexTitle})
})

module.exports = api