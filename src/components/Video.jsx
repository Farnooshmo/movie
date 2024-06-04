import PropTypes from 'prop-types';
import './Video.css';

const Video = ({ title, url, rating, onUpVote, onDownVote, onRemove }) => {
  return (
    <div className="video-card">
      <div className="video-card-inner">
        <div className="video-card-front">
          <iframe
            className="iframe"
            width="100%"
            height="auto"
            src={url.replace("watch?v=", "embed/")}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="video-card-back">
          <h2 className="video-title">{title}</h2>
          <a href={url} target="_blank" rel="noopener noreferrer" className="video-link">
            Watch Video
          </a>
          <div>Liked: {rating}</div>
          <div className="votes-btn-wrap">
            <button onClick={onUpVote} className="up-vote" aria-label="Upvote">
              ♡
            </button>
            <button onClick={onDownVote} className="down-vote" aria-label="Downvote">
              💔
            </button>
            <button onClick={onRemove} className="delete" aria-label="Remove">
              ❌
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Video.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default Video;