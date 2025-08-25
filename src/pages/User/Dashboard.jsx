import {
  Video,
  Eye,
  CheckCircle,
  ExternalLink,
  Bell,
  User,
  Mail,
  Phone,
  School,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from '../../features/authSlice';
import { useGetNotificationsQuery } from '../../app/api/userApiSlice';
import styles from './Dashboard.module.css';

export default function UserDashboard() {

  const userData = useSelector(selectUser);
  const recentSubmission = userData.video_link;
  const { data: notifications, isLoading, isFetching } = useGetNotificationsQuery(null, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  return (
    <div className={styles.container}>
      <div className={styles.welcomeBanner}>
        <h1 className={styles.welcomeHeader}>Welcome back, {userData.name.split(" ")[0]}!</h1>
        <p className={styles.welcomeSubtext}>Track your progress in the Thapar Drone Challenge 2025</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardContent}>
            <div>
              <p className={styles.statTitle}>Team Members</p>
              <p className={styles.statValue}>{userData.team_members.length + 1}</p>
            </div>
            <div className={`${styles.statIconWrapper} ${styles.statIconWrapperBlue}`}>
              <User style={{ height: '1.5rem', width: '1.5rem', color: '#2563eb' }} />
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardContent}>
            <div>
              <p className={styles.statTitle}>Submission Status</p>
              <p className={`${styles.statValue} ${styles.statValueGreen}`}>{userData.video_link ? "Submitted" : "Not Submitted"}</p>
            </div>
            <div className={`${styles.statIconWrapper} ${styles.statIconWrapperGreen}`}>
              <CheckCircle style={{ height: '1.5rem', width: '1.5rem', color: '#16a34a' }} />
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statCardContent}>
            <div>
              <p className={styles.statTitle}>Notifications</p>
              <p className={`${styles.statValue} ${styles.statValueYellow}`}>{isLoading ? "Loading..." : notifications.filter(n => n).length}</p>
            </div>
            <div className={`${styles.statIconWrapper} ${styles.statIconWrapperYellow}`}>
              <Bell style={{ height: '1.5rem', width: '1.5rem', color: '#ca8a04' }} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.userDetailsColumn}>
          <div className={styles.card}>
            <div className={styles.userDetailsHeader}>
              <div className={styles.userDetailsHeaderContent}>
                <div className={styles.userDetailsIconWrapper}>
                  <User style={{ height: '1.25rem', width: '1.25rem', color: '#fff' }} />
                </div>
                <h2 className={styles.cardTitle}>User Details</h2>
              </div>
            </div>

            <div className={styles.userDetailsBody}>
              <div className={styles.userDetailItem}>
                <User style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                <div>
                  <p className={styles.userDetailLabel}>Full Name</p>
                  <p className={styles.userDetailValue}>{userData.name}</p>
                </div>
              </div>

              <div className={styles.userDetailItem}>
                <Mail style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                <div>
                  <p className={styles.userDetailLabel}>Email</p>
                  <p className={styles.userDetailValue}>{userData.email}</p>
                </div>
              </div>

              <div className={styles.userDetailItem}>
                <School style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                <div>
                  <p className={styles.userDetailLabel}>Institute</p>
                  <p className={styles.userDetailValue}>{userData.institute_name}</p>
                </div>
              </div>

              <div className={styles.userDetailItem}>
                <Phone style={{ height: '1.25rem', width: '1.25rem', color: '#9ca3af' }} />
                <div>
                  <p className={styles.userDetailLabel}>Phone</p>
                  <p className={styles.userDetailValue}>{userData.phone_number}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.submissionsColumn}>
          {recentSubmission && (
            <div className={styles.card}>
              <div className={styles.submissionHeader}>
                <div className={styles.submissionHeaderContent}>
                  <div className={styles.submissionIconWrapper}>
                    <CheckCircle style={{ height: '1.25rem', width: '1.25rem', color: '#fff' }} />
                  </div>
                  <h2 className={styles.cardTitle}>Recent Submission</h2>
                </div>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.submissionItem}>
                  <div className={styles.submissionInfo}>
                    <div className={styles.submissionInfoIcon}>
                      <Video style={{ height: '1.25rem', width: '1.25rem', color: '#2563eb' }} />
                    </div>
                    <div>
                      <p className={styles.submissionText}>Latest Video Submission</p>
                    </div>
                  </div>

                  <a
                    href={recentSubmission}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.viewVideoButton}
                  >
                    <Eye style={{ height: '1rem', width: '1rem' }} />
                    <span>View Video</span>
                    <ExternalLink style={{ height: '1rem', width: '1rem' }} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            <div className={styles.notificationsIconWrapper}>
              <Bell style={{ height: '1.25rem', width: '1.25rem', color: '#ca8a04' }} />
            </div>
            <span>Notifications</span>
          </h2>
        </div>

        <div className={styles.notificationsList}>
          {
            isLoading || isFetching ? <div className={styles.loadingState}>
              <div>Loading notifications...</div>
            </div>
              :
              <>
                {notifications.length === 0 && (
                  <div className={styles.emptyState}>No notifications found.</div>
                )}
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={styles.notificationItem}
                  >
                    <div className={styles.notificationItemContent}>
                      <div className={styles.notificationIcon}>
                        <Bell style={{ height: '1.25rem', width: '1.25rem', color: '#2563eb' }} />
                      </div>
                      <div className={styles.notificationBody}>
                        <div className={styles.notificationRow}>
                          <p className={styles.notificationTitle}>
                            {notification.title}
                          </p>
                          <p className={styles.notificationTimestamp}>{new Date(notification.created_at).toLocaleString()}</p>
                        </div>

                        <div className={styles.notificationRow}>
                          <p className={styles.notificationMessage}>{notification.message}</p>
                          <p className={styles.notificationRecipient}>To: {notification.user === "all" ? "Everyone" : "Me"}</p>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </>
          }
        </div>
      </div>
    </div>
  );
}