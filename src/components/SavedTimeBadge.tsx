interface SavedTimeBadgeProps {
  playedSeconds: number;
  duration: number;
  maxSeconds?: number;
}

export default function SavedTimeBadge({ playedSeconds, duration, maxSeconds = 15 }: SavedTimeBadgeProps) {
  if (duration <= 0) return null;

  const interval = duration / 15;
  const displayedSavedTime = Math.min(maxSeconds, Math.round(playedSeconds / interval));

  return (
    <div className="yt-saved-time-badge">
      아낀 시간:&nbsp;<span className="badge-time">{displayedSavedTime}초</span>
    </div>
  );
}
