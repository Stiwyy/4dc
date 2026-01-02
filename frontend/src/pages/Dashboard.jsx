import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { LogOut, UserPlus, MessageSquare, Settings, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavItem = ({ icon: Icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`p-3 rounded-xl transition-all mb-2 ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
    >
        <Icon className="h-6 w-6" />
    </button>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chats');

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden">

            <div className="w-20 flex flex-col items-center py-6 border-r border-neutral-800 bg-neutral-900/30">
                <div className="mb-8 font-bold text-emerald-500 text-xl tracking-tighter">4dc</div>

                <div className="flex-1 flex flex-col items-center w-full px-2">
                    <NavItem icon={MessageSquare} active={activeTab === 'chats'} onClick={() => setActiveTab('chats')} />
                    <NavItem icon={UserPlus} active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')} />
                    <NavItem icon={Settings} active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </div>

                <div className="px-2 w-full flex justify-center">
                    <NavItem icon={LogOut} onClick={handleLogout} />
                </div>
            </div>

            <div className="w-80 border-r border-neutral-800 bg-[#0a0a0a] flex flex-col">
                <div className="p-4 border-b border-neutral-800">
                    <h2 className="font-bold text-lg">{activeTab === 'chats' ? 'Active Feeds' : 'Network'}</h2>
                    <div className="text-xs text-neutral-500 font-mono mt-1">Status: Online</div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    <div className="p-3 rounded-lg bg-white/5 border border-emerald-500/20 cursor-pointer">
                        <div className="font-bold text-sm text-emerald-400">Alice</div>
                        <div className="text-xs text-neutral-400 truncate">dslfkldsj?</div>
                    </div>
                    <div className="p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                        <div className="font-bold text-sm text-white">Bob</div>
                        <div className="text-xs text-neutral-500 truncate">Meeting um 20:00</div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#050505] relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                <div className="h-16 border-b border-neutral-800 flex items-center px-6 backdrop-blur-sm z-10 bg-neutral-900/50">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
                    <div className="font-bold">Alice</div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 z-10">
                    <div className="flex justify-start">
                        <div className="bg-neutral-800 text-neutral-200 rounded-2xl rounded-tl-none px-4 py-2 max-w-md text-sm border border-neutral-700">
                            Test
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="bg-emerald-600/20 text-emerald-100 rounded-2xl rounded-tr-none px-4 py-2 max-w-md text-sm border border-emerald-500/30">
                            Test
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-neutral-800 bg-neutral-900/80 z-10 backdrop-blur-md">
                    <div className="flex gap-2">
                        <input
                            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors placeholder-neutral-600"
                            placeholder="Type encrypted message..."
                        />
                        <Button className="h-full aspect-square p-0 px-4">
                            <Send className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}