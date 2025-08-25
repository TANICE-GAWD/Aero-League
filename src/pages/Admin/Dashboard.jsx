import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Bell } from "lucide-react";
import { NavLink } from "react-router-dom";
import styles from './Dashboard.module.css';

import { useGetTeamsQuery, useGetAdminNotificationsQuery } from "../../app/api/userApiSlice";

export default function AdminDashboard() {
  const { data: teamsData = [], isLoading: teamsLoading } = useGetTeamsQuery();
  const { data: notificationsData = [], isLoading: notificationsLoading } = useGetAdminNotificationsQuery();

  const teamsCount = teamsData?.length || 0;
  const notificationsCount = notificationsData?.length || 0;

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Admin Dashboard</h1>

      <div className={styles.gridContainer}>
        {/* Teams Card */}
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <Users className={`${styles.icon} ${styles.iconBlue}`} />
              Teams ({teamsCount})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamsLoading ? (
              <p>Loading teams...</p>
            ) : teamsCount === 0 ? (
              <p className={styles.noItemsText}>No teams available.</p>
            ) : (
              <ul className={styles.list}>
                {teamsData.slice(0, 5).map((team) => (
                  <li key={team.id} className={styles.listItem}>{team.team_name}</li>
                ))}
              </ul>
            )}
            {teamsCount > 5 && (
              <p className={styles.moreItemsText}>+{teamsCount - 5} more</p>
            )}
          </CardContent>
          <CardFooter>
            <NavLink to="/admin/teams">
              <Button variant="outline">Go to Teams</Button>
            </NavLink>
          </CardFooter>
        </Card>

        {/* Notifications Card */}
        <Card className={styles.card}>
          <CardHeader className={styles.cardHeader}>
            <CardTitle className={styles.cardTitle}>
              <Bell className={`${styles.icon} ${styles.iconYellow}`} />
              Notifications ({notificationsCount})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notificationsLoading ? (
              <p>Loading notifications...</p>
            ) : notificationsCount === 0 ? (
              <p className={styles.noItemsText}>No notifications available.</p>
            ) : (
              <ul className={styles.list}>
                {notificationsData.slice(0, 5).map((notif) => (
                  <li key={notif.id} className={styles.listItem}>{notif.title}</li>
                ))}
              </ul>
            )}
            {notificationsCount > 5 && (
              <p className={styles.moreItemsText}>+{notificationsCount - 5} more</p>
            )}
          </CardContent>
          <CardFooter>
            <NavLink to="/admin/notifications">
              <Button variant="outline">Go to Notifications</Button>
            </NavLink>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}