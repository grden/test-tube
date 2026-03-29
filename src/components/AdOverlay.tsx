import { useEffect, useRef, useState } from 'react';
import type { AdType, ConditionId } from '../types';

interface AdOverlayProps {
  adType: AdType;
  conditionId?: ConditionId;
  onComplete: (watchedSeconds: number, skipped: boolean) => void;
}

const AD_URLS: Record<AdType, string> = {
  '5s_skip': '/assets/media/trip-30.mp4',
  '15s_fixed': '/assets/media/trip-15.mp4',
};

function formatTime(t: number) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function AdMessageBadge({ conditionId, currentTime }: { conditionId?: ConditionId; currentTime: number }) {
  if (!conditionId || conditionId === 'control') return null;

  let message: React.ReactNode = null;

  if (conditionId === 'a1') {
    message = '⚡️ 광고 시청 후 FastTube가 적용됩니다.';
  } else if (conditionId === 'a2') {
    message = '⚡️ 광고를 스킵하지 않으면 FastTube가 적용됩니다.';
  } else if (conditionId === 'b1') {
    message = '⏳ 이전 영상에서 FastTube로 아낀 시간 15초로 광고가 재생됩니다.';
  } else if (conditionId === 'b2') {
    const used = Math.min(5, Math.floor(currentTime) + 1);
    message = (
      <>
        {'⏳ 이전 영상에서 FastTube로 아낀 시간 15초 중 '}
        <span className="badge-time">{used}초</span>
        {'를 사용해 광고가 재생됩니다.'}
      </>
    );
  }

  return <div className="yt-saved-time-badge yt-ad-message-badge">{message}</div>;
}

export default function AdOverlay({ adType, conditionId, onComplete }: AdOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(adType === '15s_fixed' ? 15 : 30);
  const [canSkip, setCanSkip] = useState(false);
  const [ended, setEnded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);

  // const timeLeft = Math.max(0, Math.ceil(duration - currentTime));
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 사용자 상호작용 전에도 재생되도록 광고는 항상 무음 자동재생으로 시작한다.
    video.defaultMuted = false;
    video.muted = false;
    video.playsInline = true;

    const handleLoadedMetadata = () => setDuration(video.duration);

    const handleTimeUpdate = () => {
      const t = video.currentTime;
      setCurrentTime(t);
      if (adType === '5s_skip' && t >= 5) setCanSkip(true);
    };

    const handleEnded = () => {
      setEnded(true);
      onComplete(video.duration, false);
    };

    const handlePlay = () => setPaused(false);
    const handlePause = () => setPaused(true);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    // autoPlay가 무시되는 브라우저를 위해 mount 직후에도 재생을 한 번 더 시도한다.
    video.play().catch(() => {
      onComplete(0, false);
    });

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSkip = () => {
    const video = videoRef.current;
    onComplete(video ? video.currentTime : currentTime, true);
  };

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play();
    else video.pause();
  };

  const handleVolume = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  if (ended) return null;

  return (
    <div className="yt-splash-overlay">
      <AdMessageBadge conditionId={conditionId} currentTime={currentTime} />
      <video
        ref={videoRef}
        src={AD_URLS[adType]}
        autoPlay
        playsInline
        preload="auto"
        className="yt-splash-video"
        onError={() => onComplete(0, false)}
      />
      <div className="yt-splash-ui">
        <div className="yt-splash-ui-inner">
          <div className="yt-splash-badge-area">
            <div className="yt-splash-badge">
              <span className="yt-splash-badge-label">광고</span>
              <span className="yt-splash-badge-text">광고 · 1/1</span>
            </div>
          </div>

          <div className="yt-splash-skip-area">
            {adType === '5s_skip' && (
              canSkip ? (
                <button className="yt-splash-skip-btn" onClick={handleSkip}>
                  광고 건너뛰기
                  <svg viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
              ) : (
                <div className="yt-splash-skip-waiting">
                  {Math.max(0, Math.ceil(5 - currentTime))}초 후 건너뛰기 가능
                </div>
              )
            )}
          </div>
        </div>

        {/* 광고 재생바 — 기본 플레이어와 동일한 클래스, 차이점만 yt-ad-* 로 오버라이드 */}
        <div className="yt-native-controls yt-native-controls--visible yt-ad-controls-override">
          <div className="yt-native-progress-wrap yt-ad-progress-no-seek">
            <div className="yt-native-progress-bg" />
            <div className="yt-native-progress-played yt-ad-progress-yellow" style={{ width: `${progress}%` }} />
            {/* 스크럽 닷 없음 */}
          </div>

          <div className="yt-native-toolbar">
            <button
              type="button"
              className="yt-native-btn"
              aria-label={paused ? '재생' : '일시정지'}
              onClick={handlePlayPause}
            >
              {paused ? (
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
                  <path fill="currentColor" d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
                  <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              )}
            </button>

            <div className="yt-native-volume">
              <button type="button" className="yt-native-btn" aria-label="음소거" onClick={handleVolume}>
                {muted ? (
                  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
                    <path fill="currentColor" d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
                    <path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.49-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <input
                className="yt-native-volume-slider"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : 1}
                onChange={(e) => {
                  const video = videoRef.current;
                  if (!video) return;
                  const vol = Number(e.target.value);
                  video.volume = vol;
                  video.muted = vol === 0;
                  setMuted(vol === 0);
                }}
                aria-label="볼륨"
              />
            </div>

            <div className="yt-native-time yt-ad-time-lg">
              <span>{formatTime(currentTime)}</span>
              <span className="yt-native-time-sep"> / </span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="yt-native-toolbar-spacer" />
          </div>
        </div>
      </div>
    </div>
  );
}
