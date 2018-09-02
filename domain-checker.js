"use strict"
//Dependencias
const mongoose = require("mongoose")
const config = require("./config")
//Modelos
const Domain = require("./models/domain")

//Base de datos y bucle
mongoose.connect(config.mongodb.url,{ useNewUrlParser: true }, (err, res) => {
  if(err){
    return console.log("Error en base de datos => " + err)
  }else{
    console.log("Conexion con base de datos establecida")
    console.log("Iniciando bucle infinito")
    setInterval(() => {
    
      console.log("Iniciando aprobacion de dominios")
      Domain.find({status: false}, (err, domains) => {
        if(err){
          console.log('DataBase Error')
        }else{
          let domainMap = []
          domains.forEach(function(dom) { 
            domainMap.push(dom.domain)
          })
          for(const domain of domainMap) {
            console.log(domain)
          }
        }
      });
  
    }, 2000)
 }
})

