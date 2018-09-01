'use strict'
const express = require("express")
const api = express.Router()
const apiCtrl = require("../controllers/apiCtrl")

//Api Routes
api.get("/", apiCtrl.welcomeMessage)
api.get("/listDomains", apiCtrl.listDomains)
api.post("/removeDomain", apiCtrl.removeDomain)
api.post("/newDomain", apiCtrl.newDomain)

module.exports = api