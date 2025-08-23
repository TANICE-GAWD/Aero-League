import { useState, useMemo, useEffect } from "react";
import { Bell, Search, ChevronUp, ChevronDown, Eye, Edit, Trash2, X, Save, Plus } from "lucide-react";
import {
    useGetAdminNotificationsQuery,
    useUpdateNotificationMutation,
    useDeleteNotificationMutation,
    useCreateNotificationMutation,
} from "../../app/api/userApiSlice";
import './Notifications.css'; 

export default function Notifications() {
    const { data: notificationsData = [], isLoading, isFetching } = useGetAdminNotificationsQuery([], {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
    });
    const [updateNotification] = useUpdateNotificationMutation();
    const [deleteNotification] = useDeleteNotificationMutation();
    const [createNotification] = useCreateNotificationMutation();

    const [notifications, setNotifications] = useState(notificationsData);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("created_at");
    const [sortDirection, setSortDirection] = useState("desc");

    const [selectedNotification, setSelectedNotification] = useState(null);
    const [editingNotification, setEditingNotification] = useState(null);
    const [creatingNotification, setCreatingNotification] = useState(false);

    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [formData, setFormData] = useState({ title: "", message: "", user: "all" });

    useEffect(() => { setNotifications(notificationsData); }, [notificationsData]);

    const filteredAndSortedNotifications = useMemo(() => {
        const filtered = notifications.filter(
            (n) =>
                n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                n.user.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filtered.sort((a, b) => {
            let aValue = a[sortField]; let bValue = b[sortField];
            if (typeof aValue === "string") { aValue = aValue.toLowerCase(); bValue = bValue.toLowerCase(); }
            if (sortDirection === "asc") return aValue > bValue ? 1 : -1;
            else return aValue < bValue ? 1 : -1;
        });
    }, [notifications, searchTerm, sortField, sortDirection]);

    const handleSort = (field) => {
        if (sortField === field) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        else { setSortField(field); setSortDirection("asc"); }
    };

    const handleCreate = async () => {
        setNotifications([{ id: Date.now(), ...formData, created_at: new Date().toISOString() }, ...notifications]);
        await createNotification(formData);
        setCreatingNotification(false);
        setFormData({ title: "", message: "", user: "all" });
    };

    const handleUpdate = async () => {
        const updated = { ...editingNotification, ...formData };
        setNotifications(notifications.map((n) => (n.id === updated.id ? updated : n)));
        await updateNotification({ id: editingNotification.id, notification: formData });
        setShowEditModal(false);
        setEditingNotification(null);
        setFormData({ title: "", message: "", user: "all" });
    };

    const handleDelete = async () => {
        if (selectedNotification) {
            setNotifications(notifications.filter((n) => n.id !== selectedNotification.id));
            await deleteNotification(selectedNotification.id);
            setShowDeleteModal(false);
            setSelectedNotification(null);
        }
    };

    const SortButton = ({ field, children }) => (
        <button onClick={() => handleSort(field)} className="sort-button">
            <span>{children}</span>
            {sortField === field && (sortDirection === "asc" ? <ChevronUp className="icon-small" /> : <ChevronDown className="icon-small" />)}
        </button>
    );
    
    const closeModal = () => {
        setCreatingNotification(false);
        setShowEditModal(false);
        setShowViewModal(false);
        setShowDeleteModal(false);
        setFormData({ title: "", message: "", user: "all" });
    }

    return (
        <div className="notifications-page-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">Notifications Management</h2>
                    <p className="page-subtitle">View, create, and manage notifications</p>
                </div>
                <div className="header-actions">
                    <span className="total-badge">{notifications.length} Total Notifications</span>
                    <button onClick={() => setCreatingNotification(true)} className="button button-primary">
                        <Plus className="icon-small" /> New
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="search-bar">
                <div className="input-wrapper">
                    <Search className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search notifications by title, message, or user..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {/* Notifications Table */}
            {isLoading || isFetching ? (
                <div className="loading-text">Loading...</div>
            ) : (
                <div className="table-container">
                    <div className="table-wrapper">
                        <table className="notifications-table">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-heading"><SortButton field="title">Title</SortButton></th>
                                    <th className="table-heading"><SortButton field="message">Message</SortButton></th>
                                    <th className="table-heading"><SortButton field="user">Recipient</SortButton></th>
                                    <th className="table-heading"><SortButton field="created_at">Date</SortButton></th>
                                    <th className="table-heading">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {filteredAndSortedNotifications.map((n) => (
                                    <tr key={n.id} className="table-row">
                                        <td className="table-cell font-medium">{n.title}</td>
                                        <td className="table-cell">{n.message}</td>
                                        <td className="table-cell">{n.user === "all" ? "Everyone" : n.user}</td>
                                        <td className="table-cell">{new Date(n.created_at).toLocaleString()}</td>
                                        <td className="table-cell">
                                            <div className="action-buttons-group">
                                                <button onClick={() => { setSelectedNotification(n); setShowViewModal(true); }} className="action-button view"><Eye className="icon-small" /></button>
                                                <button onClick={() => { setEditingNotification(n); setFormData({ title: n.title, message: n.message, user: n.user }); setShowEditModal(true); }} className="action-button edit"><Edit className="icon-small" /></button>
                                                <button onClick={() => { setSelectedNotification(n); setShowDeleteModal(true); }} className="action-button delete"><Trash2 className="icon-small" /></button>
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
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">{creatingNotification ? "Create Notification" : "Edit Notification"}</h3>
                            <button onClick={closeModal} className="modal-close-button"><X className="icon-medium" /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="form-textarea" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Recipient</label>
                                <input type="text" placeholder="all or email@example.com" value={formData.user} onChange={(e) => setFormData({ ...formData, user: e.target.value })} className="form-input" />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={closeModal} className="button button-secondary">Cancel</button>
                            <button onClick={creatingNotification ? handleCreate : handleUpdate} className="button button-primary">
                                <Save className="icon-small" /> Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && selectedNotification && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Notification Details</h3>
                            <button onClick={closeModal} className="modal-close-button"><X className="icon-medium" /></button>
                        </div>
                        <div className="modal-body view-details">
                            <div><p className="detail-label">Title</p><p className="detail-value font-medium">{selectedNotification.title}</p></div>
                            <div><p className="detail-label">Message</p><p className="detail-value">{selectedNotification.message}</p></div>
                            <div><p className="detail-label">Recipient</p><p className="detail-value">{selectedNotification.user === "all" ? "Everyone" : selectedNotification.user}</p></div>
                            <div><p className="detail-label">Date</p><p className="detail-value">{new Date(selectedNotification.created_at).toLocaleString()}</p></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedNotification && (
                <div className="modal-overlay">
                    <div className="modal-content delete-modal">
                        <div className="modal-header delete">
                            <div className="modal-icon-wrapper delete"><Trash2 className="icon-large icon-delete" /></div>
                            <div>
                                <h3 className="modal-title">Delete Notification</h3>
                                <p className="modal-subtitle">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="modal-body-text">Are you sure you want to delete the notification titled <strong>{selectedNotification.title}</strong>?</p>
                        <div className="modal-footer">
                            <button onClick={closeModal} className="button button-secondary">Cancel</button>
                            <button onClick={handleDelete} className="button button-danger">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}