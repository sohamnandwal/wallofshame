
const Node = require("../models/Node.js")
const IDs = require("../models/IDs.js")

exports.getNodes = async  (req, res) => {
  try {
    const nodes = await Node.find()
    res.json(nodes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.postNodes = async (req, res) => {
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
}

exports.updatePosition = async (req, res) => {
  try {
    const node = await Node.findOne({id: req.body.id});
    node.position = req.body.position
    const data = await node.save()
    console.log(data)
    res.status(200).json(data)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.delNode = async (req, res) => {
  try {
    const node = await Node.findOne({id: req.body.id});
    console.log("delteing node: ", node)
    await Node.deleteOne(node)
    res.status(204).json({ message: "Node deleted" })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.editNode =  async (req, res) => {
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
}

exports.commentNode = async (req, res) => {
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
}

exports.deleteComment = async (req, res) => {
  try {
    const node = await Node.findOne({id: req.body.nodeid});
    node.data.comments = node.data.comments.filter(c => c.commentid !== req.body.commentid)
    const data = await node.save()
    console.log("Deleted Comment:", data)
    res.status(200).json(data)
  }catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.userNodes = async (req, res) => {
  try {
    const nodes = await Node.find({"data.owner": req.body.userid})
    res.status(200).json(nodes)
  }catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.userComments = async (req, res) => {
  try {
    const nodes = await Node.find({"data.comments.commenter": req.body.userid})
    res.status(200).json(nodes)
  }catch (err) {
    res.status(400).json({ message: err.message })
  }
}