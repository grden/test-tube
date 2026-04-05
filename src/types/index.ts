export type ConditionId = 'control' | 'a1' | 'a2' | 'b1' | 'b2';

export interface VideoMeta {
  /** 영상 고유 ID */
  id: string;
  /** /assets/videos/ 경로 */
  url: string;
  /** 영상 제목 */
  title: string;
  /** 채널 이름 */
  channel: string;
  /** 조회수 (숫자, 예: 12000) */
  viewCount: number;
  /** 업로드 경과 표시 문자열 (예: "2일 전") */
  uploadedAt: string;
  /** 재생 길이 표시 문자열 (예: "10:24") */
  duration: string;
  /** 썸네일 이미지 경로 (없으면 thumbnailColor 폴백) */
  thumbnailUrl?: string;
  /** 썸네일 배경 CSS (color 또는 gradient) */
  thumbnailColor: string;
  /** 채널 아바타 배경색 */
  avatarColor: string;
  /** 채널 아바타 이니셜 */
  avatarLetter: string;
}
export type AdType = '5s_skip' | '15s_fixed';

export interface ConditionConfig {
  videoCount: 1 | 2;
  adType: AdType;
  video1Speed: number | null;
  video1ShowSavedTime: boolean | null;
  /** 첫 번째 영상에서 표시할 아낀 시간 상한 (null이면 mainSavedTimeCap 사용) */
  video1SavedTimeCap: number | null;
  mainSpeed: number;
  mainShowSavedTime: boolean;
  mainSavedTimeCap: number;
}

export type ExperimentPhase =
  | { type: 'feed'; video1Watched: boolean }
  | {
      type: 'watch';
      videoUrl: string;
      showAd: boolean;
      adType: AdType | null;
      speed: number;
      showSavedTime: boolean;
      savedTimeCap: number;
      isVideo1: boolean;
    };
