import { useReducer, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FeedPage from './FeedPage';
import WatchPage from './WatchPage';
import { CONDITIONS, isValidCondition } from '../utils/conditions';
import { useViewContext } from '../contexts/ViewContext';
import { VIDEO_SUBWAY, VIDEO_GAS, VIDEO_0349 } from '../data/videos';
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

function reducer(state: State, action: Action, conditionId: ConditionId): State {
  const cfg = CONDITIONS[conditionId];

  switch (action.type) {
    case 'CLICK_VIDEO': {
      if (state.type !== 'feed') return state;

      if (cfg.videoCount === 2) {
        // B1/B2: gas 먼저 1.05x 배속, 사이드바에서 0349로 이동
        return {
          type: 'watch',
          videoUrl: VIDEO_GAS.url,
          showAd: false,
          adType: null,
          speed: cfg.video1Speed,
          showSavedTime: cfg.video1ShowSavedTime,
          isVideo1: true,
        };
      } else {
        // Control / A1 / A2: subway 영상, 광고 후 재생
        return {
          type: 'watch',
          videoUrl: VIDEO_SUBWAY.url,
          showAd: true,
          adType: cfg.adType,
          speed: cfg.mainSpeed,
          showSavedTime: cfg.mainShowSavedTime,
          isVideo1: false,
        };
      }
    }

    case 'CLICK_VIDEO2': {
      // B1/B2: 사이드바의 0349 클릭 → 광고 후 재생
      if (cfg.videoCount !== 2) return state;
      return {
        type: 'watch',
        videoUrl: VIDEO_0349.url,
        showAd: true,
        adType: cfg.adType,
        speed: cfg.mainSpeed,
        showSavedTime: cfg.mainShowSavedTime,
        isVideo1: false,
      };
    }

    case 'VIDEO1_ENDED': {
      // B1/B2: gas 영상 종료 — watch 페이지에 머물며 사이드바에서 0349 선택 대기
      return state;
    }

    case 'AD_COMPLETED': {
      if (state.type !== 'watch') return state;
      // A2: 광고 건너뛰기 → 1.0x, 아낀 시간 UI 없음
      if (conditionId === 'a2' && action.skipped) {
        return { ...state, showAd: false, speed: 1.0, showSavedTime: false };
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

export default function ExperimentRunner() {
  const { conditionId: rawId } = useParams<{ conditionId: string }>();
  const conditionId: ConditionId = isValidCondition(rawId ?? '') ? (rawId as ConditionId) : 'control';
  const cfg = CONDITIONS[conditionId];

  const navigate = useNavigate();
  const { setIsWatching } = useViewContext();

  const [state, dispatch] = useReducer(
    (s: State, a: Action) => reducer(s, a, conditionId),
    undefined,
    buildInitialState,
  );

  // URL을 현재 상태에 맞게 동기화
  const targetUrl =
    state.type === 'feed'
      ? `/${conditionId}`
      : `/${conditionId}/watch?v=${cfg.videoCount === 2 && !state.isVideo1 ? 2 : 1}`;

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
    // 피드는 항상 카드 1개: control/a1/a2 → subway, b1/b2 → gas
    return (
      <FeedPage
        featured={isB ? VIDEO_GAS : VIDEO_SUBWAY}
        onClickVideo={handleClickVideo}
      />
    );
  }

  if (state.type === 'watch') {
    const isVideo1 = state.isVideo1;

    // 현재 재생 영상 메타
    const currentMeta = isVideo1 ? VIDEO_GAS : (isB ? VIDEO_0349 : VIDEO_SUBWAY);
    const videoTitle  = currentMeta.title;

    return (
      <WatchPage
        key={state.videoUrl + String(state.showAd)}
        videoUrl={state.videoUrl}
        speed={state.speed}
        showSavedTime={state.showSavedTime}
        adType={state.showAd ? (state.adType as AdType) : undefined}
        conditionId={conditionId}
        title={videoTitle}
        currentVideoMeta={currentMeta}
        onAdComplete={handleAdComplete}
        onVideoEnded={isVideo1 ? handleVideo1Ended : handleMainVideoEnded}
        onClickNextVideo={isVideo1 ? handleClickVideo2 : undefined}
        nextVideoMeta={isVideo1 ? VIDEO_0349 : undefined}
      />
    );
  }

  return null;
}
