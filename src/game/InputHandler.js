/**
 * InputHandler.js - Keyboard and touch input handling
 * Handles WASD/arrows for keyboard and touch buttons for mobile
 */

export class InputHandler {
  constructor() {
    // Current input state
    this.state = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      brake: false,
      handbrake: false,
      cameraLeft: false,
      cameraRight: false,
      cameraUp: false,
      cameraDown: false
    };

    // Key mappings
    this.keyMap = {
      forward: ['KeyW', 'ArrowUp'],
      backward: ['KeyS', 'ArrowDown'],
      left: ['KeyA', 'ArrowLeft'],
      right: ['KeyD', 'ArrowRight'],
      brake: ['Space'],
      handbrake: ['ShiftLeft', 'ShiftRight'],
      cameraLeft: ['KeyQ'],
      cameraRight: ['KeyE'],
      cameraUp: ['KeyR'],
      cameraDown: ['KeyF']
    };

    // Touch state
    this.touchState = {};
    this.touchButtons = {};

    // Callbacks
    this.callbacks = {
      onChange: [],
      onKeyPress: [],
      onKeyRelease: []
    };

    // Bound handlers
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundKeyUp = this.handleKeyUp.bind(this);
    this.boundTouchStart = this.handleTouchStart.bind(this);
    this.boundTouchEnd = this.handleTouchEnd.bind(this);

    // Is initialized
    this.isInitialized = false;

    // Is mobile/touch device
    this.isTouchDevice = this.detectTouchDevice();
  }

  /**
   * Detect if device supports touch
   */
  detectTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * Initialize input handlers
   */
  init() {
    if (this.isInitialized) return this;

    // Keyboard listeners
    window.addEventListener('keydown', this.boundKeyDown);
    window.addEventListener('keyup', this.boundKeyUp);

    // Touch listeners (if touch device or always for mobile controls)
    document.addEventListener('touchstart', this.boundTouchStart, { passive: false });
    document.addEventListener('touchend', this.boundTouchEnd);

    this.isInitialized = true;
    return this;
  }

  /**
   * Handle key down events
   */
  handleKeyDown(event) {
    const code = event.code;
    const action = this.getActionFromKey(code);

    if (action && !this.state[action]) {
      this.state[action] = true;
      this.notifyChange();
      this.notifyKeyPress(action);
      event.preventDefault();
    }
  }

  /**
   * Handle key up events
   */
  handleKeyUp(event) {
    const code = event.code;
    const action = this.getActionFromKey(code);

    if (action && this.state[action]) {
      this.state[action] = false;
      this.notifyChange();
      this.notifyKeyRelease(action);
      event.preventDefault();
    }
  }

  /**
   * Get action from key code
   */
  getActionFromKey(code) {
    for (const [action, keys] of Object.entries(this.keyMap)) {
      if (keys.includes(code)) {
        return action;
      }
    }
    return null;
  }

  /**
   * Handle touch start
   */
  handleTouchStart(event) {
    event.preventDefault();
    
    for (const touch of event.changedTouches) {
      const button = this.getTouchButton(touch.target);
      if (button) {
        this.touchState[button] = true;
        this.state[button] = true;
        this.notifyChange();
        this.notifyKeyPress(button);
      }
    }
  }

  /**
   * Handle touch end
   */
  handleTouchEnd(event) {
    event.preventDefault();
    
    for (const touch of event.changedTouches) {
      const button = this.getTouchButton(touch.target);
      if (button) {
        this.touchState[button] = false;
        this.state[button] = false;
        this.notifyChange();
        this.notifyKeyRelease(button);
      }
    }
  }

  /**
   * Get button action from touch target
   */
  getTouchButton(element) {
    if (!element) return null;
    const action = element.getAttribute('data-action');
    return action || null;
  }

  /**
   * Create touch control buttons in DOM
   */
  createTouchControls(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return this;

    container.innerHTML = '';
    container.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      z-index: 1000;
      pointer-events: none;
    `;

    // Directional pad (left side)
    const dpad = this.createDPad();
    container.appendChild(dpad);

    // Action buttons (right side)
    const actions = this.createActionButtons();
    container.appendChild(actions);

    // Camera controls (top right)
    const camera = this.createCameraControls();
    container.appendChild(camera);

    return this;
  }

  /**
   * Create directional pad
   */
  createDPad() {
    const dpad = document.createElement('div');
    dpad.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 60px);
      grid-template-rows: repeat(3, 60px);
      gap: 5px;
      pointer-events: auto;
    `;

    const buttons = [
      { action: 'forward', row: 0, col: 1, label: '▲' },
      { action: 'left', row: 1, col: 0, label: '◀' },
      { action: 'right', row: 1, col: 2, label: '▶' },
      { action: 'backward', row: 2, col: 1, label: '▼' }
    ];

    buttons.forEach(btn => {
      const button = this.createTouchButton(btn.action, btn.label);
      button.style.cssText = `
        width: 60px;
        height: 60px;
        background: rgba(255, 255, 255, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 10px;
        color: white;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        grid-row: ${btn.row + 1};
        grid-column: ${btn.col + 1};
        touch-action: manipulation;
      `;
      dpad.appendChild(button);
    });

    return dpad;
  }

  /**
   * Create action buttons
   */
  createActionButtons() {
    const container = document.createElement('div');
    container.style.cssText = `
      display: flex;
      gap: 15px;
      pointer-events: auto;
      align-items: flex-end;
    `;

    const buttons = [
      { action: 'brake', label: 'BRAKE', color: 'rgba(255, 100, 100, 0.5)' },
      { action: 'handbrake', label: 'DRIFT', color: 'rgba(255, 200, 100, 0.5)' }
    ];

    buttons.forEach(btn => {
      const button = this.createTouchButton(btn.action, btn.label);
      button.style.cssText = `
        width: 80px;
        height: 80px;
        background: ${btn.color};
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        color: white;
        font-size: 14px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        touch-action: manipulation;
      `;
      container.appendChild(button);
    });

    return container;
  }

  /**
   * Create camera controls
   */
  createCameraControls() {
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 10px;
      pointer-events: auto;
    `;

    const buttons = [
      { action: 'cameraLeft', label: '◀' },
      { action: 'cameraUp', label: '▲' },
      { action: 'cameraDown', label: '▼' },
      { action: 'cameraRight', label: '▶' }
    ];

    buttons.forEach(btn => {
      const button = this.createTouchButton(btn.action, btn.label);
      button.style.cssText = `
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.4);
        border-radius: 8px;
        color: white;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        touch-action: manipulation;
      `;
      container.appendChild(button);
    });

    return container;
  }

  /**
   * Create a touch button element
   */
  createTouchButton(action, label) {
    const button = document.createElement('button');
    button.setAttribute('data-action', action);
    button.textContent = label;
    button.setAttribute('data-action', action);
    
    // Prevent context menu on long press
    button.addEventListener('contextmenu', e => e.preventDefault());
    
    return button;
  }

  /**
   * Register change callback
   */
  onChange(callback) {
    this.callbacks.onChange.push(callback);
    return this;
  }

  /**
   * Register key press callback
   */
  onKeyPress(callback) {
    this.callbacks.onKeyPress.push(callback);
    return this;
  }

  /**
   * Register key release callback
   */
  onKeyRelease(callback) {
    this.callbacks.onKeyRelease.push(callback);
    return this;
  }

  /**
   * Notify change callbacks
   */
  notifyChange() {
    this.callbacks.onChange.forEach(cb => cb({ ...this.state }));
  }

  /**
   * Notify key press callbacks
   */
  notifyKeyPress(action) {
    this.callbacks.onKeyPress.forEach(cb => cb(action));
  }

  /**
   * Notify key release callbacks
   */
  notifyKeyRelease(action) {
    this.callbacks.onKeyRelease.forEach(cb => cb(action));
  }

  /**
   * Get current input state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Check if a specific input is active
   */
  isPressed(action) {
    return this.state[action] || false;
  }

  /**
   * Get driving inputs (forward, backward, left, right)
   */
  getDrivingInputs() {
    return {
      forward: this.state.forward,
      backward: this.state.backward,
      left: this.state.left,
      right: this.state.right
    };
  }

  /**
   * Get brake inputs
   */
  getBrakeInputs() {
    return {
      brake: this.state.brake,
      handbrake: this.state.handbrake
    };
  }

  /**
   * Get camera inputs
   */
  getCameraInputs() {
    return {
      left: this.state.cameraLeft,
      right: this.state.cameraRight,
      up: this.state.cameraUp,
      down: this.state.cameraDown
    };
  }

  /**
   * Reset all inputs
   */
  reset() {
    Object.keys(this.state).forEach(key => {
      this.state[key] = false;
    });
    this.notifyChange();
    return this;
  }

  /**
   * Destroy and remove all listeners
   */
  destroy() {
    window.removeEventListener('keydown', this.boundKeyDown);
    window.removeEventListener('keyup', this.boundKeyUp);
    document.removeEventListener('touchstart', this.boundTouchStart);
    document.removeEventListener('touchend', this.boundTouchEnd);
    this.isInitialized = false;
    return this;
  }

  /**
   * Check if device is touch-enabled
   */
  isTouch() {
    return this.isTouchDevice;
  }
}
