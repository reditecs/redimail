"use strict"
//dependencias
const mongoose = require("mongoose")
const config = require("./config")
//modelos
const Mail = require("./models/email")
//Servicios
const service = require("./services")

var count = 1
var delay = ((config.delay.emailWorkerDelay) * 60) * 1000

//Base de datos y bucle
mongoose.connect(config.mongodb.url,{ useNewUrlParser: true }, (err, res) => {
  if(err){
    return console.log("Error en base de datos => " + err)
  }else{
    console.log("Conexion con base de datos establecida")
    console.log("Iniciando bucle infinito cada " + config.delay.emailWorkerDelay + " minutos - Se borraran todos los emails que tengan mas de " + config.delay.deleteEmailAfter + " minutos")
    
    setInterval(() => {
      console.log("Iniciando sub proceso #" + count)
      Mail.find({}, (err, emails) => {
        if(err){
                console.log('DataBase Error')
              }else{
                let emailMap = []
                emails.forEach(function(dom){
                  let difference = service.diff_minutes(dom.receivedDate)
                  let remain = config.delay.deleteEmailAfter - difference
                  if(remain < 1){
                    Mail.remove({_id: dom._id}, (err) => {
                      if(err){
                        console.log(dom._id + " => " + difference + " => Error => " + err)
                      }else{
                        console.log(dom._id + " => " + difference + " => Deleted")
                      }
                    })
                  }else{
                    console.log(dom._id + " => Remain => " + remain)
                  }
                })
              }
      })
      count++
      }, delay)
    
    
  }
})