
const IDs = require("../models/IDs.js")

exports.getIDs = async (req, res) => {
  try {
    const ids = await IDs.find()
    console.log(ids)
    res.json(ids)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.newuser =  async (req, res) => {
  try{
    const id = await IDs.findOne() || new IDs()
    id.userid = (parseInt(id.userid) + 1).toString()
    await id.save()
    res.status(200).json({userid: id.userid})
  }catch(err){
    res.status(500).json({ message: err.message })
  }
}