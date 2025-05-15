import { BiArrowBack } from 'react-icons/bi'
import { BsThreeDotsVertical } from 'react-icons/bs'

const Header = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-700/80">
      <div className="max-w-md mx-auto flex items-center justify-between p-4 text-zinc-300">
        <button className="px-2 py-1 hover:bg-zinc-800 rounded-full transition-colors">
          <BiArrowBack className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold ">Music List</h1>
        <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
          <BsThreeDotsVertical className="w-5 h-5" />
        </button>
      </div>
    </div>
  </nav>
  )
}

export default Header