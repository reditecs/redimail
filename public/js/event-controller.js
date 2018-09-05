$("#changeAddress").click(() => {
  let id = $("#id").val()
  let domain = $("#domains").val()
  setEmail(id, domain)
})
$("#refreshMailbox").click(() => {
  storage.counter = reloadEmailsAfter
  loadEmails(storage.email)
})
$("#randomAddress").click(() => {
  setRandomEmail()
  addParameters()
})
$("#copyToClipboard").click(() => {
  copyToClipboard()
  alert("Copied!")
})