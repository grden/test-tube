import { useState, useRef } from 'react';
import AdOverlay from '../components/AdOverlay';
import SavedTimeBadge from '../components/SavedTimeBadge';
import UpNextList from '../components/UpNextList';
import YoutubeLikeVideoPlayer from '../components/YoutubeLikeVideoPlayer';
import type { AdType, ConditionId, VideoMeta } from '../types';

interface WatchPageProps {
  videoUrl: string;
  speed: number;
  showSavedTime: boolean;
  adType?: AdType;
  conditionId?: ConditionId;
  title?: string;
  /** 현재 재생 중인 영상 메타 (채널 정보 등에 사용) */
  currentVideoMeta?: VideoMeta;
  onAdComplete?: (skipped: boolean) => void;
  onVideoEnded: () => void;
  /** B1/B2 영상1 시청 중일 때만 전달 — 존재하면 오른쪽 사이드바 표시 */
  onClickNextVideo?: () => void;
  /** 사이드바에 표시할 다음 영상 메타 */
  nextVideoMeta?: VideoMeta;
}

export default function WatchPage({
  videoUrl,
  speed,
  showSavedTime,
  adType,
  conditionId,
  title,
  currentVideoMeta,
  onAdComplete,
  onVideoEnded,
  onClickNextVideo,
  nextVideoMeta,
}: WatchPageProps) {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [adShowing, setAdShowing] = useState(!!adType);
  const [duration, setDuration] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);

  const videoTitle = title ?? '실험 영상 콘텐츠';

  return (
    <div className="yt-watch-layout">
      {/* 플레이어 + 영상 정보 */}
      <div className="yt-watch-player-col">
        <div ref={playerContainerRef} className="yt-player-container">
          <div className="yt-player-aspect">
            <div className="yt-player-wrapper">
              <YoutubeLikeVideoPlayer
                key={videoUrl}
                src={videoUrl}
                playing={!adShowing}
                playbackRate={speed}
                onTimeUpdate={setPlayedSeconds}
                onDurationChange={setDuration}
                onEnded={onVideoEnded}
                fullscreenTargetRef={playerContainerRef}
              />
            </div>

            {/* 광고 오버레이 */}
            {adShowing && adType && (
              <AdOverlay
                adType={adType}
                conditionId={conditionId}
                onComplete={(watchedSeconds, skipped) => {
                  setAdShowing(false);
                  onAdComplete?.(skipped);
                  void watchedSeconds;
                }}
              />
            )}

            {/* 아낀 시간 배지 */}
            {showSavedTime && !adShowing && duration > 0 && (
              <SavedTimeBadge playedSeconds={playedSeconds} duration={duration} />
            )}
          </div>
        </div>

        {/* 영상 정보 */}
        <div className="yt-video-info">
          <h1 className="yt-video-title">{videoTitle}</h1>
          <div className="yt-channel-row">
            <div className="yt-channel-info">
              <div
                className="yt-channel-avatar"
                style={{ background: currentVideoMeta?.avatarColor ?? '#3ea6ff' }}
              >
                {currentVideoMeta?.avatarLetter ?? 'F'}
              </div>
              <div>
                <div className="yt-channel-name">
                  {currentVideoMeta?.channel ?? 'FastTube Lab'}
                </div>
                <div className="yt-channel-subs">구독자 12.4만명</div>
              </div>
            </div>
            <button className="yt-subscribe-btn">구독</button>
          </div>

        </div>
      </div>

      {/* 오른쪽 컬럼: 항상 402px 공간 유지, B1/B2 영상1에서만 내용 표시 */}
      <div className="yt-watch-sidebar-col">
        {onClickNextVideo && nextVideoMeta && (
          <UpNextList nextVideoMeta={nextVideoMeta} nextVideoClick={onClickNextVideo} />
        )}
      </div>
    </div>
  );
}
