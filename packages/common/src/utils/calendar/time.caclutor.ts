import {
  addDays,
  addSeconds,
  addHours,
  addMonths,
  addWeeks,
  addYears,
  addMinutes,
} from 'date-fns';

export const increaseDay = (
  from: Date | number | string,
  amount: number,
): Date => {
  return addDays(from, amount);
};

/**
 *
 * @param from date,number or date string
 * @param amount 1d,1s,1h,1w,1m or 1y ,if amount is an number default seconds
 * @returns Date
 */
export const increaseDate = (
  from: Date | number | string,
  amount: string | number,
): Date => {
  const strAmount: string = String(amount);
  const len = strAmount.length;
  if (typeof amount === 'number') {
    return addSeconds(from, amount as number);
  } else if (/^\d+d$/.test(amount)) {
    return addDays(from, Number(strAmount.substring(0, len - 1)));
  } else if (/^\d+h$/.test(amount)) {
    return addHours(from, Number(strAmount.substring(0, len - 1)));
  } else if (/^\d+m$/.test(amount)) {
    return addMinutes(from, Number(strAmount.substring(0, len - 1)));
  } else if (/^\d+M$/.test(amount)) {
    return addMonths(from, Number(strAmount.substring(0, len - 1)));
  } else if (/^\d+s$/.test(amount)) {
    return addSeconds(from, Number(strAmount.substring(0, len - 1)));
  } else if (/^\d+w$/.test(amount)) {
    return addWeeks(from, Number(strAmount.substring(0, len - 1)));
  } else if (/^\d+y$/.test(amount)) {
    return addYears(from, Number(strAmount.substring(0, len - 1)));
  } else {
    throw new Error(`Parameter amount illegal ${amount}.`);
  }
};
