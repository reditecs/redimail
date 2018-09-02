"use strict"
//Dependencias
const mongoose = require("mongoose")
var request = require('request');
const config = require("./config")
//Modelos
const Domain = require("./models/domain")
//Configs
const delayNoValid = ((config.delay.noValidDomainChecker) * 60) * 1000
const delayValid = ((config.delay.validDomainChecker) * 60) * 1000
var countNoValid = 1
var countValid = 1

//Base de datos y bucle
mongoose.connect(config.mongodb.url,{ useNewUrlParser: true }, (err, res) => {
  if(err){
    return console.log("Error en base de datos => " + err)
  }else{
    console.log("Conexion con base de datos establecida")
    console.log("Iniciando bucle infinito - dominios no validos - lapso de " + delayNoValid + " milisegundos / " + config.delay.noValidDomainChecker + " minutos")
    
    
    
    setInterval(() => {
      console.log("Iniciando aprobacion de dominios no validos #" + countNoValid)
      Domain.find({status:false}, (err, domains) => {
        if(err){
          console.log('DataBase Error')
        }else{
          let domainMap = []
          domains.forEach(function(dom) { 
            domainMap.push(dom.domain)
          })
          for(const domain of domainMap) {
            request("http://" + domain + "/api/domain/validate", function (error, response, body) {
              if(err){
                Domain.findOneAndUpdate({domain}, {status:false}, (err, updated) => {
                   if(err){
                       console.log(domain + " => Error #201 -  Reintentando en " + config.delay.validDomainChecker + " minutos")
                   }else{
                     console.log(domain + " => Error al verificar propiedad")
                   }
                 })    
              }else{
                 if(body == domain){
                   Domain.findOneAndUpdate({domain}, {status:true}, (err, updated) => {
                     if(err){
                       console.log(domain + " => Error #202 -  Reintentando en " + config.delay.validDomainChecker + " minutos")
                     }else{
                       console.log(domain + " => El dominio ya esta activo y puede usarse")
                     }
                   })
                 }else{
                   Domain.findOneAndUpdate({domain}, {status:false}, (err, updated) => {
                     if(err){
                       console.log(domain + " => Error #203 -  Reintentando en " + config.delay.validDomainChecker + " minutos")
                     }else{
                       console.log(domain + " => Error al verificar propiedad")
                     }
                   })
                 }
              }
            });
          }
        }
      });
      countNoValid++
    }, delayNoValid)
   
    console.log("Iniciando bucle infinito - dominios validos - lapso de " + delayValid + " milisegundos / " + config.delay.validDomainChecker + " minutos")
    
    setInterval(() => {
      console.log("* Iniciando aprobacion de dominios validos #" + countValid)
      Domain.find({status:true}, (err, domains) => {
        if(err){
          console.log('DataBase Error')
        }else{
          let domainMap = []
          domains.forEach(function(dom) { 
            domainMap.push(dom.domain)
          })
          for(const domain of domainMap) {
            request("http://" + domain + "/api/domain/validate", function (error, response, body) {
              if(err){
                Domain.findOneAndUpdate({domain}, {status:false}, (err, updated) => {
                   if(err){
                       console.log("* " + domain + " => Error #201 -  Reintentando en " + config.delay.noValidDdomainChecker + " minutos")
                   }else{
                     console.log("* " + domain + " => Error al verificar propiedad")
                   }
                 })    
              }else{
                 if(body == domain){
                   Domain.findOneAndUpdate({domain}, {status:true}, (err, updated) => {
                     if(err){
                       console.log("* " + domain + " => Error #202 -  Reintentando en " + config.delay.noValidDdomainChecker + " minutos")
                     }else{
                       console.log("* " + domain + " => El dominio ya esta activo y puede usarse")
                     }
                   })
                 }else{
                   Domain.findOneAndUpdate({domain}, {status:false}, (err, updated) => {
                     if(err){
                       console.log("* " + domain + " => Error #203 -  Reintentando en " + config.delay.noValidDdomainChecker + " minutos")
                     }else{
                       console.log("* " + domain + " => Error al verificar propiedad")
                     }
                   })
                 }
              }
            });
          }
        }
      });
      countValid++
    }, delayValid)
    
 }
})

