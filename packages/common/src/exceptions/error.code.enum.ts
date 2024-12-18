export enum ErrorCodeEnum {
  SUCCESS = 0,
  /** Http status extend */

  /** 4xx */
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  ILLEGAL_ARGS = 400,
  /** 5xx */
  SERVICE_INTERNAL_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
  DATA_RECORD_CONFLICT = 500100,
  DATA_RECORD_REMOVED = 500200,
}
