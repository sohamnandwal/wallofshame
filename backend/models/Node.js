
const mongoose = require('mongoose')

const nodesSchema = new mongoose.Schema({
  id: String,
  type: String,
  position : {
    x: Number,
    y: Number
  },
  data: {
    title: String,
    label: String,
    color: String,
    owner: String,
    comments: [{
      commentid: String,
      comment: String,
      commenter: String
    }]
  }
  
})

module.exports = mongoose.model('Node', nodesSchema);