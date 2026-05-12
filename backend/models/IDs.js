
const mongoose = require("mongoose")

const idScehma = new mongoose.Schema({
  nodeid: {type:String, default: "0"},
  userid : {type: String, default: "0"},
  commentid : {type: String, default: "0"}
})

module.exports = mongoose.model('IDs', idScehma);