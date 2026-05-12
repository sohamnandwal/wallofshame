const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const port = 8000 // || process.env.PORT

const nodeController = require("./controllers/nodeController")
const idsController = require("./controllers/idsController")

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/wallofshame')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log("Error connecting: ",err))


// const nodesSchema = new mongoose.Schema({
//   id: String,
//   type: String,
//   position : {
//     x: Number,
//     y: Number
//   },
//   data: {
//     title: String,
//     label: String,
//     color: String,
//     owner: String,
//     comments: [{
//       commentid: String,
//       comment: String,
//       commenter: String
//     }]
//   }
  
// })

// const idScehma = new mongoose.Schema({
//   nodeid: {type:String, default: "0"},
//   userid : {type: String, default: "0"},
//   commentid : {type: String, default: "0"}
// })

// const Node = mongoose.model('Node', nodesSchema)
// const IDs = mongoose.model('IDs', idScehma)


app.listen(port, () => console.log(`Listening on port ${port}`))


app.get('/nodes', nodeController.getNodes);
app.get('/ids', idsController.getIDs);

app.get('/newuser', idsController.newuser)

app.post('/nodes', nodeController.postNodes);

app.post('/UpdatePosition', nodeController.updatePosition)

app.delete('/delnode', nodeController.delNode)

app.post('/editNode', nodeController.editNode)

app.post('/commentNode', nodeController.commentNode)

app.post('/deleteComment', nodeController.deleteComment)

app.post('/userNodes', nodeController.userNodes)

app.post('/userComments', nodeController.userComments)