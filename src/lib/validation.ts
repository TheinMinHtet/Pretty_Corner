/**
 * Normalizes Myanmar numerals (၀-၉) to standard ASCII digits (0-9)
 */
export function normalizeMyanmarDigits(input: string): string {
  const mmDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
  return input.replace(/[၀-၉]/g, (char) => mmDigits.indexOf(char).toString());
}

/**
 * Validates phone numbers according to the required Myanmar formats:
 * - Must start with 09, 01, or +959
 * - Must be followed by 6 to 10 digits
 * - Starting with anything else or not having 6-10 digits following the prefix is invalid
 */
export function validatePhoneNumber(phone: string): { isValid: boolean; error?: string } {
  const trimmed = phone.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Phone number is required.' };
  }

  // Normalize Myanmar Unicode digits (၀-၉) to ASCII (0-9)
  const normalized = normalizeMyanmarDigits(trimmed);

  // Remove whitespace, dashes, parentheses, dots
  const cleaned = normalized.replace(/[\s\-\(\)\.]/g, '');

  // Must consist only of digits with optional leading '+'
  if (!/^\+?[0-9]+$/.test(cleaned)) {
    return { isValid: false, error: 'Phone number can only contain numbers.' };
  }

  // Must start with 09, 01, or +959
  const startsWithValidPrefix =
    cleaned.startsWith('09') ||
    cleaned.startsWith('01') ||
    cleaned.startsWith('+959');

  if (!startsWithValidPrefix) {
    return {
      isValid: false,
      error: 'Phone number must start with 09, 01, or +959.',
    };
  }

  // Check digits that follow the prefix: 6 to 10 numbers
  let suffix = '';
  if (cleaned.startsWith('+959')) {
    suffix = cleaned.slice(4);
  } else if (cleaned.startsWith('09') || cleaned.startsWith('01')) {
    suffix = cleaned.slice(2);
  }

  if (suffix.length < 6 || suffix.length > 10 || !/^\d+$/.test(suffix)) {
    return {
      isValid: false,
      error: 'Phone number must have 6 to 10 digits following 09, 01, or +959.',
    };
  }

  return { isValid: true };
}
