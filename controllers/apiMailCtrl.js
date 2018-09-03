'use strict'
const mongoose = require("mongoose")
const SMTPConnection = require('smtp-connection');
const mailcomposer = require('mailcomposer');
const Mail = require("../models/email")
const config = require("../config")

function welcomeMessage(req, res){
  res.status(200).send("Welcome to redimail API system!")
}

function test(req, res){
  if(!req.params.email){
    res.status(400).send({message: "Error #404 - Invalid email"})
  }else{
  const connection = new SMTPConnection({
			host: config.mailserver.host,
			port: config.mailserver.port,
			name: config.mailserver.hostname,
			secure: false,
			ignoreTLS: true,
			authMethod: 'NONE'
	});
  connection.connect(() => {
			let envelope = {
				from: 'mail@' + req.headers.host,
				to: req.params.email
			};
			let mail = mailcomposer({
				from: '"Mailbot" <' + envelope.from + '>',
				to: envelope.to,
				subject: 'Your test email',
				text: 'Your mailbox is working!'
			});
			connection.send(envelope, mail.createReadStream(), (error) => {
				if(error) {
					res.status(500).send({message: "Error #405 - Internal error"})
					connection.close();
				}else{
          connection.quit();
          res.status(200).send({message:"Email sent"})
        }
			});
		});
  }
}

function mailbox(req, res){
  
  if(!req.params.email){
    res.status(403).send({message:"Error #401 - Please retry"})
  }else{
    let email = req.params.email
    var emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      var regex = new RegExp(emailRegex)
      
      if(!email.match(regex)) {
      
        res.status(400).send({message: "Error #402 - Invalid email"})

      }else{
        
        Mail.find({}).sort({receivedDate: 'desc'}).exec((err, mails) => {
           if(!err){
            let mailMap = []
            mails.forEach(function(dom) { 
              mailMap.push({id: dom._id, subject: dom.subject})
            })
            res.status(200).send({mailbox: mailMap})       
          }else{
            res.status(500).send({message: "Error #403 - Database fail"})
          }
        });
        
      }
  }
}
function remove(req, res){
  if(!req.params.id){
     res.status(500).send({message: "Error #406 - ID required"})
  }else{
    Mail.remove({ _id: req.params.id }, function(err) {
      if(!err) {
        res.status(200).send({message:"Success"})
      }else{
        res.status(500).send({message: "Error #407 - Database fail"})
      }
    });    
  }
}
function info(req, res){
  if(!req.params.id){
     res.status(500).send({message: "Error #408 - ID required"})
  }else{
    Mail.findById(req.params.id, (err, mail) => {
      if(err){
        res.status(500).send({mensaje: "Error #409 - Internal error"})
      }else{
        if(!mail){
          res.status(404).send({mensaje: "Error #410 - Not found"})
        }else{
          res.status(200).send({ 
          
            fromName: mail.from.name,
            fromAddress: mail.from.address,
            from: mail.from.name + " (" + mail.from.address + ")",
            subject: mail.subject,
            sentDate: mail.sentDate,
            receivedDate: mail.receivedDate
          
          })
        }
      }
    })
  }
}
function html(req, res){
  if(!req.params.id){
     res.status(500).send({message: "Error #411 - ID required"})
  }else{
    Mail.findById(req.params.id, (err, mail) => {
      if(err){
        res.status(500).send({mensaje: "Error #412 - Internal error"})
      }else{
        if(!mail){
          res.status(404).send({mensaje: "Error #413 - Not found"})
        }else{
          res.status(200).send(mail.html)
        }
      }
    })
  }
}
function txt(req, res){
  if(!req.params.id){
     res.status(500).send({message: "Error #414 - ID required"})
  }else{
    Mail.findById(req.params.id, (err, mail) => {
      if(err){
        res.status(500).send({mensaje: "Error #415 - Internal error"})
      }else{
        if(!mail){
          res.status(404).send({mensaje: "Error #416 - Not found"})
        }else{
          res.status(200).send(mail.txt)
        }
      }
    })
  }
}
module.exports = {
  welcomeMessage,
  mailbox,
  test,
  remove,
  info,
  html,
  txt
}