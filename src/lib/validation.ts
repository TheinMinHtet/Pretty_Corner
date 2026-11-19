/**
 * Validates phone numbers with specific support for Myanmar mobile formats (MPT, ATOM/Telenor, Ooredoo, MyTel)
 * as well as standard international numbers.
 */
export function validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Phone number is required.' };
  }

  // Remove whitespace, dashes, parentheses, dots
  const cleaned = trimmed.replace(/[\s\-\(\)\.]/g, '');

  // Must consist only of optional leading '+' and digits
  if (!/^\+?[0-9]+$/.test(cleaned)) {
    return { isValid: false, error: 'Phone number can only contain numbers.' };
  }

  // Myanmar formats:
  // 09 followed by 7-9 digits (total 9-11 digits)
  // +959 or 959 followed by 7-9 digits (total 10-12 digits without '+')
  // 9 followed by 7-9 digits
  const myanmarPattern = /^(?:\+?959|09|9)\d{7,9}$/;

  // General valid international phone number: 8 to 15 digits
  const internationalPattern = /^\+?[0-9]{8,15}$/;

  if (!myanmarPattern.test(cleaned) && !internationalPattern.test(cleaned)) {
    return {
      isValid: false,
      error: 'Please enter a valid Myanmar phone number (e.g., 09 765 432 100 or 09XXXXXXXXX).',
    };
  }

  return { isValid: true };
}
