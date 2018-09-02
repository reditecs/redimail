'use strict'
const mongoose = require("mongoose")
const Domain = require("../models/domain")


function welcomeMessage(req, res){
  res.status(200).send("Welcome to redimail API system!")
}

function listDomains(req, res){
 //Domain.find({status: true, isPrivate: false}, (err, domains) => {
 Domain.find({}, (err, domains) => {
     if(!err){
      let domainMap = []
      domains.forEach(function(dom) { 
        domainMap.push(dom.domain + " - " + dom._id)
      })
      res.status(200).send({domains: domainMap})       
    }else{
      res.status(500).send({message: "Error #104 - Database fail"})
    }
  });
}

function removeDomain(req, res){
  if(!req.body.id){
     res.status(500).send({message: "Error #106 - ID required"})
  }else{
    Domain.remove({ _id: req.body.id }, function(err) {
      if(!err) {
        res.status(200).send({message:"Success"})
      }else{
        res.status(500).send({message: "Error #105 - Database fail"})
      }
    });    
  }
}

function newDomain(req, res){
  if(!(req.body.contactEmail && req.body.domain)){
     res.status(400).send({message: "Error #100 - Please verify your data"})
  }else{
     
    let contactEmail = req.body.contactEmail
    let domain = req.body.domain
    let isPrivate = false
    let banner = ""
    if(req.body.isPrivate){
      isPrivate = req.body.isPrivate
    }
    if(req.body.banner){
      banner = req.body.banner   
    }
    
    var domainRegex = /[a-zA-Z0-9]{2,256}\.[a-z]{2,10}/
    var regex = new RegExp(domainRegex)
    if(!domain.match(regex)) {
      
      res.status(400).send({message: "Error #101 - Invalid domain"})
      
    }else{
      
      var emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      regex = new RegExp(emailRegex)
      
      if(!contactEmail.match(regex)) {
      
        res.status(400).send({message: "Error #102 - Invalid email"})

      }else{
        
        let newDomain = new Domain({
          contactEmail,
          domain,
          isPrivate,
          banner
        })
        
        newDomain.save((err, dom) => {
          if(!err){
            res.status(200).send({message: "Success"})
          }else{
            res.status(500).send({message: "Error #103 - Database fail"})
          }
        })
        
      }
    
    }
    
  }
}

function validateDomain(req,res){
  res.status(200).send(req.headers.host)
}

module.exports = {
  welcomeMessage,
  newDomain,
  listDomains,
  removeDomain,
  validateDomain
}