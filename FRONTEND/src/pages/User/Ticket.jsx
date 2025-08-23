export function AdminTickets() {
    
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [newMessage, setNewMessage] = useState("")
    const [showMobileChat, setShowMobileChat] = useState(false)
    const messagesEndRef = useRef(null)
    const { data: tickets = [], isLoading, refetch } = useGetTicketsQuery([], {
        refetchOnFocus: true,
        refetchOnReconnect: true,
        pollingInterval: 10000  
    })
    const [sendMessage] = useSendMessageMutation()
    const [markMessageRead] = useMarkMessageReadMutation()

    // scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [selectedTicket?.messages])

    // mark unread messages as read when ticket is opened
    useEffect(() => {
        if (selectedTicket) {
            const unreadMessages = selectedTicket.messages.filter(
                (msg) => msg.sender_type === "admin" && !msg.is_read
            )
            unreadMessages.forEach((msg) => {
                markMessageRead({message_id: msg.id}).catch((err) => console.error("Failed to mark as read", err))
            })
        }
    }, [selectedTicket, markMessageRead])
    
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedTicket) return

        try {
            await sendMessage({
                ticket_id: selectedTicket.id,
                message: newMessage.trim(),
            }).unwrap()
            setNewMessage("")
            refetch()
        } catch (err) {
            console.error("Failed to send message", err)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "open":
                return "bg-green-100 text-green-800"
            case "pending":
                return "bg-yellow-100 text-yellow-800"
            case "closed":
                return "bg-gray-100 text-gray-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }

    const formatTime = (dateString) => {
        if (!dateString) return ""

        const date = new Date(dateString)
        if (isNaN(date.getTime())) return ""

        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))

        if (days === 0) {
            return date.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
            })
        } else if (days === 1) {
            return "Yesterday"
        } else if (days < 7) {
            return `${days} days ago`
        } else {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            })
        }
    }

    const filteredTickets = tickets.filter((ticket) =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleTicketSelect = (ticket) => {
        setSelectedTicket(ticket)
        setShowMobileChat(true)
    }

    const handleBackToList = () => {
        setShowMobileChat(false)
    }

    return (
        <div className="min-h-[75vh] flex bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow-sm overflow-hidden">
            {/* Sidebar */}
            <div
                className={`${showMobileChat ? "hidden" : "w-full"} md:w-1/3 md:flex border-r border-purple-200 flex flex-col bg-white/80 backdrop-blur-sm`}
            >
                {/* Header */}
                <div className="p-3 md:p-4 border-b border-purple-200 bg-white/90 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                            <span className="hidden sm:inline">Support Tickets</span>
                            <span className="sm:hidden">Tickets</span>
                        </h2>
                        
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/70 border border-purple-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Ticket List */}
                <div className="flex-1 overflow-y-auto bg-white/50 backdrop-blur-sm">
                    {isLoading ? (
                        <p className="text-center p-4 text-gray-500">Loading tickets...</p>
                    ) : filteredTickets.length === 0 ? (
                        <p className="text-center p-4 text-gray-500">No tickets found</p>
                    ) : (
                        filteredTickets.map((ticket) => {
                            const unreadCount = ticket.messages.filter(
                                (m) => !m.is_read && m.sender_type === "admin"
                            ).length

                            return (
                                <div
                                    key={ticket.id}
                                    onClick={() => handleTicketSelect(ticket)}
                                    className={`p-3 md:p-4 border-b border-purple-100 cursor-pointer hover:bg-purple-50/70 transition-colors ${selectedTicket?.id === ticket.id
                                        ? "bg-gradient-to-r from-purple-100 to-blue-50 border-l-4 border-l-purple-500"
                                        : ""
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="font-medium text-gray-800 truncate flex-1 mr-2 text-sm md:text-base">
                                            {ticket.subject}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            {unreadCount > 0 && (
                                                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-full px-2 py-1">
                                                    {unreadCount}
                                                </span>
                                            )}

                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {ticket.status}
                                        </span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatTime(ticket.created_at)}
                                        </span>
                                    </div>

                                    {ticket.messages.length > 0 && (
                                        <p className="text-xs md:text-sm text-gray-600 truncate mb-2">
                                            {ticket.messages[ticket.messages.length - 1].message}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {ticket.messages[ticket.messages.length - 1]?.sender_type === "admin" ? "Admin" : "You"}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatTime(ticket.messages[ticket.messages.length - 1]?.created_at)}
                                            {ticket.messages[ticket.messages.length - 1]?.sender_type === "user" && (
                                                ticket.messages[ticket.messages.length - 1]?.is_read ? (
                                                    <CheckCheck className="w-3 h-3 text-purple-500" />
                                                ) : (
                                                    <Check className="w-3 h-3 text-gray-400" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div
                className={`${showMobileChat ? "w-full" : "hidden"} md:flex md:flex-1 flex-col bg-gradient-to-br from-purple-50/30 to-blue-50/30 backdrop-blur-sm`}
            >
                {selectedTicket ? (
                    <>
                        {/* Header */}
                        <div className="p-3 md:p-4 border-b border-purple-200 bg-white/90 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleBackToList}
                                        className="md:hidden p-2 hover:bg-purple-100 rounded-lg"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                                    </button>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 text-sm md:text-base">{selectedTicket.subject}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                                                {selectedTicket.status}
                                            </span>
                                            <span className="text-xs text-gray-500">#{selectedTicket.id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
                            {selectedTicket.messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender_type === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[85%] md:max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${msg.sender_type === "user"
                                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                                            : "bg-white/90 text-gray-800 border border-purple-100"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{msg.message}</p>
                                        <div className={`flex items-center justify-end gap-1 mt-1 text-xs ${msg.sender_type === "user" ? "text-purple-200" : "text-gray-500"}`}>
                                            <span>{formatTime(msg.created_at)}</span>
                                            {msg.sender_type === "user" && (
                                                msg.is_read ? (
                                                    <CheckCheck className="w-3 h-3 text-purple-200" />
                                                ) : (
                                                    <Check className="w-3 h-3 text-purple-300" />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 md:p-4 border-t border-purple-200 bg-white/90 backdrop-blur-sm">
                            <div className="flex gap-2">
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type your message..."
                                    rows={1}
                                    className="flex-1 px-3 py-2 bg-white/70 border border-purple-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                                    style={{ minHeight: "40px", maxHeight: "120px" }}
                                    disabled={selectedTicket.status === 'closed'}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim() || selectedTicket.status === 'closed'}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2 shadow-md"
                                >
                                    <Send className="w-4 h-4" />
                                    <span className="hidden sm:inline">Send</span>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
                        <h3 className="text-lg font-medium">Select a ticket</h3>
                        <p className="text-sm">Choose a ticket from the list to start the conversation</p>
                    </div>
                )}
            </div>
            

        </div>
    )
}


import { useState, useRef, useEffect } from "react";
import { MessageCircle, Search, Clock, CheckCheck, Check, User, Calendar, Send, ArrowLeft, Plus } from "lucide-react";
import { useGetTicketsQuery, useSendMessageMutation, useMarkMessageReadMutation, useCreateTicketMutation } from "../../app/api/ticketApiSlice";
import './Ticket.css'; // Import the shared CSS file

export default function UserTickets() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [ticketsState, setTicketsState] = useState([]);
    const messagesEndRef = useRef(null);
    
    const { data: tickets = [], isLoading, refetch } = useGetTicketsQuery([], {
        refetchOnFocus: true,
        refetchOnReconnect: true,
        pollingInterval: 10000
    });
    const [sendMessage] = useSendMessageMutation();
    const [markMessageRead] = useMarkMessageReadMutation();
    const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();

    useEffect(() => { setTicketsState(tickets); }, [tickets]);

    const selectedTicket = ticketsState.find((t) => t.id === selectedTicketId) || null;

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selectedTicket?.messages]);

    useEffect(() => {
        if (selectedTicket) {
            const unreadMessages = selectedTicket.messages.filter((msg) => msg.sender_type === "admin" && !msg.is_read);
            if (unreadMessages.length > 0) {
                unreadMessages.forEach((msg) => { markMessageRead({ message_id: msg.id }).catch(err => console.error("Failed to mark as read", err)); });
            }
        }
    }, [selectedTicket, markMessageRead]);

    const handleCreateTicket = async () => {
        try {
            await createTicket({ subject, message }).unwrap();
            setSubject("");
            setMessage("");
            setShowCreateModal(false);
            refetch();
        } catch (err) {
            console.error("Failed to create ticket", err);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedTicket) return;
        const messageToSend = newMessage.trim();
        setNewMessage("");
        try {
            const savedMessage = await sendMessage({ ticket_id: selectedTicket.id, message: messageToSend }).unwrap();
            setTicketsState(prev => prev.map(ticket => ticket.id === selectedTicket.id ? { ...ticket, messages: [...ticket.messages, savedMessage.data] } : ticket));
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
    };

    const getStatusColorClass = (status) => {
        switch (status) {
            case "open": return "status-open";
            case "pending": return "status-pending";
            case "closed": return "status-closed";
            default: return "status-closed";
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const filteredTickets = ticketsState
        .filter((ticket) => ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            const aLastMsg = a.messages[a.messages.length - 1];
            const bLastMsg = b.messages[b.messages.length - 1];
            const aTime = new Date(aLastMsg?.created_at || a.created_at).getTime();
            const bTime = new Date(bLastMsg?.created_at || b.created_at).getTime();
            return bTime - aTime;
        });

    const handleTicketSelect = (ticketId) => {
        setSelectedTicketId(ticketId);
        setShowMobileChat(true);
    };

    const handleBackToList = () => {
        setShowMobileChat(false);
    };

    return (
        <div className="tickets-container">
            {/* Sidebar */}
            <div className={`sidebar ${showMobileChat ? 'mobile-hidden' : ''}`}>
                <div className="sidebar-header">
                    <div className="header-top">
                        <h2 className="header-title">
                            <MessageCircle className="title-icon" />
                            <span className="title-text-lg">Support Tickets</span>
                            <span className="title-text-sm">Tickets</span>
                        </h2>
                        <button className="create-ticket-button" onClick={() => setShowCreateModal(true)}>
                            <Plus className="icon-meta" />
                        </button>
                    </div>
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input type="text" placeholder="Search tickets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
                    </div>
                </div>

                <div className="ticket-list">
                    {isLoading ? (<p className="ticket-list-message">Loading tickets...</p>) : filteredTickets.length === 0 ? (<p className="ticket-list-message">No tickets found</p>) : (
                        filteredTickets.map((ticket) => {
                            const unreadCount = ticket.messages.filter((m) => !m.is_read && m.sender_type === "admin").length;
                            const lastMessage = ticket.messages[ticket.messages.length - 1];
                            return (
                                <div key={ticket.id} onClick={() => handleTicketSelect(ticket.id)} className={`ticket-item ${selectedTicketId === ticket.id ? "selected" : ""}`}>
                                    <div className="ticket-item-header">
                                        <h3 className="ticket-subject">{ticket.subject}</h3>
                                        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                                    </div>
                                    <div className="ticket-item-meta">
                                        <span className={`ticket-status-badge ${getStatusColorClass(ticket.status)}`}>{ticket.status}</span>
                                        <span className="ticket-timestamp"><Calendar className="icon-meta" />{formatTime(ticket.created_at)}</span>
                                    </div>
                                    {lastMessage && <p className="ticket-last-message">{lastMessage.message}</p>}
                                    <div className="ticket-item-footer">
                                        <span className="ticket-timestamp"><User className="icon-meta" />{lastMessage?.sender_type === "admin" ? "Admin" : "You"}</span>
                                        <div className="ticket-timestamp">
                                            <Clock className="icon-meta" />
                                            {formatTime(lastMessage?.created_at)}
                                            {lastMessage?.sender_type === "user" && (lastMessage?.is_read ? <CheckCheck className="icon-meta read-receipt-icon read" /> : <Check className="icon-meta read-receipt-icon unread" />)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`chat-area ${!showMobileChat ? 'mobile-hidden' : ''}`}>
                {selectedTicket ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-header-info">
                                <button onClick={handleBackToList} className="back-button"><ArrowLeft /></button>
                                <div>
                                    <h3 className="chat-subject">{selectedTicket.subject}</h3>
                                    <div className="chat-meta">
                                        <span className={`ticket-status-badge ${getStatusColorClass(selectedTicket.status)}`}>{selectedTicket.status}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="message-list">
                            {selectedTicket.messages.map((msg) => (
                                <div key={msg.id} className={`message-row ${msg.sender_type === "user" ? "sent" : "received"}`}>
                                    <div className={`message-bubble ${msg.sender_type === "user" ? "sent" : "received"}`}>
                                        <p className="message-text">{msg.message}</p>
                                        <div className="message-footer">
                                            <span>{formatTime(msg.created_at)}</span>
                                            {msg.sender_type === "user" && (msg.is_read ? <CheckCheck className="icon-meta" /> : <Check className="icon-meta" />)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {selectedTicket.status === "closed" && (<div className="ticket-closed-banner">This ticket is closed. You cannot send new messages.</div>)}
                        
                        <div className="chat-input-area">
                            <div className="chat-input-wrapper">
                                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyPress} placeholder="Type your message..." rows={1} className="chat-textarea" disabled={selectedTicket.status === "closed"} />
                                <button onClick={handleSendMessage} disabled={!newMessage.trim() || selectedTicket.status === "closed"} className="send-button">
                                    <Send className="icon-meta" />
                                    <span className="send-button-text">Send</span>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="placeholder">
                        <MessageCircle className="placeholder-icon" />
                        <h3 className="placeholder-title">Select a ticket</h3>
                        <p className="placeholder-text">Choose a ticket from the list to start the conversation</p>
                    </div>
                )}
            </div>
            
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-icon-wrapper"><Plus className="modal-icon" /></div>
                            <div>
                                <h3 className="modal-title">Create New Ticket</h3>
                                <p className="modal-subtitle">Fill out the details below to raise a ticket</p>
                            </div>
                        </div>
                        <div className="modal-form-group">
                            <label className="modal-label">Subject</label>
                            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="modal-input" placeholder="Enter subject" />
                        </div>
                        <div className="modal-form-group">
                            <label className="modal-label">Message</label>
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="modal-textarea" placeholder="Enter your message" />
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => setShowCreateModal(false)} className="button-secondary">Cancel</button>
                            <button onClick={handleCreateTicket} className="button-primary" disabled={isCreating}>{isCreating ? "Creating..." : "Create Ticket"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}