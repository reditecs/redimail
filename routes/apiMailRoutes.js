'use strict'
const express = require("express")
const api = express.Router()
const apiCtrl = require("../controllers/apiMailCtrl")
//Middlewares
const vh = require("../middlewares/verifyHost")
//Api Routes
api.get("/", vh, apiCtrl.welcomeMessage)
api.get("/mailbox/:email",vh, apiCtrl.mailbox)
api.get("/test/:email",vh, apiCtrl.test)
api.get("/remove/:id",vh, apiCtrl.remove)
api.get("/info/:id",vh, apiCtrl.html)
api.get("/html/:id",vh, apiCtrl.html)
api.get("/txt/:id",vh, apiCtrl.txt)



module.exports = api