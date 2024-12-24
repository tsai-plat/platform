import { format } from 'date-fns';

export const formatDate = (date?: any): string => {
  if (!date) date = new Date();
  if (date instanceof Date) {
    return format(date as unknown as Date, 'yyyy-MM-dd');
  }
  const _date = new Date(date);

  return format(_date, 'yyyy-MM-dd');
};

/**
 *
 * @param expr format expression like yyyy-MM-dd,default yyyyMMdd
 * @param date Date object or number or date string ,undefined will now
 * @returns string
 */
export const formatDateExpr = (
  date?: any,
  expr: string = 'yyyyMMdd',
): string => {
  if (!date) date = new Date();
  if (date instanceof Date) {
    return format(date as unknown as Date, expr);
  }
  const _date = new Date(date);

  return format(_date, expr);
};

export const formatDateTime = (
  date?: any,
  expr: string = 'yyyy-MM-dd HH:mm:ss',
): string => {
  if (!date) date = new Date();
  if (date instanceof Date) {
    return format(date as unknown as Date, expr);
  }
  const _date = new Date(date);

  return format(_date, expr);
};
