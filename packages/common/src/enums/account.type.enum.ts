export enum AccountTypeEnum {
  SYSTEM = 'system',
  CUSTOM = 'custom',
}

export type AccountType = 'system' | 'custom' | string;

const accountTypeMessages: Record<AccountType, string> = {
  [AccountTypeEnum.SYSTEM]: '系统用户',
  [AccountTypeEnum.CUSTOM]: '终端用户',
};

export function getAccountTypeMessage(
  acctype: AccountTypeEnum | string,
): string {
  return typeof acctype === 'string'
    ? (accountTypeMessages[acctype as string] ?? acctype)
    : (accountTypeMessages[(acctype as AccountTypeEnum).valueOf()] ??
        (acctype as AccountTypeEnum).valueOf());
}
