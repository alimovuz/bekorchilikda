import { FC } from "react";
import Test from "../../assets/ahmet-kaya.webp";
import { LuHeart, LuPlay } from "react-icons/lu";
interface ListItemProps {
  isActive: boolean
}


const ListItem:FC<ListItemProps> = ({isActive}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={`grid grid-cols-[16px_4fr_3fr_minmax(60px,1fr)] border-b border-zinc-700 hover:bg-zinc-800 transition-all group cursor-pointer gap-4 p-4 text-sm group ${isActive ? 'bg-zinc-800/50 text-red-500' : 'text-zinc-300'}`}>
      <div className="flex items-center justify-center">
        <span className="group-hover:hidden">{1}</span>
        <button className="hidden group-hover:flex items-center justify-center"><LuPlay size={14} /></button>
      </div>
      
      <div className="flex items-center w-fit gap-3">
        <div className="h-16 w-16 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
          <img src={Test} alt={"Ahmet Kaya"} className="h-full w-full object-cover"/>
        </div>
        <div>
          <div className={`font-medium truncate ${isActive ? 'text-red-500' : ''}`}>Soyle</div>
          <div className="text-xs text-zinc-400 truncate">Ahmet Kaya</div>
        </div>
      </div>
      
      <div className="flex items-center justify-center truncate">test</div>
      
      <div className="flex items-center justify-end gap-4">
        <button className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-white transition-colors"><LuHeart size={16} /></button>
        <span>{formatDuration(183)}</span>
      </div>
    </div>
  );
};

export default ListItem;