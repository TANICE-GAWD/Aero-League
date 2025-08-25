import { useState, useMemo, useEffect } from "react"
import {
  Bell,
  Search,
  ChevronUp,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  Plus,
} from "lucide-react"
import {
  useGetAdminNotificationsQuery,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,
  useCreateNotificationMutation,
} from "../../app/api/userApiSlice"
import styles from "./Notifications.module.css"

export default function Notifications() {
  const { data: notificationsData = [], isLoading, isFetching } = useGetAdminNotificationsQuery([], {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })
  const [updateNotification] = useUpdateNotificationMutation()
  const [deleteNotification] = useDeleteNotificationMutation()
  const [createNotification] = useCreateNotificationMutation()

  const [notifications, setNotifications] = useState(notificationsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("created_at")
  const [sortDirection, setSortDirection] = useState("desc")

  const [selectedNotification, setSelectedNotification] = useState(null)
  const [editingNotification, setEditingNotification] = useState(null)
  const [creatingNotification, setCreatingNotification] = useState(false)

  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [formData, setFormData] = useState({ title: "", message: "", user: "all" })

  // Sync state with API data
  useEffect(() => {
    setNotifications(notificationsData)
  }, [notificationsData])

  const filteredAndSortedNotifications = useMemo(() => {
    const filtered = notifications.filter(
      (n) =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.user.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [notifications, searchTerm, sortField, sortDirection])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleCreate = async () => {
    const newNotification = {
      id: Date.now(),
      ...formData,
      created_at: new Date().toISOString(),
    }
    setNotifications([newNotification, ...notifications])
    await createNotification(formData)
    setCreatingNotification(false)
    setFormData({ title: "", message: "", user: "all" })
  }

  const handleUpdate = async () => {
    const updated = { ...editingNotification, ...formData }
    setNotifications(notifications.map((n) => (n.id === updated.id ? updated : n)))
    await updateNotification({ id: editingNotification.id, notification: formData })
    setShowEditModal(false)
    setEditingNotification(null)
    setFormData({ title: "", message: "", user: "all" })
  }

  const handleDelete = async () => {
    if (selectedNotification) {
      setNotifications(notifications.filter((n) => n.id !== selectedNotification.id))
      await deleteNotification(selectedNotification.id)
      setShowDeleteModal(false)
      setSelectedNotification(null)
    }
  }

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className={styles.sortButton}
    >
      <span>{children}</span>
      {sortField === field && (sortDirection === "asc" ? <ChevronUp className={styles.sortIcon} /> : <ChevronDown className={styles.sortIcon} />)}
    </button>
  )

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.headerTitle}>Notifications Management</h2>
          <p className={styles.headerSubtitle}>View, create, and manage notifications</p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.totalBadge}>
            {notifications.length} Total Notifications
          </span>
          <button
            onClick={() => setCreatingNotification(true)}
            className={styles.newButton}
          >
            <Plus className={styles.newButtonIcon} /> New
          </button>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search notifications by title, message, or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      {isLoading || isFetching ? (
        <div className={styles.loadingText}>Loading...</div>
      ) : (
        <div className={styles.tableContainer}>
          <div className={styles.tableScrollWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeaderCell}>
                    <SortButton field="title">Title</SortButton>
                  </th>
                  <th className={styles.tableHeaderCell}>
                    <SortButton field="message">Message</SortButton>
                  </th>
                  <th className={styles.tableHeaderCell}>
                    <SortButton field="user">Recipient</SortButton>
                  </th>
                  <th className={styles.tableHeaderCell}>
                    <SortButton field="created_at">Date</SortButton>
                  </th>
                  <th className={styles.tableHeaderCell}>Actions</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {filteredAndSortedNotifications.map((n) => (
                  <tr key={n.id} className={styles.tableRow}>
                    <td className={`${styles.tableCell} ${styles.tableCellTitle}`}>{n.title}</td>
                    <td className={`${styles.tableCell} ${styles.tableCellMessage}`}>{n.message}</td>
                    <td className={`${styles.tableCell} ${styles.tableCellUser}`}>
                      {n.user === "all" ? "Everyone" : n.user}
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellDate}`}>
                      {new Date(n.created_at).toLocaleString()}
                    </td>
                    <td className={`${styles.tableCell} ${styles.tableCellActions}`}>
                      <div className={styles.actionsGroup}>
                        <button
                          onClick={() => {
                            setSelectedNotification(n)
                            setShowViewModal(true)
                          }}
                          className={`${styles.actionButton} ${styles.viewButton}`}
                        >
                          <Eye className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingNotification(n)
                            setFormData({ title: n.title, message: n.message, user: n.user })
                            setShowEditModal(true)
                          }}
                          className={`${styles.actionButton} ${styles.editButton}`}
                        >
                          <Edit className={styles.actionIcon} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedNotification(n)
                            setShowDeleteModal(true)
                          }}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                        >
                          <Trash2 className={styles.actionIcon} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(creatingNotification || showEditModal) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {creatingNotification ? "Create Notification" : "Edit Notification"}
              </h3>
              <button
                onClick={() => {
                  setCreatingNotification(false)
                  setShowEditModal(false)
                  setFormData({ title: "", message: "", user: "all" })
                }}
                className={styles.modalCloseButton}
              >
                <X className={styles.modalCloseIcon} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div>
                <label className={styles.formLabel}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={styles.formInput}
                />
              </div>
              <div>
                <label className={styles.formLabel}>Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={styles.formTextarea}
                />
              </div>
              <div>
                <label className={styles.formLabel}>Recipient</label>
                <input
                  type="text"
                  placeholder="all or email@example.com"
                  value={formData.user}
                  onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                onClick={() => {
                  setCreatingNotification(false)
                  setShowEditModal(false)
                  setFormData({ title: "", message: "", user: "all" })
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={creatingNotification ? handleCreate : handleUpdate}
                className={styles.saveButton}
              >
                <Save className={styles.saveButtonIcon} />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedNotification && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Notification Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className={styles.modalCloseButton}
              >
                <X className={styles.modalCloseIcon} />
              </button>
            </div>
            <div className={styles.viewModalBody}>
              <div>
                <p className={styles.viewLabel}>Title</p>
                <p className={styles.viewValueTitle}>{selectedNotification.title}</p>
              </div>
              <div>
                <p className={styles.viewLabel}>Message</p>
                <p className={styles.viewValue}>{selectedNotification.message}</p>
              </div>
              <div>
                <p className={styles.viewLabel}>Recipient</p>
                <p className={styles.viewValue}>{selectedNotification.user === "all" ? "Everyone" : selectedNotification.user}</p>
              </div>
              <div>
                <p className={styles.viewLabel}>Date</p>
                <p className={styles.viewValue}>{new Date(selectedNotification.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedNotification && (
        <div className={styles.modalOverlay}>
          <div className={styles.deleteModalContent}>
            <div className={styles.deleteModalHeader}>
              <div className={styles.deleteIconWrapper}>
                <Trash2 className={styles.deleteIconHeader} />
              </div>
              <div>
                <h3 className={styles.modalTitle}>Delete Notification</h3>
                <p className={styles.headerSubtitle}>This action cannot be undone</p>
              </div>
            </div>
            <p className={styles.deleteConfirmationText}>
              Are you sure you want to delete the notification titled <strong>{selectedNotification.title}</strong>?
            </p>
            <div className={styles.modalFooter}>
              <button
                onClick={() => setShowDeleteModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={styles.deleteConfirmButton}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}