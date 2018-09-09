module.exports = {
  "app":{
    name: "RediMail",
    indexTitle: "RediMail - Free temporary email system!"
  },
  "express": {
    defaultUrl: "redimail.xyz",
    port: 3000
  },
  "mongodb": {
    url: "mongodb://localhost:33452/tempmail"
  },
  "mailserver": {
    host: "localhost",
    port: 25,
    hostname: "reditecs",
    banner: "RediTecs.com mailserver"
  },
  "delay": {
    validDomainChecker: 0.5,
    noValidDomainChecker: 0.05,
    deleteEmailAfter: 2,
    emailWorkerDelay: 0.05
  }
}
