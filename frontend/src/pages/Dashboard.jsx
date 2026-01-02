import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { cryptoService } from '../services/crypto';
import { db } from '../lib/firebase';
import { doc, onSnapshot, collection, query, orderBy, getDoc } from 'firebase/firestore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LogOut, UserPlus, MessageSquare, Send, User, Lock, Loader2, Reply, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ContactItem = ({ contactId, isActive, onClick }) => {
    const [name, setName] = useState(contactId);

    useEffect(() => {
        if (!contactId) return;

        const ref = doc(db, "users", contactId);

        const unsub = onSnapshot(ref,
            (docSnapshot) => {
                if (docSnapshot.exists() && docSnapshot.data().username) {
                    setName(docSnapshot.data().username);
                }
            },
            (error) => {
                console.warn(`Konnt Kontakt ${contactId} nicht laden (Permission denied):`, error.code);
            }
        );

        return () => unsub();
    }, [contactId]);

    return (
        <div
            onClick={onClick}
            className={`p-3 rounded-lg cursor-pointer transition-all border ${isActive ? 'bg-white/5 border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]' : 'hover:bg-white/5 border-transparent'}`}
        >
            <div className="flex justify-between items-center mb-1">
                <div className={`font-bold text-sm ${isActive ? 'text-emerald-400' : 'text-neutral-300'}`}>
                    {name}
                </div>
                <Lock className="w-3 h-3 text-neutral-600" />
            </div>
            <div className="text-[10px] text-neutral-500 font-mono truncate">
                ID: {contactId.slice(0, 6)}...
            </div>
        </div>
    );
};

const formatTime = (timestamp) => {
    if (!timestamp) return "...";
    try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return "Err";
    }
};

const NavItem = ({ icon: Icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`p-3 rounded-xl transition-all mb-2 ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
    >
        <Icon className="h-6 w-6" />
    </button>
);

export default function Dashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const [activeTab, setActiveTab] = useState('chats');
    const [selectedChat, setSelectedChat] = useState(null);

    const [messageInput, setMessageInput] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);

    const [contactIdInput, setContactIdInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    const [userData, setUserData] = useState(null);
    const [activeChatMessages, setActiveChatMessages] = useState([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChatMessages, replyingTo]);

    useEffect(() => {
        if (!user?.uid) return;

        const unsub = onSnapshot(doc(db, "users", user.uid), (docSnapshot) => {
            if (docSnapshot.exists()) {
                setUserData(docSnapshot.data());
            }
        }, (error) => {
            console.error("User Listener Error:", error);
        });

        return () => unsub();
    }, [user?.uid]);

    useEffect(() => {
        if (!selectedChat?.chatId) return;

        setLoading(true);
        setReplyingTo(null);

        const q = query(
            collection(db, "chats", selectedChat.chatId, "messages"),
            orderBy("sentAt", "asc")
        );

        const unsubChat = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

            const decryptedMsgs = msgs.map(m => {
                let content = "⚠️ Error";
                try {
                    content = cryptoService.decrypt(m.content, selectedChat.chatId);
                } catch(e) {}
                return { ...m, content };
            });

            setActiveChatMessages(decryptedMsgs);
            setLoading(false);
        }, (error) => {
            console.error("Chat Listener Error:", error);
            setLoading(false);
        });

        return () => unsubChat();
    }, [selectedChat?.chatId]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAddContact = async (e) => {
        e.preventDefault();
        if (!contactIdInput) return;
        setStatusMsg("");
        try {
            await chatAPI.addContact(user.uid, contactIdInput);
            setStatusMsg("Success: Request sent.");
            setContactIdInput("");
        } catch (err) {
            setStatusMsg("Error: " + (err.response?.data?.error || "Failed"));
        }
    };

    const handleAcceptContact = async (requesterId) => {
        try {
            await chatAPI.acceptContact(user.uid, requesterId);
        } catch (err) {
            console.error(err);
        }
    };

    const handleStartChat = async (contactId) => {
        try {
            const res = await chatAPI.createChat(user.uid, contactId);
            const chatId = res.chatId;

            setSelectedChat({ chatId, partnerId: contactId });
            setActiveTab('chats');
        } catch (err) {
            console.error("Start Chat Error", err);
        }
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
            console.error("Send Error", err);
            setMessageInput(plainText);
            alert("Failed to send message");
        }
    };

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
                <div className="px-2 w-full flex justify-center">
                    <NavItem icon={LogOut} onClick={handleLogout} />
                </div>
            </div>

            <div className="w-80 border-r border-neutral-800 bg-[#0a0a0a] flex flex-col">
                <div className="p-4 border-b border-neutral-800 bg-neutral-900/20">
                    <h2 className="font-bold text-lg">{activeTab === 'chats' ? 'Active Feeds' : 'Network'}</h2>
                    <div className="text-xs text-neutral-500 font-mono mt-1 break-all cursor-pointer hover:text-emerald-500 transition-colors"
                         onClick={() => navigator.clipboard.writeText(user?.uid)}>
                        ID: {user?.uid?.slice(0, 8)}...
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-neutral-800">
                    {activeTab === 'contacts' && (
                        <div className="space-y-4 p-2">
                            <form onSubmit={handleAddContact} className="space-y-2 p-3 bg-neutral-900/50 rounded-lg border border-neutral-800">
                                <label className="text-xs text-neutral-500 uppercase font-bold">Add by ID</label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Paste ID..."
                                        value={contactIdInput}
                                        onChange={(e) => setContactIdInput(e.target.value)}
                                        className="h-8 text-xs"
                                    />
                                    <Button type="submit" className="h-8 px-3">Add</Button>
                                </div>
                                {statusMsg && <p className="text-[10px] text-emerald-500">{statusMsg}</p>}
                            </form>

                            {myRequests.map(reqId => (
                                <div key={reqId} className="p-3 bg-emerald-900/10 border border-emerald-500/20 rounded-lg flex flex-col gap-2">
                                    <div className="text-xs font-mono text-emerald-200">{reqId}</div>
                                    <Button onClick={() => handleAcceptContact(reqId)} className="w-full h-7 text-[10px]">Confirm Connection</Button>
                                </div>
                            ))}

                            <div>
                                <h3 className="text-xs text-neutral-500 uppercase font-bold px-1 mb-2">My Contacts</h3>
                                {myContacts.map((contactId) => (
                                    <ContactItem
                                        key={contactId}
                                        contactId={contactId}
                                        isActive={false}
                                        onClick={() => handleStartChat(contactId)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Chats Tab */}
                    {activeTab === 'chats' && (
                        <>
                            {myContacts.map((contactId) => (
                                // NEU: Auch hier ContactItem für korrekte Namen
                                <ContactItem
                                    key={contactId}
                                    contactId={contactId}
                                    isActive={selectedChat?.partnerId === contactId}
                                    onClick={() => handleStartChat(contactId)}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-[#050505] relative">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#202020_1px,transparent_1px),linear-gradient(to_bottom,#202020_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                {selectedChat ? (
                    <>
                        <div className="h-16 border-b border-neutral-800 flex items-center px-6 backdrop-blur-sm z-10 bg-neutral-900/80 justify-between">
                            <div className="flex items-center">
                                {/* ... Status Icon ... */}
                                <div>
                                    <div className="font-bold text-sm text-white flex items-center gap-2">
                                        {selectedChat.partnerId}
                                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-900/50 text-emerald-400 border border-emerald-500/20 font-mono">E2EE</span>
                                    </div>
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
                                            <div className={`mb-1 text-[10px] bg-neutral-800/50 px-3 py-1 rounded-full border border-neutral-800 text-neutral-400 max-w-[60%] truncate cursor-pointer hover:text-emerald-400`}
                                                 onClick={() => document.getElementById(msg.replyTo)?.scrollIntoView({behavior: 'smooth'})}>
                                                Reply to: {repliedToMsg.content.substring(0, 30)}...
                                            </div>
                                        )}

                                        <div id={msg.id} className="group relative flex items-end gap-2 max-w-[70%]">
                                            {!isMe && (
                                                <button onClick={() => setReplyingTo(msg)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded">
                                                    <Reply className="w-3 h-3 text-neutral-500" />
                                                </button>
                                            )}

                                            <div className={`rounded-2xl px-4 py-2 text-sm shadow-lg backdrop-blur-sm border ${
                                                isMe
                                                    ? 'bg-emerald-600/20 text-emerald-50 border-emerald-500/30 rounded-tr-sm'
                                                    : 'bg-neutral-800/80 text-neutral-200 border-neutral-700 rounded-tl-sm'
                                            }`}>
                                                <div className="break-words">{msg.content}</div>
                                                <div className={`text-[9px] mt-1 font-mono flex items-center gap-1 ${isMe ? 'text-emerald-400/60 justify-end' : 'text-neutral-500'}`}>
                                                    {formatTime(msg.sentAt)}
                                                    {isMe && <span>✓</span>}
                                                </div>
                                            </div>

                                            {isMe && (
                                                <button onClick={() => setReplyingTo(msg)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded">
                                                    <Reply className="w-3 h-3 text-neutral-500" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-neutral-800 bg-neutral-900/80 z-10 backdrop-blur-md">
                            {replyingTo && (
                                <div className="flex items-center justify-between bg-neutral-800/50 border border-neutral-700 rounded-t-lg px-4 py-2 mb-2 text-xs">
                                    <div className="flex items-center gap-2 text-neutral-300">
                                        <Reply className="w-3 h-3 text-emerald-500" />
                                        <span>Replying to: <span className="font-mono text-emerald-400/80">{replyingTo.content.substring(0, 40)}...</span></span>
                                    </div>
                                    <button onClick={() => setReplyingTo(null)} className="hover:text-red-400 text-neutral-500">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSendMessage} className="flex gap-2 max-w-4xl mx-auto">
                                <input
                                    className="flex-1 bg-neutral-950/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder-neutral-600 font-mono"
                                    placeholder="Encrypt & Send Message..."
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                />
                                <Button type="submit" className="h-full aspect-square p-0 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500">
                                    <Send className="w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-neutral-600 gap-4">
                        <div className="w-20 h-20 rounded-full bg-neutral-900/50 flex items-center justify-center border border-neutral-800">
                            <Lock className="w-8 h-8 opacity-20" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-neutral-400">Secure Environment Ready</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}