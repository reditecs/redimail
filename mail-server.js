"use strict"
const config = require("./config/index")
const SMTPServer = require('smtp-server').SMTPServer;
const MailParser = require('mailparser').simpleParser;
const server = new SMTPServer({
	name: config.mailserver.hostname,
	banner: config.mailserver.banner,
	secure: false,
	disabledCommands: ['AUTH', 'STARTTLS'],
	onRcptTo: (address, session, callback) => {
	  return callback()
	},
	onData: (stream, session, callback) => {

    MailParser(stream, (err, parsed) => {
      
      if(err){
        console.log("Ocurrio un error => " + err)
      }else{
         
        let subject = parsed.subject
        let from = parsed.from.value
        let to = parsed.to.value
        let messageId = parsed.messageId
        let inReplyTo = parsed.inReplyTo
        let html = parsed.html
        let text = parsed.text
        
        
        console.log("Subject: " + subject)
        console.log("")
        console.log("From: " + from.name + " ( " + from.address + ")")
        console.log("")
        console.log("To: " + to.name + " ( " + to.address + ")")
        console.log("")
        console.log("MessageID: " + messageId)
        console.log("")
        console.log("inReplyTo: " + inReplyTo)
        console.log("")
        console.log("html: " + html)
        console.log("")
        console.log("text: " + text)
        
      }
      
    });

	}
});

server.listen(process.env.PORT || config.mailserver.port, process.env.HOST || config.mailserver.host);