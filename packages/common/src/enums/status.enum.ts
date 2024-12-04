export enum StatusEnum {
  FORBIDDEN = 0,
  NORMAL = 1,
}

export enum UserStatusEnum {
  FORBIDDEN = 0,
  GUEST = 1,
  NORMAL = 9,
}

export const UserStatusMessage = {
  0: 'Disable',
  1: 'Uncertified',
  9: 'Enable',
};
