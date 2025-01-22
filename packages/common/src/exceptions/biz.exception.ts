import { ErrorCodeEnum } from './error.code.enum';
import { localeMessages } from './error.message';
import { BizErrorOptionType, LocaleType } from './exception.types';

export class BizException extends Error {
  private readonly _code: number;
  private _error: string | string[] | undefined;
  private _locale: LocaleType = 'zhCN';

  constructor(code: number, message: string, options?: BizErrorOptionType) {
    super(message);
    this._code = code;
    const { locale = 'zhCN', error } = options || { locale: 'zhCN' };
    this._locale = locale;
    if (error) this._error = error;
  }

  set message(message: string) {
    this.message = message;
  }

  get code(): number {
    return this._code;
  }

  get error(): string | string[] | undefined {
    return this._error;
  }

  set error(err: string | string[]) {
    this._error = err;
  }

  get message() {
    return super.message;
  }

  static createError(
    code: BizException | number,
    message?: string,
    options?: BizErrorOptionType,
  ) {
    const { locale = 'enUS' } = options || {};

    let localeMessage = message;
    const messages: Record<number, string> = localeMessages(locale);
    const c = code.valueOf() as unknown as number;
    if (messages[c] && !message?.length) {
      localeMessage = messages[c];
    }

    if (!localeMessage) localeMessage = String(code.valueOf());

    return new BizException(c, message, options);
  }

  static IllegalParamterError(message?: string, options?: BizErrorOptionType) {
    const { locale = 'enUS' } = options || {};

    let localeMessage;
    const code = ErrorCodeEnum.ILLEGAL_ARGS;
    const messages: Record<number, string> = localeMessages(locale);
    if (message?.length) {
      localeMessage = message;
    } else {
      localeMessage = messages[code.valueOf()] ?? code.valueOf().toString();
    }

    return new BizException(code, localeMessage);
  }

  /**
   *
   * @param message
   * @param options
   *
   */
  static ParameterInvalidError(
    message: string = '',
    options?: BizErrorOptionType,
  ) {
    const { locale = 'enUS' } = options || {};
    let localeMessage = message;
    const code = ErrorCodeEnum.PARAMS_INVALID;
    if (!localeMessage?.length) {
      const messages: Record<number, string> = localeMessages(locale);

      if (messages[code.valueOf()]) {
        localeMessage = messages[code.valueOf()];
      } else {
        localeMessage = `Input parameter invalid.`;
      }
    }

    return new BizException(code, localeMessage);
  }

  /**
   * app bootstrap loading configuration error.
   * @param message
   * @param options
   * @returns configuration error
   */
  static ConfigurationError(
    message: string = 'Please check your configuration yaml.',
    options?: BizErrorOptionType,
  ) {
    const { locale = 'enUS' } = options || {};
    let localeMessage = message;

    const code = ErrorCodeEnum.CONFIGURATION_ERROR;

    if (!localeMessage?.length) {
      const messages: Record<number, string> = localeMessages(locale);

      if (messages[code.valueOf()]) {
        localeMessage = messages[code.valueOf()];
      } else {
        localeMessage = `Input parameter invalid.`;
      }
    }
    return new BizException(code, localeMessage);
  }
}
