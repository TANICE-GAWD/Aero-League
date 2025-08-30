import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectUser, updateVideoLinkInSlice, freezeFinalVideo } from "../../features/authSlice"
import { useUpdateVideoLinkMutation, useFreezeVideoMutation } from "../../app/api/userApiSlice"
import { Video, Upload, Eye, CheckCircle, Lock } from "lucide-react"
import styles from "./Video.module.css"


function VideoPage() {
  const [updateVideoLink, { isLoading }] = useUpdateVideoLinkMutation()
  const [videoLink, setVideoLink] = useState("")
  const [freezeVideo, {isLoading: isFreezing}] = useFreezeVideoMutation()
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const [showFreezeModal, setShowFreezeModal] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (videoLink.trim()) {
      try {
        const response = await updateVideoLink(videoLink)
        console.log(response.data)
        if (response.data) {
          dispatch(updateVideoLinkInSlice({ video_link: videoLink }))
          setVideoLink("")
        }
      } catch (error) {
        console.error("Failed to update video link:", error)
      }
    }
  }
  const handleFreezeSubmission = () => {
    setShowFreezeModal(true)
  }
  const videoLinks = user?.video_link || []
  const reversedLinks = [...videoLinks].reverse() 
  const confirmFreeze = async () => {
    const result = await freezeVideo()
    if (result.data) {
      dispatch(freezeFinalVideo())
      setShowFreezeModal(false)
    }
  }
  return (
    <div className={styles.videoContainer}>
      {/* Form Section */}
      <div className={styles.card}>
        <div className={styles.formHeader}>
          <div className={styles.headerContent}>
            <div className={`${styles.iconWrapper} ${styles.purpleIconWrapper}`}>
              <Video className={styles.icon} />
            </div>
            <h2 className={styles.title}>
              Submit Your Video Link
            </h2>
          </div>
        </div>

        <div className={styles.cardBody}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="videoLink"
                className={styles.label}
              >
                YouTube Link
              </label>
              <div className={styles.inputContainer}>
                <input
                  type="url"
                  id="videoLink"
                  value={videoLink}
                  onChange={(e) => setVideoLink(e.target.value)}
                  placeholder="https://..."
                  className={styles.input}
                  required
                  disabled={isLoading || user?.video_freeze}
                />
                <Upload className={styles.inputIcon} />
              </div>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              <Upload className={styles.buttonIcon} />
              <span>{isLoading ? "Saving..." : "Save Link"}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Submissions Section */}
      {reversedLinks.length > 0 && (
        <div className={`${styles.card} ${styles.submissionsSection}`}>
          <div className={styles.submissionsHeader}>
            <div className={styles.headerContent}>
              <div className={`${styles.iconWrapper} ${styles.greenIconWrapper}`}>
                <CheckCircle className={styles.icon} />
              </div>
              <h2 className={styles.title}>
                Your Submissions
              </h2>
            </div>
          </div>

          <div className={`${styles.cardBody} ${styles.submissionsList}`}>
            {reversedLinks.map((item, index) => {
              const isLatest = index === 0
              return (
                <div
                  key={index}
                  className={`${styles.submissionItem} ${isLatest ? styles.latestSubmission : ""}`}
                >
                  <div className={styles.submissionDetails}>
                    <div
                      className={`${styles.submissionIconWrapper} ${isLatest ? styles.latestIconBg : styles.oldIconBg}`}
                    >
                      <Video
                        className={`${styles.submissionVideoIcon} ${isLatest ? styles.latestIconColor : styles.oldIconColor}`}
                      />
                    </div>
                    <div>
                      <p className={styles.submissionUrl}>{item.url}</p>
                      <p className={styles.submissionDate}>
                        Uploaded on{" "}
                        {new Date(item.added_at).toLocaleDateString()}
                      </p>
                      {isLatest && (
                        <span className={styles.latestBadge}>
                          Latest Submission
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.submissionActions}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.viewButton}
                    >
                      <Eye className={styles.actionIcon} />
                      <span>View</span>
                    </a>

                    {isLatest && (
                      <button
                        onClick={handleFreezeSubmission}
                        disabled={user.video_freeze}
                        className={`${styles.freezeButton} ${user.video_freeze ? styles.disabledFreeze : ""}`}
                      >
                        <Lock className={styles.actionIcon} />
                        <span>{user.video_freeze ? "Video Frozen" : "Freeze Video"}</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {showFreezeModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalBody}>
              <div className={styles.modalHeader}>
                <div className={styles.modalIconWrapper}>
                  <Lock className={styles.modalIcon} />
                </div>
                <div>
                  <h3 className={styles.modalTitle}>Freeze Submission</h3>
                  <p className={styles.modalSubtitle}>You won’t be able to edit this after freezing.</p>
                </div>
              </div>
              <p className={styles.modalText}>
                Are you sure you want to freeze your latest submission? <br />
                <strong>{reversedLinks[0].url}</strong>
              </p>
              <div className={styles.modalActions}>
                <button
                  onClick={() => setShowFreezeModal(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmFreeze}
                  className={styles.confirmFreezeButton}
                  disabled={isFreezing}
                >
                  {isFreezing ? "Freezing..." : "Freeze Submission"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPage