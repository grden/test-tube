import type { VideoMeta } from '../types';
import { formatViewCount } from '../data/videos';

interface UpNextListProps {
  nextVideoMeta: VideoMeta;
  nextVideoClick: () => void;
}

export default function UpNextList({ nextVideoMeta, nextVideoClick }: UpNextListProps) {
  return (
    <div>
      <div className="yt-up-next-title">다음 동영상</div>
      <div
        className="yt-up-next-card yt-up-next-card--featured"
        onClick={nextVideoClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && nextVideoClick()}
      >
        <div className="yt-up-next-thumb">
          <div className="yt-up-next-thumb-inner">
            <div
              className="yt-up-next-thumb-placeholder"
              style={{ background: nextVideoMeta.thumbnailColor }}
            >
              {nextVideoMeta.thumbnailUrl
                ? <img src={nextVideoMeta.thumbnailUrl} alt={nextVideoMeta.title} className="yt-thumbnail-img" />
                : <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="rgba(255,255,255,0.5)"/></svg>}
            </div>
            <div className="yt-up-next-duration">{nextVideoMeta.duration}</div>
          </div>
        </div>
        <div className="yt-up-next-meta">
          <div className="yt-up-next-meta-title">{nextVideoMeta.title}</div>
          <div className="yt-up-next-channel">{nextVideoMeta.channel}</div>
          <div className="yt-up-next-stats">
            {formatViewCount(nextVideoMeta.viewCount)} · {nextVideoMeta.uploadedAt}
          </div>
        </div>
      </div>
    </div>
  );
}
