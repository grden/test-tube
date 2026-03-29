import type { ConditionId, ConditionConfig } from '../types';

export const CONDITIONS: Record<ConditionId, ConditionConfig> = {
  control: {
    videoCount: 1,
    adType: '5s_skip',
    video1Speed: 1.0,
    video1ShowSavedTime: false,
    mainSpeed: 1.0,
    mainShowSavedTime: false,
  },
  a1: {
    videoCount: 1,
    adType: '15s_fixed',
    video1Speed: 1.0,
    video1ShowSavedTime: false,
    mainSpeed: 1.05,
    mainShowSavedTime: true,
  },
  a2: {
    videoCount: 1,
    adType: '5s_skip',
    video1Speed: 1.0,
    video1ShowSavedTime: false,
    mainSpeed: 1.05,
    mainShowSavedTime: true,
  },
  b1: {
    videoCount: 2,
    adType: '15s_fixed',
    video1Speed: 1.05,
    video1ShowSavedTime: true,
    mainSpeed: 1.0,
    mainShowSavedTime: false,
  },
  b2: {
    videoCount: 2,
    adType: '5s_skip',
    video1Speed: 1.05,
    video1ShowSavedTime: true,
    mainSpeed: 1.0,
    mainShowSavedTime: false,
  },
};

export function isValidCondition(id: string): id is ConditionId {
  return ['control', 'a1', 'a2', 'b1', 'b2'].includes(id);
}
