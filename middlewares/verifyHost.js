"use strict"
const config = require("../config/index")
function testDomain(req, res, next){
  if(req.headers.host != config.express.defaultUrl){
    res.redirect("http://"+config.express.defaultUrl)   
  }else{
    next()
  }
}
module.exports = testDomain