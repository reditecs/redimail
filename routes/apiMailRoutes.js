'use strict'
const express = require("express")
const api = express.Router()
const apiCtrl = require("../controllers/apiMailCtrl")
//Middlewares
const vh = require("../middlewares/verifyHost")
const ao = require("../middlewares/allowOrigin")
//Api Routes
api.get("/", vh, apiCtrl.welcomeMessage)
api.get("/mailbox/:email",vh, ao, apiCtrl.mailbox)
api.get("/test/:email",vh, ao, apiCtrl.test)
api.get("/remove/:id",vh, ao, apiCtrl.remove)
api.get("/info/:id",vh, ao, apiCtrl.info)
api.get("/html/:id",vh, ao, apiCtrl.html)
api.get("/txt/:id",vh, ao, apiCtrl.txt)



module.exports = api