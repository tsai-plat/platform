import { LocaleType } from './exception.types';
import zhCNMessages from './locales/cn';
import enUSMessages from './locales/en';

export const localeMessages = (
  locale: LocaleType = 'zhCN',
): Record<number, string> => {
  switch (locale) {
    case 'enUS':
      return enUSMessages;
    case 'zhCN':
      return zhCNMessages;
    default:
      return enUSMessages;
  }
};
