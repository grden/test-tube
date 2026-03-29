import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type RefObject,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const s = Math.floor(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  }
  return `${m}:${String(ss).padStart(2, '0')}`;
}

interface YoutubeLikeVideoPlayerProps {
  src: string;
  /** false이면 광고 등으로 재생 중지 */
  playing: boolean;
  playbackRate: number;
  onTimeUpdate: (seconds: number) => void;
  onDurationChange: (duration: number) => void;
  onEnded: () => void;
  fullscreenTargetRef: RefObject<HTMLElement | null>;
}

export default function YoutubeLikeVideoPlayer({
  src,
  playing,
  playbackRate,
  onTimeUpdate,
  onDurationChange,
  onEnded,
  fullscreenTargetRef,
}: YoutubeLikeVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const hideControlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [hoveringUi, setHoveringUi] = useState(false);
  const [progressHover, setProgressHover] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const showControls = !playing || paused || hoveringUi || seeking || progressHover;

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const track = progressTrackRef.current;
      const v = videoRef.current;
      if (!track || !v || !Number.isFinite(duration) || duration <= 0) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      v.currentTime = ratio * duration;
    },
    [duration],
  );

  useEffect(() => {
    if (!seeking) return;
    const onMove = (e: MouseEvent) => seekFromClientX(e.clientX);
    const onUp = () => setSeeking(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [seeking, seekFromClientX]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (!playing) {
      v.pause();
      return;
    }

    v.playbackRate = playbackRate;
    v.play().catch(() => {});
  }, [playing, playbackRate]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !playing) return;
    v.playbackRate = playbackRate;
  }, [playbackRate, playing]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (paused || hoveringUi || seeking) {
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
        hideControlsTimerRef.current = null;
      }
      return;
    }
    hideControlsTimerRef.current = setTimeout(() => setHoveringUi(false), 2800);
    return () => {
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    };
  }, [playing, paused, hoveringUi, seeking]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v || !playing) return;
    if (v.paused) {
      void v.play();
    } else {
      v.pause();
    }
  }, [playing]);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (muted) {
      v.muted = false;
      setMuted(false);
      if (v.volume === 0) {
        v.volume = 1;
        setVolume(1);
      }
    } else {
      v.muted = true;
      setMuted(true);
    }
  }, [muted]);

  const onVolumeInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const vol = Number(e.target.value);
    v.volume = vol;
    v.muted = vol === 0;
    setVolume(vol);
    setMuted(vol === 0);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const el = fullscreenTargetRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      void el.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  }, [fullscreenTargetRef]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.target !== e.currentTarget && (e.target as HTMLElement).tagName !== 'VIDEO') return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    },
    [togglePlay],
  );

  const playedPct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration > 0 ? (bufferedEnd / duration) * 100 : 0;

  return (
    <div
      className="yt-native-player"
      onMouseMove={() => {
        setHoveringUi(true);
      }}
      onMouseLeave={() => {
        if (!seeking) setHoveringUi(false);
      }}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="presentation"
    >
      <video
        ref={videoRef}
        className="yt-native-video"
        src={src}
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => {
          const v = e.currentTarget;
          setDuration(v.duration);
          onDurationChange(v.duration);
          v.playbackRate = playbackRate;
          if (playing) void v.play().catch(() => {});
        }}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          setCurrentTime(v.currentTime);
          onTimeUpdate(v.currentTime);
          if (v.buffered.length > 0) {
            setBufferedEnd(v.buffered.end(v.buffered.length - 1));
          }
        }}
        onEnded={onEnded}
        onClick={togglePlay}
        onVolumeChange={(e) => {
          const v = e.currentTarget;
          setVolume(v.volume);
          setMuted(v.muted);
        }}
      />

      <div
        className={`yt-native-controls ${showControls ? 'yt-native-controls--visible' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          ref={progressTrackRef}
          className={`yt-native-progress-wrap ${progressHover || seeking ? 'yt-native-progress-wrap--hover' : ''}`}
          onMouseDown={(e) => {
            e.preventDefault();
            setSeeking(true);
            seekFromClientX(e.clientX);
          }}
          onMouseEnter={() => setProgressHover(true)}
          onMouseLeave={() => setProgressHover(false)}
        >
          <div className="yt-native-progress-bg" />
          <div className="yt-native-progress-buffered" style={{ width: `${bufferedPct}%` }} />
          <div className="yt-native-progress-played" style={{ width: `${playedPct}%` }} />
          <div className="yt-native-progress-scrub" style={{ left: `${playedPct}%` }} />
        </div>

        <div className="yt-native-toolbar">
          <button
            type="button"
            className="yt-native-btn"
            aria-label={paused ? '재생' : '일시정지'}
            onClick={togglePlay}
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
            <button type="button" className="yt-native-btn" aria-label="음소거" onClick={toggleMute}>
              {muted || volume === 0 ? (
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"
                  />
                </svg>
              ) : volume < 0.5 ? (
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.49-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.49-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                  />
                </svg>
              )}
            </button>
            <input
              className="yt-native-volume-slider"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={onVolumeInput}
              aria-label="볼륨"
            />
          </div>

          <div className="yt-native-time">
            <span>{formatTime(currentTime)}</span>
            <span className="yt-native-time-sep"> / </span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="yt-native-toolbar-spacer" />

          <button
            type="button"
            className="yt-native-btn"
            aria-label={isFullscreen ? '전체화면 종료' : '전체화면'}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden>
                <path
                  fill="currentColor"
                  d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
