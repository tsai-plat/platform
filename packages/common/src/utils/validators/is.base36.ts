/**
 * 用于区分 username login type
 * @param name string
 * @returns boolean
 */
export function isB36Name(name: string): boolean {
  return /[0-9a-z]{6,16}/.test(name);
}
