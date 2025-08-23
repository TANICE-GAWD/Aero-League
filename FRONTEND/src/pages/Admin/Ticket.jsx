import { useState, useRef, useEffect } from "react";
import { MessageCircle, Search, Clock, CheckCheck, Check, User, Calendar, Send, ArrowLeft, Lock } from "lucide-react";
import { useGetTicketsQuery, useSendMessageMutation, useMarkMessageReadMutation, useCloseTicketMutation } from "../../app/api/ticketApiSlice";
import './Ticket.css'; 

export default function AdminTickets() {
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [ticketsState, setTicketsState] = useState([]);
    const [showCloseTicketModal, setShowCloseTicketModal] = useState(false);
    const messagesEndRef = useRef(null);
    
    const { data: tickets = [], isLoading } = useGetTicketsQuery([], {
        refetchOnFocus: true, refetchOnReconnect: true, pollingInterval: 10000,
    });
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [markMessageRead] = useMarkMessageReadMutation();
    const [closeTicket, { isLoading: isClosing }] = useCloseTicketMutation();

    useEffect(() => { setTicketsState(tickets); }, [tickets]);

    const selectedTicket = ticketsState.find((t) => t.id === selectedTicketId) || null;

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [selectedTicket?.messages]);

    useEffect(() => {
        if (selectedTicket) {
            const unreadMessages = selectedTicket.messages.filter((msg) => msg.sender_type === "user" && !msg.is_read);
            if (unreadMessages.length > 0) {
                unreadMessages.forEach((msg) => { markMessageRead({ message_id: msg.id }).catch((err) => console.error("Failed to mark as read", err)); });
            }
        }
    }, [selectedTicket, markMessageRead]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedTicket) return;
        const messageToSend = newMessage.trim();
        setNewMessage("");
        try {
            const savedMessage = await sendMessage({ ticket_id: selectedTicket.id, message: messageToSend }).unwrap();
            setTicketsState((prev) => prev.map((ticket) => ticket.id === selectedTicket.id ? { ...ticket, messages: [...ticket.messages, savedMessage.data] } : ticket));
        } catch (err) { console.error("Failed to send message", err); }
    };
    
    const confirmClose = async () => {
        if (!selectedTicketId) return;
        try {
            await closeTicket(selectedTicketId).unwrap();
            setTicketsState((prev) => prev.map((ticket) => ticket.id === selectedTicketId ? { ...ticket, status: "closed" } : ticket));
            setShowCloseTicketModal(false);
        } catch (err) { console.error("Failed to close ticket", err); }
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
            const aUnread = a.messages.some((m) => !m.is_read && m.sender_type === "user");
            const bUnread = b.messages.some((m) => !m.is_read && m.sender_type === "user");
            if (aUnread && !bUnread) return -1;
            if (!aUnread && bUnread) return 1;
            const aLastMsg = a.messages[a.messages.length - 1];
            const bLastMsg = b.messages[b.messages.length - 1];
            const aTime = new Date(aLastMsg?.created_at || a.created_at).getTime();
            const bTime = new Date(bLastMsg?.created_at || b.created_at).getTime();
            return bTime - aTime;
        });

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
                    </div>
                    <div className="search-container">
                        <Search className="search-icon" />
                        <input type="text" placeholder="Search tickets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="search-input" />
                    </div>
                </div>
                <div className="ticket-list">
                    {isLoading ? (<p className="ticket-list-message">Loading tickets...</p>) : filteredTickets.length === 0 ? (<p className="ticket-list-message">No tickets found</p>) : (
                        filteredTickets.map((ticket) => {
                            const unreadCount = ticket.messages.filter((m) => !m.is_read && m.sender_type === "user").length;
                            const lastMessage = ticket.messages[ticket.messages.length - 1];
                            return (
                                <div key={ticket.id} onClick={() => { setSelectedTicketId(ticket.id); setShowMobileChat(true); }} className={`ticket-item ${selectedTicketId === ticket.id ? "selected" : ""}`}>
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
                                        <span className="ticket-timestamp"><User className="icon-meta" />{lastMessage?.sender_type === "admin" ? "You" : "User"}</span>
                                        <div className="ticket-timestamp">
                                            <Clock className="icon-meta" />
                                            {formatTime(lastMessage?.created_at)}
                                            {lastMessage?.sender_type === "admin" && (lastMessage?.is_read ? <CheckCheck className="icon-meta read-receipt-icon read" /> : <Check className="icon-meta read-receipt-icon unread" />)}
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
                                <button onClick={() => setShowMobileChat(false)} className="back-button"><ArrowLeft /></button>
                                <div>
                                    <h3 className="chat-subject">{selectedTicket.subject}</h3>
                                    <div className="chat-meta"><span className={`ticket-status-badge ${getStatusColorClass(selectedTicket.status)}`}>{selectedTicket.status}</span></div>
                                </div>
                            </div>
                            {selectedTicket.status === "open" && (
                                <button className="button button-danger" onClick={() => { setShowCloseTicketModal(true) }}>Close Ticket</button>
                            )}
                        </div>
                        <div className="message-list">
                            {selectedTicket.messages.map((msg) => (
                                <div key={msg.id} className={`message-row ${msg.sender_type === "admin" ? "sent" : "received"}`}>
                                    <div className={`message-bubble ${msg.sender_type === "admin" ? "sent" : "received"}`}>
                                        <p className="message-text">{msg.message}</p>
                                        <div className="message-footer">
                                            <span>{formatTime(msg.created_at)}</span>
                                            {msg.sender_type === "admin" && (msg.is_read ? <CheckCheck className="icon-meta" /> : <Check className="icon-meta" />)}
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
                                <button onClick={handleSendMessage} disabled={!newMessage.trim() || selectedTicket.status === "closed" || isSending} className="send-button"><Send className="icon-meta" /><span className="send-button-text">Send</span></button>
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
            
            {/* Close Ticket Modal */}
            {showCloseTicketModal && selectedTicket && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="modal-icon-wrapper warning"><Lock className="modal-icon icon-warning" /></div>
                            <div>
                                <h3 className="modal-title">Close this ticket?</h3>
                                <p className="modal-subtitle">You won’t be able to send any messages after closing.</p>
                            </div>
                        </div>
                        <p className="modal-body-text">Are you sure you want to close the ticket titled <strong>{selectedTicket.subject}</strong>?</p>
                        <div className="modal-footer">
                            <button onClick={() => setShowCloseTicketModal(false)} className="button button-secondary">Cancel</button>
                            <button onClick={confirmClose} className="button button-warning" disabled={isClosing}>{isClosing ? "Closing..." : "Close Ticket"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}