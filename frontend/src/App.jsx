// import { useState } from 'react'
import './App.css'
import '@xyflow/react/dist/style.css';
import {Background, ReactFlow, useNodesState, Controls}  from '@xyflow/react'

async function callServer(){
  console.log("PRESS")
  var res = await fetch("http://localhost:8000")
  var body = await res.json()
  
  console.log(body)
}

const snippets = [
  {
    id:'1',
    owner:'me',
    data:{label:'something'},
    position: {x:0, y:50}
  }
]


function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(snippets);
  return (
    <div>
      <header className='border-2'>
        <h1 className="text-3xl align-middle text-center">Wall Of Shame</h1>
      </header>
      <div className='h-screen'>
        <ReactFlow nodes={nodes} onNodesChange={onNodesChange} snapToGrid={true} snapGrid={[10,10]}>
          <Background/>
          <Controls/>
        </ReactFlow>

      </div>
      <button className='bg-blue-500 hover:bg-blue-700' onClick={()=>callServer()}>hELLO</button>
    </div>
  )
}

export default App
