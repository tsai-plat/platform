import { format } from 'date-fns';

//
// @see https://date-fns.org/v4.1.0/docs/format
export const DB_DATETIME_EXPR = 'yyyy-MM-dd HH:mm:ss.SSSS';

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

/**
 *
 * @param date
 * string yyyy-MM-dd
 * number ms
 * date
 * @param expr
 * @returns
 */
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

/**
 * @see https://date-fns.org/v4.1.0/docs/format
 * 2024-06-11 17:15:50.560170
 * @param input number |string Date
 * @returns string
 */
export const convertDBTimeString = (input: string | number | Date): string => {
  if (!input) throw new Error('input an number,string or date required.');
  if (input instanceof Date)
    return format(input as unknown as Date, DB_DATETIME_EXPR);

  const d =
    typeof input === 'string' && /^[\d]{10,}/.test(input)
      ? new Date(parseInt(input))
      : new Date(input);

  return format(d, DB_DATETIME_EXPR);
};
