import { Users, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useGetTeamsQuery, useGetAdminNotificationsQuery } from "../../app/api/userApiSlice";
import './Dashboard.css'; 


const Card = ({ className, children }) => <div className={`card ${className}`}>{children}</div>;
const CardHeader = ({ className, children }) => <div className={`card-header ${className}`}>{children}</div>;
const CardTitle = ({ className, children }) => <h3 className={`card-title ${className}`}>{children}</h3>;
const CardContent = ({ className, children }) => <div className={`card-content ${className}`}>{children}</div>;
const CardFooter = ({ className, children }) => <div className={`card-footer ${className}`}>{children}</div>;
const Button = ({ children }) => <button className="button-outline">{children}</button>;


export default function AdminDashboard() {
    const { data: teamsData = [], isLoading: teamsLoading } = useGetTeamsQuery();
    const { data: notificationsData = [], isLoading: notificationsLoading } = useGetAdminNotificationsQuery();

    const teamsCount = teamsData?.length || 0;
    const notificationsCount = notificationsData?.length || 0;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Admin Dashboard</h1>

            <div className="dashboard-grid">
                {/* Teams Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Users className="card-icon icon-blue" />
                            Teams ({teamsCount})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {teamsLoading ? (
                            <p className="loading-text">Loading teams...</p>
                        ) : teamsCount === 0 ? (
                            <p className="empty-text">No teams available.</p>
                        ) : (
                            <ul className="item-list">
                                {teamsData.slice(0, 5).map((team) => (
                                    <li key={team.id} className="list-item">{team.team_name}</li>
                                ))}
                            </ul>
                        )}
                        {teamsCount > 5 && (
                            <p className="more-items-text">+{teamsCount - 5} more</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <NavLink to="/admin/teams">
                            <Button>Go to Teams</Button>
                        </NavLink>
                    </CardFooter>
                </Card>

                {/* Notifications Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <Bell className="card-icon icon-yellow" />
                            Notifications ({notificationsCount})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {notificationsLoading ? (
                            <p className="loading-text">Loading notifications...</p>
                        ) : notificationsCount === 0 ? (
                            <p className="empty-text">No notifications available.</p>
                        ) : (
                            <ul className="item-list">
                                {notificationsData.slice(0, 5).map((notif) => (
                                    <li key={notif.id} className="list-item">{notif.title}</li>
                                ))}
                            </ul>
                        )}
                        {notificationsCount > 5 && (
                            <p className="more-items-text">+{notificationsCount - 5} more</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <NavLink to="/admin/notifications">
                            <Button>Go to Notifications</Button>
                        </NavLink>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}