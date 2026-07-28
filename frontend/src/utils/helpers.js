// ─── Date Helpers ──────────────────────────────────────────────────────────

/**
 * Formats an ISO date string to a readable format.
 * e.g. "2024-03-15T10:30:00Z" → "15 Mar 2024"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr; // Return as-is if already formatted
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Returns today's date as YYYY-MM-DD (for default form value).
 */
export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns how many days ago a date was.
 * e.g. "3 days ago", "Today"
 */
export function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

// ─── Severity / Status Styling ─────────────────────────────────────────────

/**
 * Returns Tailwind CSS classes for severity badges.
 */
export function getSeverityClasses(severity) {
  const map = {
    Critical: 'bg-red-100 text-red-700 border border-red-200',
    Major:    'bg-yellow-100 text-yellow-700 border border-yellow-200',
    Minor:    'bg-green-100 text-green-700 border border-green-200',
  };
  return map[severity] || 'bg-gray-100 text-gray-600 border border-gray-200';
}

/**
 * Returns Tailwind CSS classes for status badges.
 */
export function getStatusClasses(status) {
  const map = {
    'Open':                 'bg-blue-100 text-blue-700 border border-blue-200',
    'Under Investigation':  'bg-orange-100 text-orange-700 border border-orange-200',
    'Pending CAPA':         'bg-purple-100 text-purple-700 border border-purple-200',
    'Closed':               'bg-gray-100 text-gray-500 border border-gray-200',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
}

/**
 * Returns the dot color for status indicators.
 */
export function getStatusDotColor(status) {
  const map = {
    'Open':                 'bg-blue-500',
    'Under Investigation':  'bg-orange-500',
    'Pending CAPA':         'bg-purple-500',
    'Closed':               'bg-gray-400',
  };
  return map[status] || 'bg-gray-400';
}

// ─── Risk Score Helpers ─────────────────────────────────────────────────────

/**
 * Returns a color for the risk score bar.
 */
export function getRiskBarColor(score) {
  if (score >= 70) return 'bg-red-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-green-500';
}

/**
 * Returns human-readable risk label from score.
 */
export function getRiskLabel(score) {
  if (score >= 70) return 'Critical';
  if (score >= 40) return 'Major';
  return 'Minor';
}

// ─── String Helpers ─────────────────────────────────────────────────────────

/**
 * Truncates text to a max length and adds ellipsis.
 */
export function truncate(text, maxLength = 80) {
  if (!text) return '—';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

/**
 * Capitalises the first letter of a string.
 */
export function capitalise(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── Form Helpers ───────────────────────────────────────────────────────────

/**
 * Counts how many fields in a form object are filled (non-null, non-empty).
 */
export function countFilledFields(formData, fields) {
  return fields.filter(f => formData[f] && formData[f].toString().trim() !== '').length;
}

/**
 * Core required fields for a complaint to be considered complete.
 */
export const REQUIRED_COMPLAINT_FIELDS = [
  'complainant_name',
  'product_name',
  'batch_number',
  'date_received',
  'category',
  'description',
];

/**
 * Returns a completeness percentage (0-100) for a complaint form.
 */
export function getCompletenessScore(formData) {
  const filled = countFilledFields(formData, REQUIRED_COMPLAINT_FIELDS);
  return Math.round((filled / REQUIRED_COMPLAINT_FIELDS.length) * 100);
}

// ─── Misc ───────────────────────────────────────────────────────────────────

/**
 * Generates a display-friendly complaint number if one doesn't exist yet.
 */
export function placeholderComplaintNumber() {
  const year = new Date().getFullYear();
  return `CC-${year}-XXXX`;
}

/**
 * Maps a file MIME type to a readable label.
 */
export function getFileTypeLabel(mimeType = '') {
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('image')) return 'Image';
  if (mimeType.includes('word') || mimeType.includes('docx')) return 'Word Doc';
  if (mimeType.includes('text')) return 'Text File';
  return 'Document';
}