"use client"
import React, { useState } from 'react';
import { AiOutlineHome, AiOutlinePlayCircle } from 'react-icons/ai';
import { BsCollectionPlay } from 'react-icons/bs';
import FooterItem from './footer-item';

const navItems = [
  { icon: AiOutlineHome, label: 'Home', url:"/dashboard" },
  { icon: BsCollectionPlay, label: 'Playlists', url: "/playlist" },
  { icon: AiOutlinePlayCircle, label: 'Now Playing', url: "/player" }
];


const Footer: React.FC = () => {
    const pathname = window.location.pathname
    const [activeTab, setActiveTab] = useState(pathname);
    const onTabChange = (tabId: string) => setActiveTab(tabId);

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-800 px-2 py-1">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center">
              {navItems.map((item) => (
                <FooterItem url={item.url} key={item.url} icon={item.icon} label={item.label} isActive={activeTab === item.url} onClick={() => onTabChange(item.url)} />
              ))}
            </div>
          </div>
        </div>
      </nav>
    );
};

export default Footer;