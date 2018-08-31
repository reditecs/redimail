const config = require('config');
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

		MailParser(stream).then(email => {
      
      
      console.log(email)
      
      
		}).catch(callback);

		
	}
});

server.listen(process.env.PORT || config.mailserver.port, process.env.HOST || config.mailserver.host);