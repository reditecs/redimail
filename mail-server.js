"use strict"
const config = require("./config/index")
//Dependencias
const SMTPServer = require('smtp-server').SMTPServer;
const MailParser = require('mailparser').simpleParser;
const mongoose = require("mongoose")
//Modelos
const Email = require("./models/email")
const Domain = require("./models/domain")
const server = new SMTPServer({
	name: config.mailserver.hostname,
	banner: config.mailserver.banner,
	secure: false,
	disabledCommands: ['AUTH', 'STARTTLS'],
	onRcptTo: (address, session, callback) => {
    Domain.find({status: true, isPrivate: false}, (err, domains) => {
      if(err){
        return callback(new Error('DataBase Error'));
      }else{
        let domainMap = []
        domains.forEach(function(dom) { 
          domainMap.push(dom.domain)
        })
        for(const domain of domainMap) {
          if (address.address.endsWith('@' + domain)) {
            return callback();
          }
        }
        return callback(new Error('Invalid email address'));
      }
    });
	},
	onData: (stream, session, callback) => {
    console.log("Conexion entrante detectada...")
    MailParser(stream, (err, parsed) => {
      console.log("Recuperando datos...")
      if(err){
        console.log("Ocurrio un error => " + err)
      }else{
        console.log("Datos recuperados correctamente!")
        let subject = parsed.subject
        let fromName = parsed.from.value[0].name
        let fromAddress = parsed.from.value[0].address
        let toName = parsed.to.value[0].name
        let toAddress = parsed.to.value[0].address
        let messageId = parsed.messageId
        let inReplyTo = parsed.inReplyTo || null
        let references = parsed.references || []
        let html = parsed.html
        let text = parsed.text
        let mailDate = parsed.date
        console.log("Date: " + mailDate)
        console.log("Subject: " + subject)
        console.log("From: " + fromName + " ( " + fromAddress + ")")
        console.log("To: " + toName + " ( " + toAddress + ")")
        console.log("MessageID: " + messageId)
        console.log("inReplyTo: " + inReplyTo)
        console.log("references: " + references)
        console.log("html: " + html)
        console.log("text: " + text)
        console.log("Intentando guardar en base de datos...")
        let email = new Email({
          id: messageId,
          subject: subject,
          from: {
            address: fromAddress,
            name: fromName
          },
          to: {
            address: toAddress,
            name: toName
          },
          messageId: messageId,
          references: references,
          inReplyTo: inReplyTo,
          html: html,
          text: text,
          sentDate: mailDate
        })
        email.save((err, emailStored) => {
          if(err){
            console.log("Ocurrio un error mientras se guardaba el email.")
          }else{
            console.log("Email guardado con exito! => " + emailStored._id)
          }
        })
      }
  
    })
	}
})

mongoose.connect(config.mongodb.url,{ useNewUrlParser: true }, (err, res) => {
  if(err){
    return console.log("Error en base de datos => " + err)
  }else{
    console.log("Conexion con base de datos establecida")
      server.listen(process.env.PORT || config.mailserver.port, (err) => {
        if(err){
          console.log(err)
        }else{
          console.log("Servidor de correo iniciado en el puerto " + (process.env.PORT || config.mailserver.port))
        }
      });
 }
})
