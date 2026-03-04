/**
 * Strip HTML tags from a string
 */
export function stripHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp;
    .replace(/&amp;/g, '&') // Replace &amp;
    .replace(/&lt;/g, '<') // Replace &lt;
    .replace(/&gt;/g, '>') // Replace &gt;
    .replace(/&quot;/g, '"') // Replace &quot;
    .replace(/&#39;/g, "'") // Replace &#39;
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim()
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text: string, maxLength: number = 150): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Strip HTML and truncate for previews
 */
export function previewText(html: string, maxLength: number = 150): string {
  return truncate(stripHtml(html), maxLength)
}