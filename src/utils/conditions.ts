import type { ConditionId, ConditionConfig } from '../types';

export const CONDITIONS: Record<ConditionId, ConditionConfig> = {
  control: {
    videoCount: 1,
    adType: '15s_fixed',
    video1Speed: null,
    video1ShowSavedTime: null,
    video1SavedTimeCap: null,
    mainSpeed: 1.05,
    mainShowSavedTime: false,
    mainSavedTimeCap: 15,
  },
  a1: {
    videoCount: 1,
    adType: '10s_fixed',
    video1Speed: null,
    video1ShowSavedTime: null,
    video1SavedTimeCap: null,
    mainSpeed: 1.05,
    mainShowSavedTime: true,
    mainSavedTimeCap: 15,
  },
  a2: {
    videoCount: 1,
    adType: '10s_skip',
    video1Speed: null,
    video1ShowSavedTime: null,
    video1SavedTimeCap: null,
    mainSpeed: 1.05,
    mainShowSavedTime: true,
    mainSavedTimeCap: 15,
  },
  b1: {
    videoCount: 2,
    adType: '10s_fixed',
    video1Speed: 1.05,
    video1ShowSavedTime: true,
    video1SavedTimeCap: 15,
    mainSpeed: 1.05,
    mainShowSavedTime: true,
    mainSavedTimeCap: 11,
  },
  b2: {
    videoCount: 2,
    adType: '2x_5s_skip',
    video1Speed: 1.05,
    video1ShowSavedTime: true,
    video1SavedTimeCap: 15,
    mainSpeed: 1.05,
    mainShowSavedTime: true,
    mainSavedTimeCap: 11,
  },
};

export function isValidCondition(id: string): id is ConditionId {
  return ['control', 'a1', 'a2', 'b1', 'b2'].includes(id);
}
