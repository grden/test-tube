import { useReducer, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FeedPage from './FeedPage';
import WatchPage from './WatchPage';
import { CONDITIONS, isValidCondition } from '../utils/conditions';
import { useViewContext } from '../contexts/ViewContext';
import {
  VIDEO_SUBWAY, VIDEO_GAS, VIDEO_0349, VIDEO_MONK, VIDEO_DRAMA, VIDEO_MARBLE,
  VIDEO_NEWS, VIDEO_WEATHER,
} from '../data/videos';
import type { ConditionId, AdType, ExperimentPhase } from '../types';

// --------------- State Machine ---------------

type State = ExperimentPhase;

type Action =
  | { type: 'CLICK_VIDEO' }
  | { type: 'CLICK_VIDEO2' }
  | { type: 'VIDEO1_ENDED' }
  | { type: 'AD_COMPLETED'; skipped: boolean }
  | { type: 'MAIN_VIDEO_ENDED' };

function buildInitialState(): State {
  return { type: 'feed', video1Watched: false };
}

const SAMPLE_CAP = 3;

function reducer(state: State, action: Action, conditionId: ConditionId, isSample: boolean): State {
  const cfg = CONDITIONS[conditionId];

  // 영상 선택 헬퍼 (isSample 여부에 따라 분기)
  const video1Meta  = isSample ? VIDEO_NEWS   : (conditionId === 'b2' ? VIDEO_MONK   : VIDEO_GAS);
  const video2Meta  = isSample ? VIDEO_WEATHER : (conditionId === 'b2' ? VIDEO_MARBLE : VIDEO_0349);
  const mainAMeta   = isSample ? VIDEO_NEWS   : (conditionId === 'a2' ? VIDEO_DRAMA  : VIDEO_SUBWAY);

  const cap1   = isSample ? SAMPLE_CAP : (cfg.video1SavedTimeCap ?? cfg.mainSavedTimeCap);
  const capMain = isSample ? SAMPLE_CAP : cfg.mainSavedTimeCap;

  switch (action.type) {
    case 'CLICK_VIDEO': {
      if (state.type !== 'feed') return state;

      if (cfg.videoCount === 2) {
        return {
          type: 'watch',
          videoUrl: video1Meta.url,
          showAd: false,
          adType: null,
          speed: cfg.video1Speed ?? 1.05,
          showSavedTime: cfg.video1ShowSavedTime ?? false,
          savedTimeCap: cap1,
          isVideo1: true,
        };
      } else {
        return {
          type: 'watch',
          videoUrl: mainAMeta.url,
          showAd: true,
          adType: cfg.adType,
          speed: cfg.mainSpeed,
          showSavedTime: cfg.mainShowSavedTime,
          savedTimeCap: capMain,
          isVideo1: false,
        };
      }
    }

    case 'CLICK_VIDEO2': {
      if (cfg.videoCount !== 2) return state;
      return {
        type: 'watch',
        videoUrl: video2Meta.url,
        showAd: true,
        adType: cfg.adType,
        speed: cfg.mainSpeed,
        showSavedTime: cfg.mainShowSavedTime,
        savedTimeCap: capMain,
        isVideo1: false,
      };
    }

    case 'VIDEO1_ENDED': {
      return state;
    }

    case 'AD_COMPLETED': {
      if (state.type !== 'watch') return state;
      // A2: 광고 스킵 → 1.0x, 배지는 표시하되 아낀 시간은 0에서 고정
      if (conditionId === 'a2' && action.skipped) {
        return { ...state, showAd: false, speed: 1.0, showSavedTime: true, savedTimeCap: 0 };
      }
      return { ...state, showAd: false };
    }

    case 'MAIN_VIDEO_ENDED': {
      return { type: 'feed', video1Watched: false };
    }

    default:
      return state;
  }
}

// --------------- Component ---------------

interface ExperimentRunnerProps {
  isSample?: boolean;
}

export default function ExperimentRunner({ isSample = false }: ExperimentRunnerProps) {
  const { conditionId: rawId } = useParams<{ conditionId: string }>();
  const conditionId: ConditionId = isValidCondition(rawId ?? '') ? (rawId as ConditionId) : 'control';
  const cfg = CONDITIONS[conditionId];

  const navigate = useNavigate();
  const { setIsWatching } = useViewContext();

  const [state, dispatch] = useReducer(
    (s: State, a: Action) => reducer(s, a, conditionId, isSample),
    undefined,
    buildInitialState,
  );

  // URL을 현재 상태에 맞게 동기화
  const basePath = isSample ? `/${conditionId}/sample` : `/${conditionId}`;
  const targetUrl =
    state.type === 'feed'
      ? basePath
      : `${basePath}/watch?v=${cfg.videoCount === 2 && !state.isVideo1 ? 2 : 1}`;

  useEffect(() => {
    navigate(targetUrl, { replace: true });
  }, [targetUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsWatching(state.type === 'watch');
    return () => setIsWatching(false);
  }, [state.type, setIsWatching]);

  const handleClickVideo     = useCallback(() => dispatch({ type: 'CLICK_VIDEO' }), []);
  const handleClickVideo2    = useCallback(() => dispatch({ type: 'CLICK_VIDEO2' }), []);
  const handleVideo1Ended    = useCallback(() => dispatch({ type: 'VIDEO1_ENDED' }), []);
  const handleAdComplete     = useCallback((skipped: boolean) => dispatch({ type: 'AD_COMPLETED', skipped }), []);
  const handleMainVideoEnded = useCallback(() => dispatch({ type: 'MAIN_VIDEO_ENDED' }), []);

  const isB = cfg.videoCount === 2;

  if (state.type === 'feed') {
    const featuredMeta = isSample
      ? VIDEO_NEWS
      : (isB ? (conditionId === 'b2' ? VIDEO_MONK : VIDEO_GAS) : (conditionId === 'a2' ? VIDEO_DRAMA : VIDEO_SUBWAY));
    return <FeedPage featured={featuredMeta} onClickVideo={handleClickVideo} />;
  }

  if (state.type === 'watch') {
    const isVideo1 = state.isVideo1;

    const currentMeta = isSample
      ? (isVideo1 ? VIDEO_NEWS : (isB ? VIDEO_WEATHER : VIDEO_NEWS))
      : (isVideo1
          ? (conditionId === 'b2' ? VIDEO_MONK : VIDEO_GAS)
          : (isB ? (conditionId === 'b2' ? VIDEO_MARBLE : VIDEO_0349) : (conditionId === 'a2' ? VIDEO_DRAMA : VIDEO_SUBWAY)));

    const nextMeta = isSample
      ? VIDEO_WEATHER
      : (conditionId === 'b2' ? VIDEO_MARBLE : VIDEO_0349);

    return (
      <WatchPage
        key={state.videoUrl + String(state.showAd)}
        videoUrl={state.videoUrl}
        speed={state.speed}
        showSavedTime={state.showSavedTime}
        savedTimeCap={state.savedTimeCap}
        adType={state.showAd ? (state.adType as AdType) : undefined}
        conditionId={conditionId}
        title={currentMeta.title}
        currentVideoMeta={currentMeta}
        onAdComplete={handleAdComplete}
        onVideoEnded={isVideo1 ? handleVideo1Ended : handleMainVideoEnded}
        onClickNextVideo={isVideo1 ? handleClickVideo2 : undefined}
        nextVideoMeta={isVideo1 ? nextMeta : undefined}
      />
    );
  }

  return null;
}
