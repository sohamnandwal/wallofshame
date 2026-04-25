// import { useState } from 'react'
import './App.css'
import '@xyflow/react/dist/base.css';
import { Background, ReactFlow, useNodesState, Controls, useReactFlow } from '@xyflow/react'
import { useState, useEffect } from 'react';
// import pencil from './assets/pencil.svg';
// import dustbin from './assets/dustbin.svg';


const colors = {
  red: { light: '#fca5a5', dark: '#dc2626' },
  yellow: { light: '#fef08a', dark: '#eab308' },
  green: { light: '#bbf7d0', dark: '#22c55e' },
  blue: { light: '#bfdbfe', dark: '#3b82f6' },
  black: { light: '#d1d5db', dark: '#000000' }
}
const colIDS = {
  1: 'red',
  2: 'blue',
  3: 'green',
  4: 'yellow'
}
const inverseColIDS = {
  'red': 1,
  'blue': 2,
  'green': 3,
  'yellow': 4
}

// const editNode = async (node) => {

// }




function stickyNote(node) {
  // console.log(node.data, style)
  // console.log(node, localStorage.getItem("userid"))
  return (
    <div className='relative group p-2 rounded-md border-2 min-w-48 max-w-xl max-h-[50vh] overflow-y-auto' style={{ backgroundColor: colors[node.data.color].light, borderColor: colors[node.data.color].dark }}>
      {node.data.owner === localStorage.getItem("userid") && (
        <div className='absolute top-2 right-2 flex flex-row gap-1 z-10 opacity-0 group-hover:opacity-100'>
          <button className='w-4 h-4' onClick={() => node.data.editNode(node)}>
            <img src="/pencil.svg" alt="Edit" className='w-4 h-4' />
          </button>
          <button className='w-4 h-4' onClick={() => node.data.deleteNode(node.id)}>
            <img src="/trash.svg" alt="Delete" className='w-4 h-4' />
          </button>
        </div>
      )
      }

      <div className='flex flex-row justify-left items-end gap-2'>
        <h1 className='font-mono font-bold text-2xl min-h-4 mask-ellipse'>{node.data.title}</h1>
        <h1 className='font-mono text-m text-gray-500 min-h-4'>User {node.data.owner}</h1>

      </div>
      <hr></hr>
      <p className='font-mono text-sm whitespace-pre-wrap'>{node.data.label}</p>
      <div className='flex justify-end w-full'>
        <button className='w-4 h-4' onClick={() => node.data.commentNode(node.id)}>
          <img src="/comment.svg" alt="Delete" className='w-4 h-4' />
        </button>
      </div>
    </div>)
}



// const preData = [
//   {
//     id: '1',
//     type: 'stickyNote',
//     owner: 'me',
//     data: { label: 'red', color: 'red', title: "RED" },
//     position: { x: 0, y: 50 }
//   },
//   {
//     id: '2',
//     type: 'stickyNote',
//     owner: 'me',
//     data: { label: 'yellow', color: 'yellow', title: "YELLOW" },
//     position: { x: 100, y: 50 }
//   },
//   {
//     id: '3',
//     type: 'stickyNote',
//     owner: 'me',
//     data: { label: 'green', color: 'green', title: "GREEN" },
//     position: { x: 300, y: 50 }
//   },
//   {
//     id: '4',
//     type: 'stickyNote',
//     owner: 'me',
//     data: { label: 'blue', color: 'blue', title: "BLUE" },
//     position: { x: 200, y: 50 }
//   }
// ]

// async function getIds(){
//   const res = await fetch("http://localhost:8000/ids")
//   const body = await res.json()
//   var id = parseInt(body.id)
//   return id
// }

const nodeTypes = {
  stickyNote: stickyNote
}
const MAXHEIGHT = window.innerHeight * 0.3 + 20 //30vh
const MAXWIDTH = 384 + 20 //w-48


function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [title, setTitle] = useState("")
  const [label, setLabel] = useState("")
  const [colorID, setColorId] = useState(1)
  const { getIntersectingNodes, screenToFlowPosition, setCenter, getZoom } = useReactFlow()
  const [userid, setUserId] = useState("0")
  // const {addNodes , screenToFlowPosition } =useReactFlow()

  useEffect(() => {
    async function loginUser() {
      let uid = localStorage.getItem("userid")
      if (!uid) {
        localStorage.setItem('userid', 'pending...');
        try {
          const res = await fetch("http://localhost:8000/newuser")
          const body = await res.json()
          localStorage.setItem("userid", body.userid)
          console.log("New User ID: ", body.userid)
          uid = body.userid
        } catch (err) {
          console.log("Error: ", err)
        }
      }
      setUserId(uid)
    }
    loginUser()
  })



  useEffect(() => {
    async function callServer() {
      console.log("Fetch Data")
      var res = await fetch("http://localhost:8000/nodes")
      var body = await res.json()
      console.log(body)
      setNodes(body)
    }
    callServer()
  }, [setNodes])

  const deleteNode = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/delnode`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
      })

      if (res.ok) {
        console.log("Node deleted successfully")
        setNodes((nodes) => nodes.filter((n) => n.id !== id))
      }
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  const [editNodeId, setEditNodeId] = useState("")

  const [editTitle, setEditTitle] = useState("");
  const [editLabel, setEditLabel] = useState("");
  const [editColorId, setEditColorId] = useState(1);

  const editNode = async (node) => {
    setEditTitle(node.data.title)
    setEditLabel(node.data.label)
    setEditColorId(inverseColIDS[node.data.color])

    setEditNodeId(node.id)
  }

  const saveEditNode = async () => {
    if (editTitle.trim() === "" || editLabel.trim() === "") {
      alert("Invalid or blank note.")
      return
    }
    try {
      const res = await fetch('http://localhost:8000/editNode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editNodeId,
          data: { title: editTitle, label: editLabel, color: colIDS[editColorId] }
        }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Edited:", data)
        setNodes((nodes) => nodes.map((n) => data.id === n.id ? { ...n, data: { ...n.data, title: data.data.title, label: data.data.label, color: data.data.color } } : n))
        setEditNodeId("")
      }
    } catch (error) {
      console.error("Failed to update database:", error);
    }
  }



  const [commentNodeId, setCommentNodeId] = useState("")
  const [comment, setComment] = useState("")

  const commentNode = async (id) => {
    setCommentNodeId(id)
  }

  const saveComment = async () => {
    if (comment.trim() === "") {
      alert("Invalid or blank comment.")
      return
    }
    const commentBody = {
      commentid: "0",
      comment: comment,
      commenter: userid
    }
    console.log("save comment", commentBody)

    // setNodes((nodes) => nodes.map((n) => {
    //   if (n.id === commentNodeId) {
    //     const oldComments = n.data.comments || []
    //     return { ...n, data: { ...n.data, comments: [...oldComments, commentBody] } }
    //   }
    //   return n
    // }))
    try {
      const res = await fetch('http://localhost:8000/commentNode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeid: commentNodeId,
          commentBody: commentBody
        }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Commented:", data)
        setNodes((nodes) => nodes.map((n) => data.id === n.id ? { ...n, data: { ...n.data, comments: data.data.comments } } : n))
      }
    } catch (error) {
      console.error("Failed to update database:", error);
    }
    setComment("")
  }

  const deleteComment = async (commentid) => {
    try {
      const res = await fetch('http://localhost:8000/deleteComment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodeid: commentNodeId,
          commentid: commentid
        }),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Deleted Comment:", data)
        setNodes((nodes) => nodes.map((n) => n.id === data.id ? { ...n, data: { ...n.data, comments: data.data.comments } } : n))
      }
    } catch (error) {
      console.error("Failed to update database:", error);
    }
  }






  const isOverLapping = (tX, tY) => {
    for (let node of nodes) {
      const overlapX = tX < node.position.x + MAXWIDTH && tX + MAXWIDTH > node.position.x
      const overlapY = tY < node.position.y + MAXHEIGHT && tY + MAXHEIGHT > node.position.y
      if (overlapX && overlapY) {
        return true
      }
    }
    return false
  }
  const findPosition = (startX, startY) => {
    let currentX = startX
    let currentY = startY

    while (isOverLapping(currentX, currentY)) {
      currentX += MAXWIDTH;
      if (currentX + MAXWIDTH > 10 * MAXWIDTH) {
        currentX = 0;
        currentY += MAXHEIGHT;
      }
    }
    return { x: currentX, y: currentY }
  }

  const onAddNode = async () => {

    if (title.trim() === "" || label.trim() === "") {
      alert("Invalid or blank note.")
      return
    }


    const flow = document.querySelector('.react-flow')
    const pos = screenToFlowPosition({ x: flow.clientWidth / 2, y: flow.clientHeight / 2 })
    const safePos = findPosition(pos.x, pos.y)
    var id = "0"//await getIds() || 0

    const newNode = {
      id: id,
      type: 'stickyNote',
      data: { label: label, color: colIDS[colorID], title: title, owner: userid },
      position: safePos
    }
    console.log(newNode)

    try {
      const res = await fetch("http://localhost:8000/nodes", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNode)
      })

      if (res.ok) {
        const data = await res.json()
        setNodes((nodes) => nodes.concat(data))
        setCenter(safePos.x, safePos.y, { zoom: getZoom(), duration: 500 })
        setTitle("")
        setLabel("")
      }
    } catch (err) {
      console.log("Error: ", err)
    }

  }


  const onNodeDragStop = async (_, node) => {

    const N = getIntersectingNodes(node).length
    var safePos = node.position
    console.log(N)
    if (N > 0) {
      const pos = { x: node.position.x, y: node.position.y }
      safePos = findPosition(pos.x, pos.y)
    }
    try {
      const res = await fetch("http://localhost:8000/UpdatePosition", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: node.id, position: safePos })
      })

      if (res.ok) {
        const data = await res.json()
        setNodes((nodes) => nodes.map((n) => data.id === n.id ? { ...n, position: data.position } : n))
        setCenter(data.position.x, data.position.y, { zoom: getZoom(), duration: 500 })

      }
    } catch (err) {
      console.log("Error: ", err)
    }
  }

  var nodesWithFunctions = nodes.map((node) => {
    return {
      ...node,
      draggable: node.data.owner === userid,
      data: {
        ...node.data,
        editNode: editNode,
        deleteNode: deleteNode,
        commentNode: commentNode
      }
    }
  })

  const fetchUserNodes = async () => {
    try {
      const res = await fetch(`http://localhost:8000/userNodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userid: userid })
      })

      if (res.ok) {
        const data = await res.json()
        console.log("User Nodes: ", data)

        return data;
      }

    } catch (err) {
      console.log("Error: ", err)
      return []
    }
  }
  const fetchUserCommentNodes = async () => {
    try {
      const res = await fetch(`http://localhost:8000/userComments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userid: userid })
      })

      if (res.ok) {
        const data = await res.json()
        console.log("User Comments: ", data)

        return data;
      }

    } catch (err) {
      console.log("Error: ", err)
      return []
    }
  }
  const [userNodes, setUserNodes] = useState([])
  const [userCommentNodes, setUserCommentNodes] = useState([])
  const [showProfile, setShowProfile] = useState(false)
  const openProfile = async () => {
    setShowProfile(true)
    const nodes = await fetchUserNodes() || []
    const commentNodes = await fetchUserCommentNodes() || []
    setUserNodes(nodes)
    setUserCommentNodes(commentNodes)
  }




  const activeCommentNode = nodes.find(n => n.id === commentNodeId);
  const currentComments = activeCommentNode?.data?.comments || [];

  return (
    <div className='overflow-y-hidden'>
      <header className='border-2 '>
        <h1 className="text-3xl align-middle text-center">Wall Of Shame</h1>
        <button className="absolute top-1 right-1 bg-blue-300 w-8 h-8 rounded-2xl" onClick={() => openProfile()}>
          <img src="/person.svg" alt="USER" className='w-full h-full' />
        </button>
      </header>
      <div className='h-[calc(100vh-48px)]'>
        <ReactFlow nodes={nodesWithFunctions} nodeTypes={nodeTypes} onNodesChange={onNodesChange} snapToGrid={true} snapGrid={[10, 10]} onNodesChange={onNodesChange} onNodeDragStop={onNodeDragStop}>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <div className='fixed bottom-10 right-10 z-50 w-64 p-4 bg-white/60 h-auto rounded border border-black'>
        <h2 className='text-xl font-bold mb-2'>Add Note</h2>
        <hr></hr>
        <input className='w-full font-mono font-bold text-2xl' placeholder='Enter Title...' value={title} onChange={(e) => { setTitle(e.target.value) }}></input>
        <hr></hr>
        <textarea className='w-full font-mono text-m min-h-[20vh]' placeholder='Enter your code...' value={label} onChange={(e) => { setLabel(e.target.value) }}></textarea>
        <div className='flex flex-row gap-2 my-4 w-10/12  items-center justify-center mx-auto'>
          <button className={`w-12 h-12 rounded  bg-red-500 hover:bg-red-700 ${colorID == 1 ? 'ring-4 ring-black ring-offset-2' : 'ring-0'}`} onClick={() => { setColorId(1) }}></button>
          <button className={`w-12 h-12 rounded  bg-blue-500 hover:bg-blue-700 ${colorID == 2 ? 'ring-4 ring-black ring-offset-2' : 'ring-0'}`} onClick={() => { setColorId(2) }}></button>
          <button className={`w-12 h-12 rounded  bg-green-500 hover:bg-redgreen700 ${colorID == 3 ? 'ring-4 ring-black ring-offset-2' : 'ring-0'}`} onClick={() => { setColorId(3) }}></button>
          <button className={`w-12 h-12 rounded  bg-yellow-500 hover:bg-red-yellow ${colorID == 4 ? 'ring-4 ring-black ring-offset-2' : 'ring-0'}`} onClick={() => { setColorId(4) }}></button>
        </div>
        <button className='w-full rounded py-2 top-10 bg-blue-500 hover:bg-blue-700' onClick={onAddNode}>hELLO</button>
      </div>

      {editNodeId && (
        <div className='fixed top-15 right-10 z-50 w-64 p-4 bg-white/60 h-auto rounded border border-black'>
          <h2 className='text-xl font-bold mb-2'>Edit Note</h2>
          <hr></hr>
          <input className='w-full font-mono font-bold text-2xl' placeholder='Enter Title...' value={editTitle} onChange={(e) => { setEditTitle(e.target.value) }}></input>
          <textarea className='w-full font-mono text-m min-h-[10vh]' placeholder='Enter your note...' value={editLabel} onChange={(e) => { setEditLabel(e.target.value) }}></textarea>
          <div className='flex flex-row gap-2 my-4 w-10/12  items-center justify-center mx-auto'>
            <button className={`w-12 h-12 rounded  bg-red-500 hover:bg-red-700 ${editColorId == 1 ? 'ring-4 ring-black ring-offset-2' : 'ring-0'}`} onClick={() => { setEditColorId(1) }}></button>
            <button className={`w-12 h-12 rounded  bg-blue-500 hover:bg-blue-700 ${editColorId == 2 ? 'ring-4 ring-black ring-offset-2' : 'ring-0'}`} onClick={() => { setEditColorId(2) }}></button>
            <button className={`w-12 h-12 rounded  bg-green-500 hover:bg-redgreen700 ${editColorId == 3 ? 'ring-4 ring-black ring-offset-2' : 'ring-0'}`} onClick={() => { setEditColorId(3) }}></button>
            <button className={`w-12 h-12 rounded  bg-yellow-500 hover:bg-red-yellow ${editColorId == 4 ? 'ring-4 ring-black ring-offset-2' : 'ring-0'}`} onClick={() => { setEditColorId(4) }}></button>
          </div>
          <button className='w-full rounded py-2 top-10 bg-blue-500 hover:bg-blue-700' onClick={saveEditNode}>Save</button>
        </div>

      )}
      {commentNodeId && (
        <div className='flex flex-col fixed bottom-10 left-10 z-50 min-w-64 max-w-96 p-4 bg-white/60 h-auto rounded border border-black'>
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg font-mono">Comments | {activeCommentNode.data.title}</h2>
            <button className="text-gray-500 hover:text-black font-bold p-1" onClick={() => setCommentNodeId(null)}>
              X
            </button>
          </div>
          <hr></hr>

          <div className='flex-1 overflow-y-auto max-h-[60vh] flex flex-col gap-2 my-4 w-full  items-start justify-start mx-auto'>
            {currentComments.length === 0 ? (
              <p className='text-gray-500 italic'>No comments yet!</p>
            ) : (
              currentComments.map((c, index) => (
                <div className='group width-full flex flex-row justify-between items-start'>
                  <div key={index} className={`p-3 rounded-lg text-sm ${c.commenter === userid ? 'bg-blue-100' : 'bg-white border'}`}>
                    <p className='font-mono text-xs font-bold block '>{c.commenter === userid ? "You" : c.commenter}</p>
                    <p className='font-mono text-sm wrap-break-words whitespace-pre-wrap'>{c.comment}</p>
                  </div>
                  <button className={`w-4 h-4 ${c.commenter === userid ? 'block' : 'hidden'} opacity-0 group-hover:opacity-100`} onClick={() => { deleteComment(c.commentid) }}>
                    <img src="/trash.svg" alt="Delete" className='w-4 h-4' />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="bg-white border-t border-gray-200 flex flex-col gap-2">
            <textarea className="w-full border rounded text-sm resize-none" rows="3" placeholder="Comment..." value={comment} onChange={(e) => setComment(e.target.value)}            ></textarea>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition-colors" onClick={saveComment}>
              Post Comment
            </button>
          </div>



          {/* <textarea className='w-full font-mono text-xl' placeholder='Enter your comment...' value={comment} onChange={(e) => { setComment(e.target.value) }}></textarea>
          <button className='w-full rounded py-2 top-10 bg-blue-500 hover:bg-blue-700' onClick={saveComment}>Save</button> */}
        </div>
      )}
      {showProfile && (
        <div className='overflow-hidden absolute top-0 left-0 h-screen w-screen flex items-center justify-center bg-black/50 z-100 '>
          <div className='flex flex-col gap-4 p-4 bg-white rounded border border-black w-8/12 max-h-[75vh]'>
            <h2 className='text-2xl font-bold'>User Profile</h2>
            <hr></hr>
            <p><span className='font-bold'>UserID:</span> {userid}</p>

            <div className='flex flex-row gap-5'>
              <div className='flex-1'>
                <p className='font-bold'>Your Notes</p>
                <hr></hr>
                <div className='border-t border-gray-300 max-h-[40vh] overflow-y-auto'>
                  {userNodes.map((node, index) => (
                    <div key={index} className='p-2 border rounded my-1' style={{ backgroundColor: colors[node.data.color].light, borderColor: colors[node.data.color].dark }}>
                      <h3 className='font-bold text-m'>{node.data.title}</h3>
                      <hr></hr>
                      <p className='whitespace-pre-wrap max-h-[10vh] overflow-auto text-sm font-mono'>{node.data.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex-1'>
                <p className='font-bold'>Your Comments</p>
                <hr></hr>
                <div className='border-t border-gray-300 max-h-[40vh] overflow-y-auto'>
                  {userCommentNodes.map((node, index) => (

                    <div key={index} className='p-2 border rounded my-1' style={{ backgroundColor: colors[node.data.color].light, borderColor: colors[node.data.color].dark }}>
                      <div className='flex flex-row justify-left items-end gap-2'>
                        <h1 className='font-mono font-bold text-m min-h-4 mask-ellipse'>{node.data.title}</h1>
                        <h1 className='font-mono text-sm text-gray-500 min-h-4'>User {node.data.owner}</h1>

                      </div>
                      <hr></hr>
                      {node.data.comments.map((c, i) => (
                        (c.commenter === userid) && (<p key={i} className='whitespace-pre-wrap max-h-[10vh] overflow-auto text-sm font-mono'>{i + 1}. {c.comment}</p>)
                      ))}


                    </div>
                  ))}
                </div>
              </div>


            </div>


            <button className='w-full rounded py-2 top-10 bg-blue-500 hover:bg-blue-700 text-white' onClick={() => setShowProfile(false)}>Close</button>
          </div>
        </div>

      )}
    </div>
  )
}

export default App



{/*
Things left to add:
1. Ownership of note -> Ability to edit and drag only your nodes
1.1 Max number of live nodes
2. Commenting -> Delete too for owner of comment

3. Profile History

  */}