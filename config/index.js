module.exports = {
  "express": {
    defaultUrl: "dev.reditecs.xyz",
    port: 3000
  },
  "mongodb": {
    url: "mongodb://root:Qwerty22123..@ds233452.mlab.com:33452/tempmail"
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
    deleteEmailAfter: 1
  }
}