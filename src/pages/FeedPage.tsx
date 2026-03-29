import VideoCard from '../components/VideoCard';
import { formatViewCount } from '../data/videos';
import type { VideoMeta } from '../types';

interface FeedPageProps {
  featured: VideoMeta;
  onClickVideo: () => void;
}

const CHIPS = ['전체', '음악', '게임', '요리', '여행', '학습', '스포츠', '뉴스', '영화'];

export default function FeedPage({ featured, onClickVideo }: FeedPageProps) {
  return (
    <div>
      <div className="yt-chips">
        {CHIPS.map((chip, i) => (
          <div key={chip} className={`yt-chip ${i === 0 ? 'active' : ''}`}>
            {chip}
          </div>
        ))}
      </div>

      <div className="yt-feed">
        <div className="yt-feed-grid single-video">
          <VideoCard
            title={featured.title}
            channel={featured.channel}
            views={`${formatViewCount(featured.viewCount)} · ${featured.uploadedAt}`}
            duration={featured.duration}
            thumbnailUrl={featured.thumbnailUrl}
            thumbnailColor={featured.thumbnailColor}
            avatarColor={featured.avatarColor}
            avatarLetter={featured.avatarLetter}
            onClick={onClickVideo}
          />
        </div>
      </div>
    </div>
  );
}
