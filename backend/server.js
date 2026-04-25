const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/wallofshame')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log("Error connecting: ",err))


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

const idScehma = new mongoose.Schema({
  nodeid: {type:String, default: "0"},
  userid : {type: String, default: "0"},
  commentid : {type: String, default: "0"}
})

const Node = mongoose.model('Node', nodesSchema)
const IDs = mongoose.model('IDs', idScehma)


app.listen(port, () => console.log(`Listening on port ${port}`))


app.get('/nodes', async (req, res) => {
  try {
    const nodes = await Node.find()
    res.json(nodes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});
app.get('/ids', async (req, res) => {
  try {
    const ids = await IDs.find()
    console.log(ids)
    res.json(ids)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
});

app.get('/newuser', async (req, res) => {
  try{
    const id = await IDs.findOne() || new IDs()
    id.userid = (parseInt(id.userid) + 1).toString()
    await id.save()
    res.status(200).json({userid: id.userid})
  }catch(err){
    res.status(500).json({ message: err.message })
  }
})

app.post('/nodes', async (req, res) => {
  try {
    const newNode = new Node(req.body)
    
    const id = await IDs.findOne() || new IDs()
    id.nodeid = (parseInt(id.nodeid) + 1).toString()
    
    newNode.id = id.nodeid
    const data = await newNode.save()
    
    console.log(data, id)
    await id.save()

    res.status(201).json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
});

app.post('/UpdatePosition', async (req, res) => {
  try {
    const node = await Node.findOne({id: req.body.id});
    node.position = req.body.position
    const data = await node.save()
    console.log(data)
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.delete('/delnode', async (req, res) => {
  try {
    const node = await Node.findOne({id: req.body.id});
    console.log("delteing node: ", node)
    await Node.deleteOne(node)
    res.status(204).json({ message: "Node deleted" })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.post('/editNode', async (req, res) => {
  try {
    const node = await Node.findOne({id: req.body.id});
    node.data.title = req.body.data.title
    node.data.label = req.body.data.label
    node.data.color = req.body.data.color
    const data = await node.save()
    console.log(data)
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.post('/commentNode', async (req, res) => {
  try {
    const node = await Node.findOne({id: req.body.nodeid});
    const commentId = await IDs.findOne() || new IDs()
    commentId.commentid = (parseInt(commentId.commentid) + 1).toString()
    commentId.save()

    node.data.comments.push({
      commentid: commentId.commentid,
      comment: req.body.commentBody.comment,
      commenter: req.body.commentBody.commenter
    })
    const data = await node.save()
    console.log("Commented:", data)
    res.status(200).json(data)

  }catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.post('/deleteComment', async (req, res) => {
  try {
    const node = await Node.findOne({id: req.body.nodeid});
    node.data.comments = node.data.comments.filter(c => c.commentid !== req.body.commentid)
    const data = await node.save()
    console.log("Deleted Comment:", data)
    res.status(200).json(data)
  }catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.post('/userNodes', async (req, res) => {
  try {
    const nodes = await Node.find({"data.owner": req.body.userid})
    res.status(200).json(nodes)
  }catch (err) {
    res.status(400).json({ message: err.message })
  }
})

app.post('/userComments', async (req, res) => {
  try {
    const nodes = await Node.find({"data.comments.commenter": req.body.userid})
    res.status(200).json(nodes)
  }catch (err) {
    res.status(400).json({ message: err.message })
  }
})