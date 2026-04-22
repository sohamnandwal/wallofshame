// import { useState } from 'react'
import './App.css'
import '@xyflow/react/dist/base.css';
import {Background, ReactFlow, useNodesState, Controls}  from '@xyflow/react'

async function callServer(){
  console.log("PRESS")
  var res = await fetch("http://localhost:8000")
  var body = await res.json()
  
  console.log(body)
}

const colors = {
  red:{light:'#fca5a5', dark:'#dc2626'},
  yellow:{light:'#fef08a', dark:'#eab308'},
  green:{light:'#bbf7d0', dark:'#22c55e'},
  blue:{light:'#bfdbfe', dark:'#3b82f6'},
}

function stickyNote (node){
  // console.log(node.data, style)
  return (
  <div className='p-2 rounded-md border-2' style={{backgroundColor:colors[node.data.color].light, borderColor:colors[node.data.color].dark}}>
    <h1 className='font-mono'>{node.data.label}</h1>
  </div>)
}

const snippets = [
  {
    id:'1',
    type:'stickyNote',
    owner:'me',
    data:{label:'red' , color:'red'},
    position: {x:0, y:50}
  },
  {
    id:'2',
    type:'stickyNote',
    owner:'me',
    data:{label:'yellow', color:'yellow'},
    position: {x:100, y:50}
  },
  {
    id:'3',
    type:'stickyNote',
    owner:'me',
    data:{label:'green' , color:'green'},
    position: {x:300, y:50}
  },
  {
    id:'4',
    type:'stickyNote',
    owner:'me',
    data:{label:'blue', color:'blue'},
    position: {x:200, y:50}
  }
]
const nodeTypes = {
  stickyNote: stickyNote
}

function App() {
  // eslint-disable-next-line no-unused-vars
  const [nodes, setNodes, onNodesChange] = useNodesState(snippets);
  return (
    <div>
      <header className='border-2'>
        <h1 className="text-3xl align-middle text-center">Wall Of Shame</h1>
      </header>
      <div className='h-screen'>
        <ReactFlow nodes={nodes} nodeTypes={nodeTypes} onNodesChange={onNodesChange} snapToGrid={true} snapGrid={[10,10]} >
          <Background/>
          <Controls/>
        </ReactFlow>

      </div>
      <button className='bg-blue-500 hover:bg-blue-700' onClick={()=>callServer()}>hELLO</button>
    </div>
  )
}

export default App
