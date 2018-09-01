const mongoose = require("mongoose")
const DomainSchema = new mongoose.Schema({
  contactEmail: String,
  domain: {
    type: String,
    required: true,
    unique: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  banner: {
    type: String,
    default: ""
  },
  registerDate: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: Boolean,
    default: false
  }
})
module.exports = mongoose.model("domain", DomainSchema)