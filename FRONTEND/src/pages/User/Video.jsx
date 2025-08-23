import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, updateVideoLinkInSlice, freezeFinalVideo } from "../../features/authSlice";
import { useUpdateVideoLinkMutation, useFreezeVideoMutation } from "../../app/api/userApiSlice";
import { Video, Upload, Eye, CheckCircle, Lock } from "lucide-react";
import './Video.css';

function VideoPage() {
  const [updateVideoLink, { isLoading }] = useUpdateVideoLinkMutation();
  const [videoLink, setVideoLink] = useState("");
  const [freezeVideo, { isLoading: isFreezing }] = useFreezeVideoMutation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [showFreezeModal, setShowFreezeModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (videoLink.trim()) {
      try {
        const response = await updateVideoLink(videoLink);
        if (response.data) {
          dispatch(updateVideoLinkInSlice({ video_link: videoLink }));
          setVideoLink("");
        }
      } catch (error) {
        console.error("Failed to update video link:", error);
      }
    }
  };

  const handleFreezeSubmission = () => {
    setShowFreezeModal(true);
  };

  const confirmFreeze = async () => {
    const result = await freezeVideo();
    if (result.data) {
      dispatch(freezeFinalVideo());
      setShowFreezeModal(false);
    }
  };

  const videoLinks = user?.video_link || [];
  const reversedLinks = [...videoLinks].reverse();

  return (
    <>
      <div className="video-page-container">
        {/* Form Section */}
        <div className="card">
          <div className="card-header header-purple">
            <div className="card-header-icon icon-purple">
              <Video className="icon-white" />
            </div>
            <h2 className="card-title">Submit Your Video Link</h2>
          </div>
          <div className="card-body">
            <form className="video-form" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="videoLink" className="form-label">YouTube Link</label>
                <div className="input-wrapper">
                  <input
                    type="url"
                    id="videoLink"
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    placeholder="https://..."
                    className="form-input with-icon"
                    required
                    disabled={isLoading || user?.video_freeze}
                  />
                  <Upload className="input-icon" />
                </div>
              </div>
              <button type="submit" className="button button-primary" disabled={isLoading}>
                <Upload className="icon" />
                <span>{isLoading ? "Saving..." : "Save Link"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Submissions Section */}
        {reversedLinks.length > 0 && (
          <div className="card">
            <div className="card-header header-green">
              <div className="card-header-icon icon-green">
                <CheckCircle className="icon-white" />
              </div>
              <h2 className="card-title">Your Submissions</h2>
            </div>
            <div className="card-body submission-list">
              {reversedLinks.map((item, index) => {
                const isLatest = index === 0;
                return (
                  <div key={index} className={`submission-item ${isLatest ? 'latest' : ''}`}>
                    <div className="submission-info">
                      <div className={`submission-icon-wrapper ${isLatest ? 'latest' : ''}`}>
                        <Video className={`icon ${isLatest ? 'icon-yellow' : 'icon-blue'}`} />
                      </div>
                      <div>
                        <p className="submission-url">{item.url}</p>
                        <p className="submission-date">Uploaded on {new Date(item.added_at).toLocaleDateString()}</p>
                        {isLatest && <span className="latest-badge">Latest Submission</span>}
                      </div>
                    </div>
                    <div className="submission-actions">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="button button-view">
                        <Eye className="icon-small" />
                        <span>View</span>
                      </a>
                      {isLatest && (
                        <button onClick={handleFreezeSubmission} disabled={user.video_freeze} className={`button button-freeze ${user.video_freeze ? 'frozen' : ''}`}>
                          <Lock className="icon-small" />
                          <span>{user.video_freeze ? "Frozen" : "Freeze Video"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Freeze Modal */}
      {showFreezeModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-icon-wrapper icon-yellow">
                <Lock className="icon-large icon-yellow" />
              </div>
              <div>
                <h3 className="modal-title">Freeze Submission</h3>
                <p className="modal-subtitle">You won’t be able to edit this after freezing.</p>
              </div>
            </div>
            <p className="modal-body-text">
              Are you sure you want to freeze your latest submission? <br />
              <strong>{reversedLinks[0].url}</strong>
            </p>
            <div className="modal-footer">
              <button onClick={() => setShowFreezeModal(false)} className="button button-secondary">Cancel</button>
              <button onClick={confirmFreeze} className="button button-confirm" disabled={isFreezing}>
                {isFreezing ? "Freezing..." : "Freeze Submission"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VideoPage;