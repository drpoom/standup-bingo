/**
 * Game Settings Composable
 * Persists game settings to localStorage with graceful error handling.
 *
 * @module useGameSettings
 */

const STORAGE_KEY = 'elangoSurfersSettings';

/**
 * Returns the default settings object.
 *
 * @returns {Object} Default settings with version and feature toggles
 */
function getDefaultSettings() {
  return {
    version: 1,
    soundEnabled: true,    // master toggle
    musicEnabled: true,    // background music
    sfxEnabled: true,      // sound effects
    sensorEnabled: false   // tilt/accelerometer controls
  };
}

/**
 * Loads settings from localStorage.
 * Returns defaults if localStorage is unavailable or no settings exist.
 *
 * @returns {Object} Settings object (stored or defaults)
 */
function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Return stored settings if they have a version key
      if (parsed && typeof parsed.version === 'number') {
        return parsed;
      }
    }
  } catch (error) {
    // localStorage unavailable (private browsing, disabled, quota exceeded, etc.)
    console.warn('Failed to load settings from localStorage:', error.message);
  }
  return getDefaultSettings();
}

/**
 * Saves settings to localStorage.
 * Handles errors gracefully (private browsing, disabled, quota exceeded).
 *
 * @param {Object} settings - Settings object to save
 * @returns {boolean} True if save succeeded, false otherwise
 */
function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.warn('Failed to save settings to localStorage:', error.message);
    return false;
  }
}

/**
 * Resets settings to defaults and clears localStorage.
 *
 * @returns {Object} Default settings object
 */
function resetToDefaults() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Failed to clear settings from localStorage:', error.message);
  }
  return getDefaultSettings();
}

export {
  getDefaultSettings,
  loadSettings,
  saveSettings,
  resetToDefaults
};
