interface SavedTimeBadgeProps {
  playedSeconds: number;
  duration: number;
}

export default function SavedTimeBadge({ playedSeconds, duration }: SavedTimeBadgeProps) {
  if (duration <= 0) return null;

  const interval = duration / 15;
  const displayedSavedTime = Math.min(15, Math.round(playedSeconds / interval));

  return (
    <div className="yt-saved-time-badge">
      아낀 시간:&nbsp;<span className="badge-time">{displayedSavedTime}초</span>
    </div>
  );
}
