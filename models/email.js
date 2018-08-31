"use strict"
const mongoose = require("mongoose")
const EmailSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  subject: String,
  from: {
    address: String,
    name: String
  },
  to: {
    address: String,
    name: String
  },
  messageId: String,
  references: String,
  inReplyTo: String,
  html: String,
  text: String,
  original: String,
  sentDate: Date,
  receivedDate: {
    type: Date,
    default: Date.now()
  }
})
module.exports = mongoose.model("email", EmailSchema)