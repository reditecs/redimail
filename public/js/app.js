var hash
var storage
const api = "http://reditecs.xyz"
try{
    if (localStorage.getItem){
        storage = localStorage
    }
}catch(e) {
    storage = {}
}
function makeID(longitud, caracteres) {
    longitud = longitud || 8
    caracteres = caracteres || "0123456789abcdefghijklmnopqrstuvwxyz";
    let cadena = ""
    let max = caracteres.length-1
    for (let i = 0; i<longitud; i++) {
        cadena += caracteres[ Math.floor(Math.random() * (max+1)) ]
    }
    return cadena
}
function getDomains(){
  let domainApi = api + "/api/domain/list"
  let domains = {}
  $.get(domainApi, function( data ) {
    domains = data
  });
  console.log(domains)
}
function setEmail(id, domain){
  storage.id = id
  storage.domain = domain
  storage.email = id + "@" + domain
}
function setRandomEmail(){
  setEmail(makeID(), "reditecs.xyz")
}
function setInitEmail(){
  if(!storage.email){
    setRandomEmail()
  }
}
$(document).ready(() => {
  setInitEmail()
  getDomains()
})