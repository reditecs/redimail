'use strict'
const express = require("express")
const api = express.Router()
const apiCtrl = require("../controllers/apiDomainCtrl")
//Middlewares
const vh = require("../middlewares/verifyHost")
const ao = require("../middlewares/allowOrigin")
//Api Routes
api.get("/", vh, apiCtrl.welcomeMessage)
api.get("/validate", ao, apiCtrl.validateDomain)
api.get("/list", ao, vh, apiCtrl.listDomains)
api.post("/remove", ao, vh, apiCtrl.removeDomain)
/*
Remover con atributo id en post
*/
api.post("/new",vh ,apiCtrl.newDomain)
/*
contactEmail
domain
isPrivate (opcional)
banner (opcional)
*/

module.exports = api