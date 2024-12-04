export const CNF_PROP_VOLUME_YES = [1, 'on', 'y', 'yes', 'true', true];

export const convertYes = (v: string | number | boolean) =>
  CNF_PROP_VOLUME_YES.includes(v) ||
  CNF_PROP_VOLUME_YES.includes(String(v).toLocaleLowerCase());
