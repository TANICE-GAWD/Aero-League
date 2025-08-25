import { useState, useRef, useEffect } from "react"
import {
  MessageCircle,
  Search,
  Clock,
  CheckCheck,
  Check,
  User,
  Calendar,
  Send,
  ArrowLeft,
  Plus
} from "lucide-react"
import { useGetTicketsQuery, useSendMessageMutation, useMarkMessageReadMutation, useCreateTicketMutation } from "../../app/api/ticketApiSlice" // Assuming this path is correct
import styles from './Ticket.module.css'

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

    const getStatusColorClass = (status) => {
        switch (status) {
            case "open":
                return styles.statusOpen;
            case "pending":
                return styles.statusPending;
            case "closed":
                return styles.statusClosed;
            default:
                return styles.statusClosed;
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
            return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        } else if (days === 1) {
            return "Yesterday";
        } else if (days < 7) {
            return `${days} days ago`;
        } else {
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
        <div className={styles.container}>
            {/* Sidebar */}
            <div className={`${styles.sidebar} ${showMobileChat ? styles.hidden : styles.wFull} ${styles.mdW1_3} ${styles.mdFlex}`}>
                {/* Header */}
                <div className={styles.sidebarHeader}>
                    <div className={styles.sidebarHeaderTop}>
                        <h2 className={styles.sidebarTitle}>
                            <MessageCircle className={`${styles.icon} ${styles.textPurple600}`} />
                            <span className={styles.smHidden}>Support Tickets</span>
                            <span className={styles.smVisible}>Tickets</span>
                        </h2>
                    </div>
                    {/* Search */}
                    <div className={styles.searchContainer}>
                        <Search className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                </div>

                {/* Ticket List */}
                <div className={styles.ticketList}>
                    {isLoading ? (
                        <p className={styles.loaderText}>Loading tickets...</p>
                    ) : filteredTickets.length === 0 ? (
                        <p className={styles.loaderText}>No tickets found</p>
                    ) : (
                        filteredTickets.map((ticket) => {
                            const unreadCount = ticket.messages.filter(
                                (m) => !m.is_read && m.sender_type === "admin"
                            ).length

                            return (
                                <div
                                    key={ticket.id}
                                    onClick={() => handleTicketSelect(ticket)}
                                    className={`${styles.ticketItem} ${selectedTicket?.id === ticket.id ? styles.ticketItemSelected : ""}`}
                                >
                                    <div className={styles.ticketItemHeader}>
                                        <h3 className={styles.ticketSubject}>{ticket.subject}</h3>
                                        <div className={styles.ticketHeaderIcons}>
                                            {unreadCount > 0 && (
                                                <span className={styles.unreadCount}>{unreadCount}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.ticketMeta}>
                                        <span className={`${styles.statusBadge} ${ticket.status === 'open' ? styles.statusOpen : styles.statusClosed}`}>
                                            {ticket.status}
                                        </span>
                                        <span className={styles.metaText}>
                                            <Calendar className={styles.metaIcon} />
                                            {formatTime(ticket.created_at)}
                                        </span>
                                    </div>
                                    {ticket.messages.length > 0 && (
                                        <p className={styles.ticketPreview}>
                                            {ticket.messages[ticket.messages.length - 1].message}
                                        </p>
                                    )}
                                    <div className={styles.ticketFooter}>
                                        <span className={styles.metaText}>
                                            <User className={styles.metaIcon} />
                                            {ticket.messages[ticket.messages.length - 1]?.sender_type === "admin" ? "Admin" : "You"}
                                        </span>
                                        <div className={styles.metaText}>
                                            <Clock className={styles.metaIcon} />
                                            {formatTime(ticket.messages[ticket.messages.length - 1]?.created_at)}
                                            {ticket.messages[ticket.messages.length - 1]?.sender_type === "user" && (
                                                ticket.messages[ticket.messages.length - 1]?.is_read ? (
                                                    <CheckCheck className={`${styles.metaIcon} ${styles.textPurple500}`} />
                                                ) : (
                                                    <Check className={`${styles.metaIcon} ${styles.textGray400}`} />
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
            <div className={`${styles.chatArea} ${showMobileChat ? styles.wFull : styles.hidden} ${styles.mdFlex}`}>
                {selectedTicket ? (
                    <>
                        {/* Header */}
                        <div className={styles.chatHeader}>
                            <div className={styles.chatHeaderContent}>
                                <div className={styles.chatHeaderInfo}>
                                    <button onClick={handleBackToList} className={styles.backButton}>
                                        <ArrowLeft className={styles.backIcon} />
                                    </button>
                                    <div>
                                        <h3 className={styles.chatSubject}>{selectedTicket.subject}</h3>
                                        <div className={styles.chatMeta}>
                                            <span className={`${styles.statusBadge} ${getStatusColorClass(selectedTicket.status)}`}>
                                                {selectedTicket.status}
                                            </span>
                                            <span className={styles.ticketId}>#{selectedTicket.id}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className={styles.messagesContainer}>
                            {selectedTicket.messages.map((msg) => (
                                <div key={msg.id} className={`${styles.messageRow} ${msg.sender_type === "user" ? styles.justifyEnd : styles.justifyStart}`}>
                                    <div className={`${styles.messageBubble} ${msg.sender_type === "user" ? styles.userMessage : styles.adminMessage}`}>
                                        <p className={styles.messageText}>{msg.message}</p>
                                        <div className={`${styles.messageTimeContainer} ${msg.sender_type === "user" ? styles.userMessageTime : styles.adminMessageTime}`}>
                                            <span>{formatTime(msg.created_at)}</span>
                                            {msg.sender_type === "user" && (
                                                msg.is_read ? (
                                                    <CheckCheck className={`${styles.metaIcon} ${styles.textPurple200}`} />
                                                ) : (
                                                    <Check className={`${styles.metaIcon} ${styles.textPurple300}`} />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className={styles.chatInputArea}>
                            <div className={styles.chatInputWrapper}>
                                <textarea
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type your message..."
                                    rows={1}
                                    className={styles.messageTextarea}
                                    disabled={selectedTicket.status === 'closed'}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim() || selectedTicket.status === 'closed'}
                                    className={styles.sendButton}
                                >
                                    <Send className={styles.sendIcon} />
                                    <span className={styles.smHidden}>Send</span>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.placeholder}>
                        <MessageCircle className={styles.placeholderIcon} />
                        <h3 className={styles.placeholderTitle}>Select a ticket</h3>
                        <p className={styles.placeholderText}>Choose a ticket from the list to start the conversation</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function UserTickets() {
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [selectedTicketId, setSelectedTicketId] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [newMessage, setNewMessage] = useState("")
    const [showMobileChat, setShowMobileChat] = useState(false)
    const [ticketsState, setTicketsState] = useState([])
    const messagesEndRef = useRef(null)
    const { data: tickets = [], isLoading, refetch } = useGetTicketsQuery([], {
          refetchOnFocus: true,
          refetchOnReconnect: true,
          pollingInterval: 10000  
      })
    const [sendMessage] = useSendMessageMutation()
    const [markMessageRead] = useMarkMessageReadMutation()
    const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation()


    useEffect(() => {
      setTicketsState(tickets)
    }, [tickets])
  
    const selectedTicket = ticketsState.find((t) => t.id === selectedTicketId) || null
  
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [selectedTicket?.messages])
  
    useEffect(() => {
      if (selectedTicket) {
        const unreadMessages = selectedTicket.messages.filter(
          (msg) => msg.sender_type === "admin" && !msg.is_read
        )
        if (unreadMessages.length > 0) {
          setTicketsState((prev) =>
            prev.map((ticket) =>
              ticket.id === selectedTicket.id
                ? {
                    ...ticket,
                    messages: ticket.messages.map((msg) =>
                      unreadMessages.some((u) => u.id === msg.id)
                        ? { ...msg, is_read: true }
                        : msg
                    ),
                  }
                : ticket
            )
          )
          unreadMessages.forEach((msg) => {
            markMessageRead({ message_id: msg.id }).catch((err) =>
              console.error("Failed to mark as read", err)
            )
          })
        }
      }
    }, [selectedTicket, markMessageRead])

    const handleCreateTicket = async () => {
          try {
              await createTicket({ subject, message }).unwrap()
              setSubject("")
              setMessage("")
              setShowCreateModal(false)
              refetch()
          } catch (err) {
              console.error("Failed to create ticket", err)
          }
      }

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedTicket) return
        const messageToSend = newMessage.trim()
        setNewMessage("")
        try {
            const savedMessage = await sendMessage({
            ticket_id: selectedTicket.id,
            message: messageToSend,
            }).unwrap()
            setTicketsState((prev) =>
            prev.map((ticket) =>
                ticket.id === selectedTicket.id
                ? {
                    ...ticket,
                    messages: [...ticket.messages, savedMessage.data],
                    }
                : ticket
            )
            )
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
  
    const getStatusColorClass = (status) => {
        switch (status) {
            case "open": return styles.statusOpen;
            case "pending": return styles.statusPending;
            case "closed": return styles.statusClosed;
            default: return styles.statusClosed;
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
            return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        } else if (days === 1) {
            return "Yesterday";
        } else if (days < 7) {
            return `${days} days ago`;
        } else {
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }
    }
  
    const filteredTickets = ticketsState
        .filter((ticket) => ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            const aUnread = a.messages.some((m) => !m.is_read && m.sender_type === "user")
            const bUnread = b.messages.some((m) => !m.is_read && m.sender_type === "user")
            if (aUnread && !bUnread) return -1
            if (!aUnread && bUnread) return 1
            const aLastMsg = a.messages[a.messages.length - 1]
            const bLastMsg = b.messages[b.messages.length - 1]
            const aTime = new Date(aLastMsg?.created_at || a.created_at).getTime()
            const bTime = new Date(bLastMsg?.created_at || b.created_at).getTime()
            return bTime - aTime
        })
  
    const handleTicketSelect = (ticketId) => {
      setSelectedTicketId(ticketId)
      setShowMobileChat(true)
    }
  
    const handleBackToList = () => {
      setShowMobileChat(false)
    }
  
    return (
      <div className={styles.container}>
        {/* Sidebar */}
        <div className={`${styles.sidebar} ${showMobileChat ? styles.hidden : styles.wFull} ${styles.mdW1_3} ${styles.mdFlex}`}>
            {/* Header */}
            <div className={styles.sidebarHeader}>
                <div className={styles.sidebarHeaderTop}>
                    <h2 className={styles.sidebarTitle}>
                        <MessageCircle className={`${styles.icon} ${styles.textPurple600}`} />
                        <span className={styles.smHidden}>Support Tickets</span>
                        <span className={styles.smVisible}>Tickets</span>
                    </h2>
                    <button className={styles.createTicketButton} onClick={() => setShowCreateModal(true)}>
                        <Plus className={styles.createTicketIcon} />
                    </button>
                </div>
                {/* Search */}
                <div className={styles.searchContainer}>
                    <Search className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </div>

            {/* Ticket List */}
            <div className={styles.ticketList}>
                {isLoading ? (
                    <p className={styles.loaderText}>Loading tickets...</p>
                ) : filteredTickets.length === 0 ? (
                    <p className={styles.loaderText}>No tickets found</p>
                ) : (
                    filteredTickets.map((ticket) => {
                        const unreadCount = ticket.messages.filter(
                            (m) => !m.is_read && m.sender_type === "admin"
                        ).length
                        return (
                            <div
                                key={ticket.id}
                                onClick={() => handleTicketSelect(ticket.id)}
                                className={`${styles.ticketItem} ${selectedTicketId === ticket.id ? styles.ticketItemSelected : ""}`}
                            >
                                <div className={styles.ticketItemHeader}>
                                    <h3 className={styles.ticketSubject}>{ticket.subject}</h3>
                                    {unreadCount > 0 && (
                                        <span className={styles.unreadCount}>{unreadCount}</span>
                                    )}
                                </div>
                                <div className={styles.ticketMeta}>
                                    <span className={`${styles.statusBadge} ${getStatusColorClass(ticket.status)}`}>
                                        {ticket.status}
                                    </span>
                                    <span className={styles.metaText}>
                                        <Calendar className={styles.metaIcon} />
                                        {formatTime(ticket.created_at)}
                                    </span>
                                </div>
                                {ticket.messages.length > 0 && (
                                    <p className={styles.ticketPreview}>
                                        {ticket.messages[ticket.messages.length - 1].message}
                                    </p>
                                )}
                                <div className={styles.ticketFooter}>
                                    <span className={styles.metaText}>
                                        <User className={styles.metaIcon} />
                                        {ticket.messages[ticket.messages.length - 1]?.sender_type === "admin" ? "Admin" : "You"}
                                    </span>
                                    <div className={styles.metaText}>
                                        <Clock className={styles.metaIcon} />
                                        {formatTime(ticket.messages[ticket.messages.length - 1]?.created_at)}
                                        {ticket.messages[ticket.messages.length - 1]?.sender_type === "user" &&
                                            (ticket.messages[ticket.messages.length - 1]?.is_read ? (
                                                <CheckCheck className={`${styles.metaIcon} ${styles.textPurple500}`} />
                                            ) : (
                                                <Check className={`${styles.metaIcon} ${styles.textGray400}`} />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
  
        {/* Chat Area */}
        <div className={`${styles.chatArea} ${showMobileChat ? styles.wFull : styles.hidden} ${styles.mdFlex}`}>
            {selectedTicket ? (
                <>
                    {/* Header */}
                    <div className={styles.chatHeader}>
                        <div className={styles.chatHeaderContent}>
                            <div className={styles.chatHeaderInfo}>
                                <button onClick={handleBackToList} className={styles.backButton}>
                                    <ArrowLeft className={styles.backIcon} />
                                </button>
                                <div>
                                    <h3 className={styles.chatSubject}>{selectedTicket.subject}</h3>
                                    <div className={styles.chatMeta}>
                                        <span className={`${styles.statusBadge} ${getStatusColorClass(selectedTicket.status)}`}>
                                            {selectedTicket.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
  
                    {/* Messages */}
                    <div className={styles.messagesContainer}>
                        {selectedTicket.messages.map((msg) => (
                            <div key={msg.id} className={`${styles.messageRow} ${msg.sender_type === "user" ? styles.justifyEnd : styles.justifyStart}`}>
                                <div className={`${styles.messageBubble} ${msg.sender_type === "user" ? styles.userMessage : styles.adminMessage}`}>
                                    <p className={styles.messageText}>{msg.message}</p>
                                    <div className={`${styles.messageTimeContainer} ${msg.sender_type === "user" ? styles.userMessageTime : styles.adminMessageTime}`}>
                                        <span>{formatTime(msg.created_at)}</span>
                                        {msg.sender_type === "user" && (
                                            msg.is_read ? (
                                                <CheckCheck className={`${styles.metaIcon} ${styles.textPurple200}`} />
                                            ) : (
                                                <Check className={`${styles.metaIcon} ${styles.textPurple300}`} />
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
  
                    {/* Input */}
                    {selectedTicket.status === "closed" && (
                        <div className={styles.closedTicketBanner}>
                            This ticket is closed. You cannot send new messages.
                        </div>
                    )}
                    <div className={styles.chatInputArea}>
                        <div className={styles.chatInputWrapper}>
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type your message..."
                                rows={1}
                                className={styles.messageTextarea}
                                disabled={selectedTicket.status === "closed"}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!newMessage.trim() || selectedTicket.status === "closed"}
                                className={styles.sendButton}
                            >
                                <Send className={styles.sendIcon} />
                                <span className={styles.smHidden}>Send</span>
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles.placeholder}>
                    <MessageCircle className={styles.placeholderIcon} />
                    <h3 className={styles.placeholderTitle}>Select a ticket</h3>
                    <p className={styles.placeholderText}>Choose a ticket from the list to start the conversation</p>
                </div>
            )}
        </div>
        {showCreateModal && (
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                        <div className={styles.modalIconWrapper}>
                            <Plus className={styles.modalIcon} />
                        </div>
                        <div>
                            <h3 className={styles.modalTitle}>Create New Ticket</h3>
                            <p className={styles.modalSubtitle}>Fill out the details below to raise a ticket</p>
                        </div>
                    </div>
                    <div className={styles.modalBody}>
                        <label className={styles.modalLabel}>Subject</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className={styles.modalInput}
                            placeholder="Enter subject"
                        />
                    </div>
                    <div className={styles.modalBody}>
                        <label className={styles.modalLabel}>Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className={styles.modalTextarea}
                            placeholder="Enter your message"
                        />
                    </div>
                    <div className={styles.modalFooter}>
                        <button onClick={() => setShowCreateModal(false)} className={styles.modalCancelButton}>
                            Cancel
                        </button>
                        <button onClick={handleCreateTicket} className={styles.modalCreateButton} disabled={isCreating}>
                            {isCreating ? "Creating..." : "Create Ticket"}
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    )
  }