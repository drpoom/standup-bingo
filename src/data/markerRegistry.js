/**
 * Marker registry for bingo square markers by theme.
 * Provides a centralized mapping of theme IDs to marker assets.
 * 
 * To add a new theme marker:
 * 1. Add the marker SVG file to src/assets/markers/
 * 2. Import it below
 * 3. Add an entry to MARKER_REGISTRY with the theme ID as key
 */

// Import all marker assets
import defaultMarker from '../assets/markers/default-marker.svg'
import embeddedMarker from '../assets/markers/embedded-marker.svg'

/**
 * Registry mapping theme IDs to their marker asset paths.
 * Add new themes here as they are created.
 */
export const MARKER_REGISTRY = {
  'default': defaultMarker,
  'embedded': embeddedMarker
}

/**
 * Get the marker path for a given theme ID.
 * Falls back to default marker if theme is not found.
 * 
 * @param {string} themeId - The theme ID to get marker for
 * @returns {string} The marker asset path
 */
export function getMarkerForTheme(themeId) {
  return MARKER_REGISTRY[themeId] || MARKER_REGISTRY['default']
}

/**
 * Get all available marker theme IDs.
 * Useful for UI selectors or validation.
 * 
 * @returns {string[]} Array of available theme IDs
 */
export function getAvailableMarkerThemes() {
  return Object.keys(MARKER_REGISTRY)
}

/**
 * Check if a marker exists for a given theme ID.
 * 
 * @param {string} themeId - The theme ID to check
 * @returns {boolean} True if marker exists for theme
 */
export function hasMarkerForTheme(themeId) {
  return themeId in MARKER_REGISTRY
}
