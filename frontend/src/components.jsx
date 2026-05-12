
export const colors = {
  red: { light: '#fca5a5', dark: '#dc2626' },
  yellow: { light: '#fef08a', dark: '#eab308' },
  green: { light: '#bbf7d0', dark: '#22c55e' },
  blue: { light: '#bfdbfe', dark: '#3b82f6' },
  black: { light: '#d1d5db', dark: '#000000' }
}
export const colIDS = {
  1: 'red',
  2: 'blue',
  3: 'green',
  4: 'yellow'
}
export const inverseColIDS = {
  'red': 1,
  'blue': 2,
  'green': 3,
  'yellow': 4
}

export const stickyNote = (node) => {
  // console.log(node.data, style)
  // console.log(node, localStorage.getItem("userid"))
  return (
    <div className='relative group p-2 rounded-md border-2 min-w-48 max-w-xl max-h-[50vh] ' style={{ backgroundColor: colors[node.data.color].light, borderColor: colors[node.data.color].dark }}>
      {node.data.owner === localStorage.getItem("userid") && (
        <div className='absolute top-2 right-2 flex flex-row gap-1 z-10 opacity-0 group-hover:opacity-100'>
          <button className='w-4 h-4 hover:opacity-20' onClick={() => node.data.editNode(node)}>
            <img src="/pencil.svg" alt="Edit" className='w-4 h-4' />
          </button>
          <button className='w-4 h-4 hover:opacity-20' onClick={() => node.data.deleteNode(node.id)}>
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
      <p className='font-mono text-sm whitespace-pre-wrap overflow-y-auto max-h-[40vh] scrollbar m-2 p-2 bg-white/30 rounded-md'>{node.data.label}</p>
      <div className='flex justify-end w-full hover:opacity-40' onClick={() => node.data.commentNode(node.id)}>
        <p className='mr-1'>{node.data.comments.length}</p>
        <button className='w-4 h-4 ' >
          <img src="/comment.svg" alt="Delete" className='w-4 h-4' />
        </button>
      </div>
    </div>)
}