/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitizes HTML input to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  return input.replace(/[<>\"'&]/g, (match) => {
    const map: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    }
    return map[match]
  })
}

/**
 * Sanitizes log input to prevent log injection
 */
export function sanitizeLog(input: string): string {
  return input.replace(/[^a-zA-Z0-9\s\-_.,]/g, '')
}

/**
 * Validates and sanitizes numeric input
 */
export function sanitizeNumeric(input: string): number | null {
  const num = parseFloat(input.replace(/[^0-9.-]/g, ''))
  return isNaN(num) ? null : num
}

/**
 * Validates and sanitizes alphanumeric input
 */
export function sanitizeAlphanumeric(input: string): string {
  return input.replace(/[^a-zA-Z0-9\-_]/g, '')
}