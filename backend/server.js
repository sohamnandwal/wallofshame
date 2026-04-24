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
  owner: String,
  position : {
    x: Number,
    y: Number
  },
  data: {
    title: String,
    label: String,
    color: String
  },
  comments: {
    comment: String,
    owner: String
  }
})

const idScehma = new mongoose.Schema({
  id: {type:String, default: "0"}
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

app.post('/nodes', async (req, res) => {
  try {
    const newNode = new Node(req.body)
    
    const id = await IDs.findOne() || new IDs()
    id.id = (parseInt(id.id) + 1).toString()
    
    newNode.id = id.id
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