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
  Lock,
} from "lucide-react"
import { useGetTicketsQuery, useSendMessageMutation, useMarkMessageReadMutation, useCloseTicketMutation } from "../../app/api/ticketApiSlice"
import styles from "./Ticket.module.css"

export default function AdminTickets() {
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [showMobileChat, setShowMobileChat] = useState(false)
  const [ticketsState, setTicketsState] = useState([])
  const [showCloseTicketModal, setShowCloseTicketModal] = useState(false)
  const messagesEndRef = useRef(null)
  const [closeTicket, { isLoading: isClosing }] = useCloseTicketMutation()

  const { data: tickets = [], isLoading } = useGetTicketsQuery([], {
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 10000,
  })
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation()
  const [markMessageRead] = useMarkMessageReadMutation()

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
        (msg) => msg.sender_type === "user" && !msg.is_read
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

  const confirmClose = async () => {
    if (!selectedTicketId) return

    try {
      await closeTicket(selectedTicketId).unwrap()
      setTicketsState((prev) =>
        prev.map((ticket) =>
          ticket.id === selectedTicketId
            ? { ...ticket, status: "closed" }
            : ticket
        )
      )
      setShowCloseTicketModal(false)
    } catch (err) {
      console.error("Failed to close ticket", err)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "open":
        return styles.statusOpen
      case "pending":
        return styles.statusPending
      case "closed":
        return styles.statusClosed
      default:
        return styles.statusClosed
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
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    } else if (days === 1) {
      return "Yesterday"
    } else if (days < 7) {
      return `${days} days ago`
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  const filteredTickets = ticketsState
    .filter((ticket) =>
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
    )
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
      <div className={`${styles.sidebar} ${showMobileChat ? styles.sidebarHidden : styles.sidebarVisible}`}>
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.headerTitleContainer}>
            <h2 className={styles.headerTitle}>
              <MessageCircle className={styles.icon} />
              <span className={styles.titleTextDesktop}>Support Tickets</span>
              <span className={styles.titleTextMobile}>Tickets</span>
            </h2>
          </div>
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
            <p className={styles.infoText}>Loading tickets...</p>
          ) : filteredTickets.length === 0 ? (
            <p className={styles.infoText}>No tickets found</p>
          ) : (
            filteredTickets.map((ticket) => {
              const unreadCount = ticket.messages.filter((m) => !m.is_read && m.sender_type === "user").length
              return (
                <div
                  key={ticket.id}
                  onClick={() => handleTicketSelect(ticket.id)}
                  className={`${styles.ticketItem} ${selectedTicketId === ticket.id ? styles.ticketItemSelected : ""}`}
                >
                  <div className={styles.ticketHeader}>
                    <h3 className={styles.ticketSubject}>{ticket.subject}</h3>
                    {unreadCount > 0 && (<span className={styles.unreadBadge}>{unreadCount}</span>)}
                  </div>
                  <div className={styles.ticketMeta}>
                    <span className={`${styles.statusBadge} ${getStatusClass(ticket.status)}`}>{ticket.status}</span>
                    <span className={styles.ticketDate}><Calendar className={styles.icon} />{formatTime(ticket.created_at)}</span>
                  </div>
                  {ticket.messages.length > 0 && (<p className={styles.lastMessage}>{ticket.messages[ticket.messages.length - 1].message}</p>)}
                  <div className={styles.ticketFooter}>
                    <span className={styles.footerItem}><User className={styles.icon} />{ticket.messages[ticket.messages.length - 1]?.sender_type === "admin" ? "You" : "User"}</span>
                    <div className={styles.footerItem}>
                      <Clock className={styles.icon} />{formatTime(ticket.messages[ticket.messages.length - 1]?.created_at)}
                      {ticket.messages[ticket.messages.length - 1]?.sender_type === "admin" &&
                        (ticket.messages[ticket.messages.length - 1]?.is_read ? (
                          <CheckCheck className={`${styles.icon} ${styles.checkIconRead}`} />
                        ) : (<Check className={`${styles.icon} ${styles.checkIconUnread}`} />)
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
      <div className={`${styles.chatArea} ${showMobileChat ? styles.chatAreaVisible : styles.chatAreaHidden}`}>
        {selectedTicket ? (
          <>
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderContent}>
                <div className={styles.chatHeaderInfo}>
                  <button onClick={handleBackToList} className={styles.backButton}><ArrowLeft className={styles.icon} /></button>
                  <div>
                    <h3 className={styles.chatSubject}>{selectedTicket.subject}</h3>
                    <div className={styles.chatHeaderStatus}>
                      <span className={`${styles.statusBadge} ${getStatusClass(selectedTicket.status)}`}>{selectedTicket.status}</span>
                    </div>
                  </div>
                </div>
                {selectedTicket.status === "open" && (
                  <div><button className={styles.closeButton} onClick={() => {setShowCloseTicketModal(true)}}>Close</button></div>
                )}
              </div>
            </div>

            <div className={styles.messageList}>
              {selectedTicket.messages.map((msg) => (
                <div key={msg.id} className={`${styles.messageRow} ${msg.sender_type === "admin" ? styles.messageRowAdmin : styles.messageRowUser}`}>
                  <div className={`${styles.messageBubble} ${msg.sender_type === "admin" ? styles.adminBubble : styles.userBubble}`}>
                    <p className={styles.messageText}>{msg.message}</p>
                    <div className={styles.messageMeta}>
                      <span>{formatTime(msg.created_at)}</span>
                      {msg.sender_type === "admin" && (msg.is_read ? (<CheckCheck className={`${styles.icon} ${styles.iconRead}`} />) : (<Check className={`${styles.icon} ${styles.iconUnread}`} />))}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {selectedTicket.status === "closed" && (<div className={styles.closedTicketBanner}>This ticket is closed. You cannot send new messages.</div>)}
            <div className={styles.inputArea}>
              <div className={styles.inputForm}>
                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyPress} placeholder="Type your message..." rows={1} className={styles.messageTextarea} disabled={selectedTicket.status === "closed"} />
                <button onClick={handleSendMessage} disabled={!newMessage.trim() || selectedTicket.status === "closed" || isSending} className={styles.sendButton}>
                  <Send className={styles.icon} /> <span className={styles.sendButtonText}>Send</span>
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
      {showCloseTicketModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalPanel}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <div className={styles.modalIconContainer}><Lock className={styles.modalIcon} /></div>
                <div>
                  <h3 className={styles.modalTitle}>Close the ticket?</h3>
                  <p className={styles.modalSubtitle}>You won’t be able to send any messages after closing.</p>
                </div>
              </div>
              <p className={styles.modalText}>Are you sure you want to close this ticket? <br /> <strong>{selectedTicket.title}</strong></p>
              <div className={styles.modalFooter}>
                <button onClick={() => setShowCloseTicketModal(false)} className={`${styles.modalButton} ${styles.cancelButton}`}>Cancel</button>
                <button onClick={confirmClose} className={`${styles.modalButton} ${styles.confirmButton}`} disabled={isClosing}>{isClosing ? "Closing..." : "Close Ticket"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}