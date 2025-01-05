/**
 * Check if the password is strong enough
 * one lowercase letter, one uppercase letter, one number, one special character
 * at least 8 characters
 */
export function isStrongPassword(password: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    password,
  );
}

/**
 * Check if the password is middle security
 * one lowercase or uppercase  letter, one number
 * at least 6 characters
 * @param password string
 * @returns boolean
 */
export function isMiddelPassword(password: string): boolean {
  return /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(password);
}

/**
 * Check if the password is simple
 * one lowercase or uppercase  letter
 * at least 6 characters
 * @param password string
 * @returns boolean
 */
export function isSimplePassword(password: string): boolean {
  return /^(?=.*[a-zA-Z0-9])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
}
