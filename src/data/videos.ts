import type { VideoMeta } from '../types';

/**
 * 실험에서 사용되는 영상 목록
 *
 * 필드 설명
 * - id          : 고유 식별자 (변경 금지)
 * - url         : public/assets/videos/ 하위 파일 경로
 * - title       : 영상 제목
 * - channel     : 채널명
 * - viewCount   : 조회수 (숫자)
 * - uploadedAt  : 업로드 경과 표시 문자열 (예: "3일 전")
 * - duration    : 재생 길이 표시 문자열 (예: "10:24")
 * - thumbnailUrl   : public/ 하위 썸네일 이미지 경로 (없으면 thumbnailColor 폴백)
 * - thumbnailColor : 썸네일 배경 CSS (color or linear-gradient, 이미지 없을 때 폴백)
 * - avatarColor : 채널 아바타 배경색
 * - avatarLetter: 채널 아바타 이니셜
 */
export const VIDEOS: VideoMeta[] = [
  {
    id: 'subway',
    url: '/assets/videos/subway.mp4',
    title: '노선표에는 없는 숨겨진 지하철역이 있다?',
    channel: '진용진',
    viewCount: 3586962,
    uploadedAt: '6년 전',
    duration: '4:47',
    thumbnailUrl: '/thumbnail-subway.avif',
    thumbnailColor: 'linear-gradient(135deg, #1a3a6c 0%, #0d1f40 100%)',
    avatarColor: '#3ea6ff',
    avatarLetter: 'J',
  },
  {
    id: 'gas',
    url: '/assets/videos/gas.mp4',
    title: '주유소에 그많은 기름이 어디에있는걸까?',
    channel: '진용진',
    viewCount: 838969,
    uploadedAt: '6년 전',
    duration: '4:47',
    thumbnailUrl: '/thumbnail-gas.avif',
    thumbnailColor: 'linear-gradient(135deg, #6c3a1a 0%, #401f0d 100%)',
    avatarColor: '#3ea6ff',
    avatarLetter: 'J',
  },
  {
    id: 'video0349',
    url: '/assets/videos/0349.mp4',
    title: '예수천국 불신지옥 전도사분들은 왜 이렇게 피켓 디자인을 무섭게 하신 걸까?',
    channel: '진용진',
    viewCount: 178473,
    uploadedAt: '3일 전',
    duration: '3:49',
    thumbnailUrl: '/thumbnail-0349.avif',
    thumbnailColor: 'linear-gradient(135deg, #2a1a6c 0%, #100d40 100%)',
    avatarColor: '#3ea6ff',
    avatarLetter: 'J',
  },
  {
    id: 'monk',
    url: '/assets/videos/monk.mp4',
    title: '스님들은 절에 면접보고 들어가는걸까?',
    channel: '진용진',
    viewCount: 551331,
    uploadedAt: '4년 전',
    duration: '4:44',
    thumbnailUrl: '/thumbnail-monk.avif',
    thumbnailColor: 'linear-gradient(135deg, #2a1a6c 0%, #100d40 100%)',
    avatarColor: '#3ea6ff',
    avatarLetter: 'J',
  },
  {
    id: 'darama',
    url: '/assets/videos/drama.mp4',
    title: '드라마 촬영때 식사씬에서 남긴 음식들은 어떻게 처리할까?',
    channel: '진용진',
    viewCount: 2170838,
    uploadedAt: '4년 전',
    duration: '4:48',
    thumbnailUrl: '/thumbnail-drama.avif',
    thumbnailColor: 'linear-gradient(135deg, #2a1a6c 0%, #100d40 100%)',
    avatarColor: '#3ea6ff',
    avatarLetter: 'J',
  },
  {
    id: 'marble',
    url: '/assets/videos/marble.mp4',
    title: '구슬 속에 들어있는 건 정체가 뭘까?',
    channel: '진용진',
    viewCount: 4644288,
    uploadedAt: '5년 전',
    duration: '3:48',
    thumbnailUrl: '/thumbnail-marble.avif',
    thumbnailColor: 'linear-gradient(135deg, #2a1a6c 0%, #100d40 100%)',
    avatarColor: '#3ea6ff',
    avatarLetter: 'J',
  },
];

/** 조회수 숫자를 한국어 표시 문자열로 변환 (예: 12000 → "조회수 1.2만회") */
export function formatViewCount(n: number): string {
  if (n >= 10000) return `조회수 ${(n / 10000).toFixed(0).replace(/\.0$/, '')}만회`;
  return `조회수 ${n.toLocaleString('ko-KR')}회`;
}

/** id로 영상 메타 조회. 없으면 undefined */
export function getVideoById(id: string): VideoMeta | undefined {
  return VIDEOS.find((v) => v.id === id);
}

/** control / a1 조건의 메인 영상 */
export const VIDEO_SUBWAY = VIDEOS[0];
/** b1 조건의 첫 번째 영상 (1.05x 배속) */
export const VIDEO_GAS = VIDEOS[1];
/** b1 조건의 두 번째 영상 (광고 후 재생) */
export const VIDEO_0349 = VIDEOS[2];
/** b2 조건의 두 번째 영상 (광고 후 재생) */
export const VIDEO_MARBLE = VIDEOS[5];
/** b2 조건의 첫 번째 영상 (1.05x 배속) */
export const VIDEO_MONK = VIDEOS[3];
/** a2 조건의 메인 영상 */
export const VIDEO_DRAMA = VIDEOS[4];
