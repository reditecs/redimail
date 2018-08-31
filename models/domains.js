const mongoose = require("mongoose")
const DomainSchema = new mongoose.Schema({
  contactEmail: String,
  domain: {
    type: String,
    required: true
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
  }
})
module.exports = mongoose.model("domain", DomainSchema)