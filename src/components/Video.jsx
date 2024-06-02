import PropTypes from 'prop-types';
import './Video.css';
const Video = ({ title, url, rating, onUpVote, onDownVote, onRemove }) => {
  return (
    <div className="video_wrapper">
      <h2 className="video_title">Title: {title}</h2>
<iframe
className='iframe'
    width="560"
    height="315"
    src={url.replace("watch?v=", "embed/")}
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
>

</iframe>

      <div>Liked: {rating}</div>
      <div className="votes_btn_wrap">
        <button onClick={onUpVote} className="up_vote" aria-label="Upvote">
          ♡
        </button>
        <button onClick={onDownVote} className="down_vote" aria-label="Downvote">
          💔
        </button>
        <button onClick={onRemove} className="delete" aria-label="Remove">
          ␡
        </button>
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
