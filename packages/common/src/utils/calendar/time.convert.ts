import { increaseDate } from './time.caclutor';

/**
 * 將 1d or 1m 轉換成 seconds value
 * @param value
 *  if value is number will return value
 * @returns duration seconds
 *
 */
export const convertDurationVolumeToSeconds = (
  duration: string | number,
): number => {
  if (typeof duration === 'number') return duration;
  if (!/^\d+(d|h|m|M|s|w|y)$/.test(duration))
    throw new Error(`Parameter value illegal ${duration}.`);
  const strAmount: string = String(duration);

  const now = new Date().valueOf();
  const durationVal = increaseDate(now, strAmount);

  return Math.floor((durationVal.valueOf() - now) / 1000);
};
