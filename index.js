"use strict"
const config = require("./config")
//Dependencias
const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const apiDomainRoutes = require("./routes/apiDomainRoutes")
const apiMailRoutes = require("./routes/apiMailRoutes")

const app = express()

//Middlewares
app.use(bodyParser.urlencoded({ extended : false }))
app.use(bodyParser.json())


//Routes
app.use("/api/domain", apiDomainRoutes)
app.use("/api/mail", apiMailRoutes)

//BD
mongoose.connect(config.mongodb.url,{ useNewUrlParser: true }, (err, res) => {
  if(err){
    return console.log("Error en base de datos => " + err)
  }else{
    console.log("Conexion con base de datos establecida")
    app.listen(config.express.port, (err) => {
      if(err){
        console.log("Ocurrio un error al iniciar el servidor web => " + err)
      }else{
        console.log("Servidor web iniciado correctamente")
      }
    })
 }
})