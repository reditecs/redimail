var hash
var storage
var reloadEmailsAfter = 10
const api = "http://reditecs.xyz"
const emailElement = "#mailbox"
const emailLoader = "#emailLoader"
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
function loadDomains(){
  let domainApi = api + "/api/domain/list"
  $.getJSON(domainApi, function(data) {
    storage.domains = data.domains
  });
}
function setEmail(id, domain){
  storage.id = id
  storage.domain = domain
  storage.email = id + "@" + domain
  showMailbox()
}
function setRandomEmail(){
  if(!storage.domains){
    console.log("Esperando que los dominios se carguen")
    setTimeout(setRandomEmail, 1000)
  }else{
    var randomDomain = storage.domains.split(",")[Math.floor(Math.random() * storage.domains.split(",").length)];
    setEmail(makeID(), randomDomain)
  }
}
function setInitEmail(){
  if(!storage.email){
    setRandomEmail()
  }
}
function loadEmails(email){
  let emailApi = api + "/api/mail/mailbox/" + email
  $.getJSON(emailApi, function(data) {
    console.log(data)
    $(emailElement).html("")
    $(emailElement).append("<tr class='text-light bg-dark'><td class='text-center'><b>From</b></td><td class='text-center'><b>Subject</b></td><td class='text-center'><b>Remain</b></td><td class='text-center'><b>Actions</b></td></tr>")
    data.mailbox.forEach((mail) => {
      
      if(storage.viewHistory){
        if(storage.viewHistory.split(",").includes(mail.id)){
          $(emailElement).append("<tr class='bg-light'><td class='mailfield from'>" + mail.fromName + "</td><td class='mailfield subject'>" + mail.subject + "</td><td class='mailfield remain text-center'>" + mail.remain + "</td><td class='mailfield actions text-center'><button class='btn btn-success' onClick=\"html('" + mail.id + "')\">Open</button> | <button class='btn btn-warning' onClick=\"remove('" + mail.id + "')\">Delete</button></td></tr>")
        }else{
          $(emailElement).append("<tr class='bg-white'><td class='mailfield from'>" + mail.fromName + "</td><td class='mailfield subject'>" + mail.subject + "</td><td class='mailfield remain text-center'>" + mail.remain + "</td><td class='mailfield actions text-center'><button class='btn btn-success' onClick=\"html('" + mail.id + "')\">Open</button> | <button class='btn btn-warning' onClick=\"remove('" + mail.id + "')\">Delete</button></td></tr>")
        } 
      }else{
        $(emailElement).append("<tr class='bg-white'><td class='mailfield from'>" + mail.fromName + "</td><td class='mailfield subject'>" + mail.subject + "</td><td class='mailfield remain text-center'>" + mail.remain + "</td><td class='mailfield actions text-center'><button class='btn btn-success' onClick=\"html('" + mail.id + "')\">Open</button> | <button class='btn btn-warning' onClick=\"remove('" + mail.id + "')\">Delete</button></td></tr>")
      }
      
      
    })
  });
}
function emailReloader(){
  setInterval(() => {
    if(!storage.counter){
      storage.counter = reloadEmailsAfter
    }else{
      $("#reloadEmailsAfter").html(storage.counter)
      if(storage.counter > 0){
        storage.counter = storage.counter - 1
      }else{
        storage.counter = reloadEmailsAfter
        loadEmails(storage.email)
      }
    }
  }, 1000)
}
function addParameters(){
  if(!(storage.domains && storage.domain && storage.id)){
     console.log("Cargando todos los elementos necesarios")
     setTimeout(addParameters, 1000)
  }else{
     storage.domains.split(",").forEach((domain) => {
      $('#domains').append($('<option>', { 
          value: domain,
          text: domain
      }));
    })
    $("#id").val(storage.id)
    $("#domains").val(storage.domain).change()
    loadEmails(storage.email)
  }
}
function copyToClipboard() {
  var $temp = $("<input>")
  $("body").append($temp);
  $temp.val(storage.email).select();
  document.execCommand("copy");
  $temp.remove();
}
function html(id){
  let emailApi = api + "/api/mail/info/" + id
  $.getJSON(emailApi, function(data) {
    if(!storage.viewHistory){
      storage.viewHistory = id 
    }else{
      if(!storage.viewHistory.split(",").includes(id)){
        storage.viewHistory = storage.viewHistory + "," + id
      } 
    }
    $(emailElement).hide()
    $(emailLoader).html("")
    $(emailLoader).append("<table class='table table-sm table-bordered'><tr><td>" + data.from + "</td><td>" + data.subject + "</td></tr></table>")
    $(emailLoader).append("<button class='btn btn-success' onClick='showMailbox()'>Regresar</button> - <button class='btn btn-warning' onClick=\"txt('" + id + "')\">View in plain text</button><br><iframe src='" + api + "/api/mail/html/" + id + "' width='100%' height='100%' frameborder='0' border='0'>")
    $("#refreshMailbox").fadeOut(300)
    $(emailLoader).fadeIn(300)
  })
}
function txt(id){
  let emailApi = api + "/api/mail/info/" + id
  $.getJSON(emailApi, function(data) {
    if(!storage.viewHistory){
      storage.viewHistory = id 
    }else{
      if(!storage.viewHistory.split(",").includes(id)){
        storage.viewHistory = storage.viewHistory + "," + id
      } 
    }
    $(emailElement).hide()
    $(emailLoader).html("")
    $(emailLoader).append("<table class='table table-sm table-bordered'><tr><td>" + data.from + "</td><td>" + data.subject + "</td></tr></table>")
    $(emailLoader).append("<button class='btn btn-success' onClick='showMailbox()'>Regresar</button> - <button class='btn btn-info' onClick=\"html('" + id + "')\">View in HTML</button><br><iframe src='" + api + "/api/mail/txt/" + id + "' width='100%' height='100%' frameborder='0' border='0'>")
    $("#refreshMailbox").fadeOut(300)
    $(emailLoader).fadeIn(300)
  })
}
function remove(id){
  if(confirm("Sure?")){
      $.get(api + "/api/mail/remove/" + id, function( data ) {
        alert(data.message)
      })
      loadEmails(storage.email)
  }
}
function showMailbox(){
  loadEmails(storage.email)
  $(emailLoader).hide()
  $("#refreshMailbox").fadeIn(300)
  $(emailElement).fadeIn(300)
}
$(document).ready(() => {
  loadDomains()
  setInitEmail()
  addParameters()
  emailReloader()
})