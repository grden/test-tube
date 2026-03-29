interface VideoCardProps {
  title: string;
  channel: string;
  views: string;
  duration: string;
  thumbnailUrl?: string;
  thumbnailColor: string;
  avatarColor: string;
  avatarLetter: string;
  onClick?: () => void;
  watched?: boolean;
  disabled?: boolean;
}

const PlayIcon = () => (
  <svg viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

export default function VideoCard({
  title,
  channel,
  views,
  duration,
  thumbnailUrl,
  thumbnailColor,
  avatarColor,
  avatarLetter,
  onClick,
  watched = false,
  disabled = false,
}: VideoCardProps) {
  return (
    <div
      className={`yt-video-card${watched ? ' watched' : ''}${disabled ? ' disabled' : ''}`}
      onClick={!disabled ? onClick : undefined}
      style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      <div className="yt-thumbnail-wrapper">
        <div
          className="yt-thumbnail-placeholder"
          style={{ background: thumbnailColor }}
        >
          {thumbnailUrl
            ? <img src={thumbnailUrl} alt={title} className="yt-thumbnail-img" />
            : <PlayIcon />}
        </div>
        <div className="yt-thumbnail-duration">{duration}</div>
      </div>
      <div className="yt-card-info">
        <div
          className="yt-card-avatar"
          style={{ background: avatarColor }}
        >
          {avatarLetter}
        </div>
        <div className="yt-card-meta">
          <div className="yt-card-title">{title}</div>
          <div className="yt-card-channel">{channel}</div>
          <div className="yt-card-stats">{views}</div>
        </div>
      </div>
    </div>
  );
}
