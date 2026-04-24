// import { useState } from 'react'
import './App.css'
import '@xyflow/react/dist/base.css';
import { Background, ReactFlow, useNodesState, Controls, useReactFlow } from '@xyflow/react'
import { useState, useEffect } from 'react';



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

function stickyNote(node) {
  // console.log(node.data, style)
  return (
    <div className='p-2 rounded-md border-2 w-48 max-h-[20vh] overflow-y-auto' style={{ backgroundColor: colors[node.data.color].light, borderColor: colors[node.data.color].dark }}>
      <h1 className='font-mono font-bold'>{node.data.title}</h1>
      <hr></hr>
      <h1 className='font-mono'>{node.data.label}</h1>
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
const MAXHEIGHT = window.innerHeight * 0.2 + 20 //20vh
const MAXWIDTH = 192 + 20 //w-48


function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [title, setTitle] = useState("")
  const [label, setLabel] = useState("")
  const [colorID, setColorId] = useState(1)
  const { getIntersectingNodes, screenToFlowPosition, setCenter, getZoom } = useReactFlow()
  // const {addNodes , screenToFlowPosition } =useReactFlow()
  async function callServer() {
    console.log("Fetch Data")
    var res = await fetch("http://localhost:8000/nodes")
    var body = await res.json()
    console.log(body)
    setNodes(body)
  }
  useEffect(() => {
    callServer()
  }, [setNodes])

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
    const flow = document.querySelector('.react-flow')
    const pos = screenToFlowPosition({ x: flow.clientWidth / 2, y: flow.clientHeight / 2 })
    const safePos = findPosition(pos.x, pos.y)
    var id = "0"//await getIds() || 0

    const newNode = {
      id: id,
      type: 'stickyNote',
      owner: 'me',
      data: { label: label, color: colIDS[colorID], title: title },
      position: safePos
    }

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

  return (
    <div>
      <header className='border-2'>
        <h1 className="text-3xl align-middle text-center">Wall Of Shame</h1>
      </header>
      <div className='h-screen'>
        <ReactFlow nodes={nodes} nodeTypes={nodeTypes} onNodesChange={onNodesChange} snapToGrid={true} snapGrid={[10, 10]} onNodesChange={onNodesChange} onNodeDragStop={onNodeDragStop} >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <div className='fixed bottom-10 right-10 z-50 w-64 p-4 bg-white/60 h-auto rounded border border-black'>
        <input className='w-full font-mono font-bold text-3xl' placeholder='Enter Title...' value={title} onChange={(e) => { setTitle(e.target.value) }}></input>
        <input className='w-full font-mono text-xl' placeholder='Enter your note...' value={label} onChange={(e) => { setLabel(e.target.value) }}></input>
        <div className='flex flex-row gap-2 my-4 w-10/12  items-center justify-center mx-auto'>
          <button className={`w-12 h-12 rounded  bg-red-500 hover:bg-red-700 ${colorID == 1 ? 'ring-4 ring-black ring-offset-2' : 'ring-0'}`} onClick={() => { setColorId(1) }}></button>
          <button className={`w-12 h-12 rounded  bg-blue-500 hover:bg-blue-700 ${colorID == 2 ? 'ring-4 ring-black ring-offset-2' : 'ring-0'}`} onClick={() => { setColorId(2) }}></button>
          <button className={`w-12 h-12 rounded  bg-green-500 hover:bg-redgreen700 ${colorID == 3 ? 'ring-4 ring-black ring-offset-2' : 'ring-0'}`} onClick={() => { setColorId(3) }}></button>
          <button className={`w-12 h-12 rounded  bg-yellow-500 hover:bg-red-yellow ${colorID == 4 ? 'ring-4 ring-black ring-offset-2' : 'ring-0'}`} onClick={() => { setColorId(4) }}></button>
        </div>
        <button className='w-full rounded py-2 top-10 bg-blue-500 hover:bg-blue-700' onClick={onAddNode}>hELLO</button>
      </div>
    </div>
  )
}

export default App



{/*
Things left to add:
0. Connect backend with nodes data
1. Ownership of note -> Ability to edit and drag only your nodes
2. Commenting -> Delete too for owner of comment
3. Profile History

  */}