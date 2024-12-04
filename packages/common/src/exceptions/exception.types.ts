export type LocaleType = 'enUS' | 'zhCN';

export type BizErrorOptionType = {
  locale?: LocaleType;
  error?: string | string[];
} & Record<string, string | number>;
