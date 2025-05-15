import { BiArrowBack } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-700/80">
        <div className="max-w-md mx-auto w-full flex items-center justify-center relative p-4 text-zinc-300">
          <button className="p-2 hover:bg-zinc-800 rounded-full absolute left-0 transition-colors" onClick={() => navigate(-1)}>
            <BiArrowBack className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold ">Music List</h1>
        </div>
      </div>
    </nav>
  )
}

export default Header