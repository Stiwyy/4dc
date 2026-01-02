import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { cryptoService } from '../services/crypto';
import { db } from '../lib/firebase';
import { doc, onSnapshot, collection, query, orderBy, where } from 'firebase/firestore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LogOut, UserPlus, MessageSquare, Send, User, Lock, Reply, X, Trash2, Pencil, Check, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactItem = ({ contactId, isActive, onClick }) => {
    const [name, setName] = useState(contactId);

    useEffect(() => {
        if (!contactId) return;
        const unsub = onSnapshot(doc(db, "users", contactId),
            (doc) => { if (doc.exists() && doc.data().username) setName(doc.data().username); },
            (err) => console.warn("Name fetch error", err.code)
        );
        return () => unsub();
    }, [contactId]);

    return (
        <div onClick={onClick} className={`p-3 rounded-lg cursor-pointer transition-all border ${isActive ? 'bg-white/5 border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]' : 'hover:bg-white/5 border-transparent'}`}>
            <div className="flex justify-between items-center mb-1">
                <div className={`font-bold text-sm flex items-center gap-2 ${isActive ? 'text-emerald-400' : 'text-neutral-300'}`}>
                    <User className="w-3 h-3" />
                    {name}
                </div>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono truncate">ID: {contactId?.slice(0, 6)}...</div>
        </div>
    );
};

const GroupItem = ({ chatData, isActive, onClick }) => {
    return (
        <div onClick={onClick} className={`p-3 rounded-lg cursor-pointer transition-all border ${isActive ? 'bg-white/5 border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]' : 'hover:bg-white/5 border-transparent'}`}>
            <div className="flex justify-between items-center mb-1">
                <div className={`font-bold text-sm flex items-center gap-2 ${isActive ? 'text-emerald-400' : 'text-neutral-300'}`}>
                    <Users className="w-3 h-3" />
                    {chatData.name || "Unbenannte Gruppe"}
                </div>
            </div>
            <div className="text-[10px] text-neutral-500 font-mono truncate">
                {chatData.members?.length || 0} Members
            </div>
        </div>
    );
};

const ChatHeaderTitle = ({ selectedChat }) => {
    const [displayName, setDisplayName] = useState("Loading...");

    useEffect(() => {
        if (selectedChat.type === 'group') {
            setDisplayName(selectedChat.name);
        } else {
            const unsub = onSnapshot(doc(db, "users", selectedChat.partnerId),
                (doc) => { if (doc.exists() && doc.data().username) setDisplayName(doc.data().username); },
                (err) => console.warn("Header name fetch error", err.code)
            );
            return () => unsub();
        }
    }, [selectedChat]);

    return (
        <div className="font-bold text-sm text-white flex items-center gap-2">
            {selectedChat.type === 'group' ? <Users className="w-4 h-4 text-emerald-500" /> : <User className="w-4 h-4 text-emerald-500" />}
            {displayName}
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-900/50 text-emerald-400 border border-emerald-500/20 font-mono">
                {selectedChat.type === 'group' ? 'GROUP' : 'E2EE'}
            </span>
        </div>
    );
};

const formatTime = (timestamp) => {
    if (!timestamp) return "...";
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) { return "Err"; }
};

const NavItem = ({ icon: Icon, active, onClick }) => (
    <button onClick={onClick} className={`p-3 rounded-xl transition-all mb-2 ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}>
        <Icon className="h-6 w-6" />
    </button>
);

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const [activeTab, setActiveTab] = useState('chats');
    const [selectedChat, setSelectedChat] = useState(null);

    const [myChats, setMyChats] = useState([]);
    const [userData, setUserData] = useState(null);
    const [activeChatMessages, setActiveChatMessages] = useState([]);

    const [messageInput, setMessageInput] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editText, setEditText] = useState("");

    const [contactIdInput, setContactIdInput] = useState("");
    const [statusMsg, setStatusMsg] = useState("");
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(() => { scrollToBottom(); }, [activeChatMessages, replyingTo, editingMessageId]);

    useEffect(() => {
        if (!user?.uid) return;
        const unsub = onSnapshot(doc(db, "users", user.uid),
            (d) => { if (d.exists()) setUserData(d.data()); },
            (e) => console.error("User listener error", e)
        );
        return () => unsub();
    }, [user?.uid]);

    useEffect(() => {
        if (!user?.uid) return;

        const q = query(
            collection(db, "chats"),
            where("members", "array-contains", user.uid),
            orderBy("lastMessageAt", "desc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const chats = snapshot.docs.map(d => ({ chatId: d.id, ...d.data() }));
            setMyChats(chats);
        }, (err) => console.error("Chat list error", err));

        return () => unsub();
    }, [user?.uid]);

    useEffect(() => {
        if (!selectedChat?.chatId) return;

        setReplyingTo(null);
        setEditingMessageId(null);

        const q = query(collection(db, "chats", selectedChat.chatId, "messages"), orderBy("sentAt", "asc"));

        const unsubChat = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            const decryptedMsgs = msgs.map(m => {
                let content = "⚠️ Error";
                try { content = cryptoService.decrypt(m.content, selectedChat.chatId); } catch(e) {}
                return { ...m, content };
            });
            setActiveChatMessages(decryptedMsgs);
        }, (err) => console.error("Message listener error", err));

        return () => unsubChat();
    }, [selectedChat?.chatId]);


    const handleCreateGroup = async (e) => {
        e.preventDefault();
        if (!newGroupName.trim() || selectedGroupMembers.length === 0) return;
        try {
            const res = await chatAPI.createGroup(newGroupName, selectedGroupMembers);
            setShowGroupModal(false);
            setNewGroupName("");
            setSelectedGroupMembers([]);

            // Optional: Direkt öffnen
            setSelectedChat({ chatId: res.chatId, type: 'group', name: newGroupName });
        } catch (err) {
            console.error(err);
            alert("Error while creating group");
        }
    };

    const toggleGroupMember = (id) => {
        setSelectedGroupMembers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const handleDeleteMessage = async (msgId) => {
        if(!window.confirm("Delete permanently?")) return;
        try { await chatAPI.deleteMessage(selectedChat.chatId, msgId, user.uid); }
        catch(err) { console.error(err); }
    };

    const saveEdit = async () => {
        if (!editingMessageId || !editText.trim()) {
            setEditingMessageId(null); return;
        }
        try {
            const encryptedNew = cryptoService.encrypt(editText, selectedChat.chatId);
            await chatAPI.editMessage(selectedChat.chatId, editingMessageId, user.uid, encryptedNew);
            setEditingMessageId(null);
            setEditText("");
        } catch(err) { console.error(err); alert("Update failed"); }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !selectedChat) return;
        const plainText = messageInput;
        const currentReplyId = replyingTo?.id || null;
        setMessageInput("");
        setReplyingTo(null);
        try {
            const encrypted = cryptoService.encrypt(plainText, selectedChat.chatId);
            await chatAPI.sendMessage(selectedChat.chatId, user.uid, encrypted, currentReplyId);
        } catch (err) {
            console.error(err);
            setMessageInput(plainText);
        }
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        if (!contactIdInput) return;
        setStatusMsg("");
        try {
            await chatAPI.addContact(user.uid, contactIdInput);
            setStatusMsg("Request sent.");
            setContactIdInput("");
        } catch (err) { setStatusMsg("Error: " + (err.response?.data?.error || "Failed")); }
    };

    const handleStartChat = async (cid) => {
        try {
            const res = await chatAPI.createChat(user.uid, cid);
            setSelectedChat({ chatId: res.chatId, partnerId: cid, type: 'direct' });
            setActiveTab('chats');
        } catch (e) { console.error(e); }
    };

    const handleLogout = () => { logout(); navigate('/'); };
    const myContacts = userData?.contacts || [];
    const myRequests = userData?.contactRequestsReceived || [];

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
            <div className="w-20 flex flex-col items-center py-6 border-r border-neutral-800 bg-neutral-900/30 backdrop-blur-sm">
                <div className="mb-8 font-bold text-emerald-500 text-xl tracking-tighter select-none">4dc</div>
                <div className="flex-1 flex flex-col items-center w-full px-2 gap-2">
                    <NavItem icon={MessageSquare} active={activeTab === 'chats'} onClick={() => setActiveTab('chats')} />
                    <NavItem icon={UserPlus} active={activeTab === 'contacts'} onClick={() => setActiveTab('contacts')} />
                </div>
                <div className="px-2 w-full flex justify-center"><NavItem icon={LogOut} onClick={handleLogout} /></div>
            </div>

            <div className="w-80 border-r border-neutral-800 bg-[#0a0a0a] flex flex-col">
                <div className="p-4 border-b border-neutral-800 bg-neutral-900/20">
                    <h2 className="font-bold text-lg">{activeTab === 'chats' ? 'Active Feeds' : 'Network'}</h2>
                    <div className="text-xs text-neutral-500 font-mono mt-1 cursor-pointer hover:text-emerald-500" onClick={() => navigator.clipboard.writeText(user?.uid)}>ID: {user?.uid?.slice(0, 8)}...</div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-neutral-800">
                    {activeTab === 'chats' && (
                        <div className="space-y-2">
                            <button onClick={() => setShowGroupModal(true)} className="w-full py-2 mb-2 flex items-center justify-center gap-2 text-xs font-bold text-emerald-500 border border-emerald-500/20 rounded hover:bg-emerald-500/10 transition-colors">
                                <Plus className="w-4 h-4" /> New Group
                            </button>

                            {myChats.length === 0 && <div className="text-xs text-neutral-600 text-center mt-4">No active chats.</div>}

                            {myChats.map((chat) => {
                                if (chat.type === 'group') {
                                    return <GroupItem key={chat.chatId} chatData={chat} isActive={selectedChat?.chatId === chat.chatId} onClick={() => setSelectedChat({...chat})} />;
                                } else {
                                    const partnerId = chat.members.find(m => m !== user.uid);
                                    if(!partnerId) return null;
                                    return <ContactItem key={chat.chatId} contactId={partnerId} isActive={selectedChat?.chatId === chat.chatId} onClick={() => setSelectedChat({ chatId: chat.chatId, partnerId, type: 'direct' })} />;
                                }
                            })}
                        </div>
                    )}

                    {activeTab === 'contacts' && (
                        <div className="space-y-4 p-2">
                            <form onSubmit={handleAddContact} className="space-y-2 p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                                <label className="text-xs text-neutral-500 uppercase font-bold">Add by ID</label>
                                <div className="flex gap-2">
                                    <Input placeholder="Paste ID..." value={contactIdInput} onChange={(e) => setContactIdInput(e.target.value)} className="h-8 text-xs" />
                                    <Button type="submit" className="h-8 px-3">Add</Button>
                                </div>
                                {statusMsg && <p className="text-[10px] text-emerald-500">{statusMsg}</p>}
                            </form>

                            {myRequests.map(reqId => (
                                <div key={reqId} className="p-3 bg-emerald-900/10 border border-emerald-500/20 rounded-lg flex flex-col gap-2">
                                    <div className="text-xs font-mono text-emerald-200">{reqId}</div>
                                    <Button onClick={() => chatAPI.acceptContact(user.uid, reqId)} className="w-full h-7 text-[10px]">Confirm Connection</Button>
                                </div>
                            ))}

                            <div>
                                <h3 className="text-xs text-neutral-500 uppercase font-bold px-1 mb-2">My Contacts</h3>
                                {myContacts.map((contactId) => (
                                    <ContactItem key={contactId} contactId={contactId} isActive={false} onClick={() => handleStartChat(contactId)} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col bg-[#050505] relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                {selectedChat ? (
                    <>
                        <div className="h-16 border-b border-neutral-800 flex items-center px-6 backdrop-blur-sm z-10 bg-neutral-900/80 justify-between">
                            <div className="flex items-center">
                                <span className="relative flex h-3 w-3 mr-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span></span>
                                <div>
                                    <ChatHeaderTitle selectedChat={selectedChat} />
                                    <div className="text-[10px] text-neutral-400 font-mono tracking-wider mt-0.5">SESSION ID: {selectedChat.chatId.slice(0,8)}...</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 z-10 scrollbar-thin scrollbar-thumb-neutral-800">
                            {activeChatMessages.map((msg) => {
                                const isMe = msg.senderId === user.uid;
                                const repliedToMsg = msg.replyTo ? activeChatMessages.find(m => m.id === msg.replyTo) : null;
                                return (
                                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                        {repliedToMsg && (
                                            <div className="mb-1 text-[10px] bg-neutral-800/50 px-3 py-1 rounded-full border border-neutral-800 text-neutral-400 max-w-[60%] truncate cursor-pointer hover:text-emerald-400" onClick={() => document.getElementById(msg.replyTo)?.scrollIntoView({behavior: 'smooth'})}>
                                                Reply: {repliedToMsg.content.substring(0, 30)}...
                                            </div>
                                        )}

                                        <div id={msg.id} className="group relative flex items-end gap-2 max-w-[70%]">
                                            {!isMe && <button onClick={() => setReplyingTo(msg)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"><Reply className="w-3 h-3 text-neutral-500" /></button>}

                                            <div className={`rounded-2xl px-4 py-2 text-sm shadow-lg backdrop-blur-sm border relative group/msg ${isMe ? 'bg-emerald-600/20 text-emerald-50 border-emerald-500/30 rounded-tr-sm' : 'bg-neutral-800/80 text-neutral-200 border-neutral-700 rounded-tl-sm'}`}>
                                                {editingMessageId === msg.id ? (
                                                    <div className="flex flex-col gap-2 min-w-[200px]">
                                                        <input autoFocus className="bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-sm focus:outline-none w-full" value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') saveEdit(); if(e.key === 'Escape') setEditingMessageId(null); }} />
                                                        <div className="flex gap-2 justify-end">
                                                            <button onClick={() => setEditingMessageId(null)} className="text-[10px] text-neutral-400"><X className="w-3 h-3" /></button>
                                                            <button onClick={saveEdit} className="text-[10px] text-emerald-400 font-bold"><Check className="w-3 h-3" /></button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="break-words">{msg.content}{msg.isEdited && <span className="text-[8px] text-neutral-500 ml-1">(edited)</span>}</div>
                                                )}

                                                <div className={`text-[9px] mt-1 font-mono flex items-center gap-1 ${isMe ? 'text-emerald-400/60 justify-end' : 'text-neutral-500'}`}>
                                                    {formatTime(msg.sentAt)}
                                                    {isMe && <span>✓</span>}
                                                </div>

                                                {isMe && editingMessageId !== msg.id && (
                                                    <div className="absolute -top-3 right-0 hidden group-hover/msg:flex gap-1 bg-neutral-900 border border-neutral-800 rounded px-1 py-0.5">
                                                        <button onClick={() => { setEditingMessageId(msg.id); setEditText(msg.content); }} className="p-1 hover:text-emerald-400 text-neutral-500"><Pencil className="w-2.5 h-2.5" /></button>
                                                        <button onClick={() => handleDeleteMessage(msg.id)} className="p-1 hover:text-red-400 text-neutral-500"><Trash2 className="w-2.5 h-2.5" /></button>
                                                    </div>
                                                )}
                                            </div>
                                            {isMe && <button onClick={() => setReplyingTo(msg)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"><Reply className="w-3 h-3 text-neutral-500" /></button>}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-neutral-800 bg-neutral-900/80 z-10 backdrop-blur-md">
                            {replyingTo && (
                                <div className="flex items-center justify-between bg-neutral-800/50 border border-neutral-700 rounded-t-lg px-4 py-2 mb-2 text-xs">
                                    <div className="flex items-center gap-2 text-neutral-300"><Reply className="w-3 h-3 text-emerald-500" /><span>Reply to: <span className="font-mono text-emerald-400/80">{replyingTo.content.substring(0, 40)}...</span></span></div>
                                    <button onClick={() => setReplyingTo(null)} className="hover:text-red-400 text-neutral-500"><X className="w-4 h-4" /></button>
                                </div>
                            )}
                            <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
                                <input className="flex-1 bg-neutral-950/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 font-mono" placeholder="Encrypt & Send Message..." value={messageInput} onChange={(e) => setMessageInput(e.target.value)} />
                                <Button type="submit" className="h-full aspect-square p-0 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500"><Send className="w-5 h-5" /></Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 gap-4">
                        <div className="w-20 h-20 rounded-full bg-neutral-900/50 flex items-center justify-center border border-neutral-800"><Lock className="w-8 h-8 opacity-20" /></div>
                        <div className="text-center"><h3 className="text-lg font-bold text-neutral-400">Secure Environment Ready</h3></div>
                    </div>
                )}
            </div>

            {showGroupModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0a0a0a] border border-neutral-800 p-6 rounded-xl w-96 shadow-2xl animate-in fade-in zoom-in-95">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-emerald-500"/> Create group</h3>

                        <Input placeholder="Gruppenname (z.B. Projekt Alpha)" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} className="mb-4" />

                        <div className="text-xs text-neutral-500 uppercase font-bold mb-2">Select members:</div>
                        <div className="max-h-40 overflow-y-auto mb-4 space-y-1 border border-neutral-800 rounded p-2 scrollbar-thin scrollbar-thumb-neutral-800">
                            {myContacts.length === 0 && <div className="text-xs text-neutral-600 p-2">No contacts found.</div>}
                            {myContacts.map(contactId => (
                                <label key={contactId} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded cursor-pointer transition-colors">
                                    <input type="checkbox" checked={selectedGroupMembers.includes(contactId)} onChange={() => toggleGroupMember(contactId)} className="accent-emerald-500 w-4 h-4 rounded border-neutral-700 bg-neutral-900" />
                                    <div className="flex-1 overflow-hidden">
                                        <ContactItem contactId={contactId} isActive={false} onClick={() => {}} />
                                    </div>
                                </label>
                            ))}
                        </div>

                        <div className="flex gap-2 justify-end pt-2 border-t border-neutral-800">
                            <Button variant="ghost" onClick={() => setShowGroupModal(false)} className="text-neutral-400">Cancel</Button>
                            <Button onClick={handleCreateGroup}>Create</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}