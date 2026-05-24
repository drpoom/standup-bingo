/**
 * SceneManager.ts - Manages Three.js scene, renderer, and render loop
 * Handles scene initialization, resize events, and rendering
 */

import * as THREE from 'three';

export interface SceneManagerOptions {
  antialias?: boolean;
  alpha?: boolean;
  pixelRatio?: number;
  clearColor?: string | number;
  shadowMapEnabled?: boolean;
}

export class SceneManager {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  clock: THREE.Clock;
  camera: THREE.Camera | null;

  private clearColor: THREE.Color;
  private pixelRatio: number;

  constructor(options?: SceneManagerOptions) {
    // Create scene
    this.scene = new THREE.Scene();

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: options?.antialias ?? true,
      alpha: options?.alpha ?? false,
    });

    // Set pixel ratio (clamped to max 2 to prevent high DPR from killing mobile FPS)
    this.pixelRatio = options?.pixelRatio ?? Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(this.pixelRatio);

    // Set clear color
    if (options?.clearColor !== undefined) {
      this.clearColor = new THREE.Color(options.clearColor);
    } else {
      this.clearColor = new THREE.Color(0x1a1a2e);
    }
    this.renderer.setClearColor(this.clearColor);

    // Enable shadow map if requested
    if (options?.shadowMapEnabled ?? true) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    // Initialize clock
    this.clock = new THREE.Clock();

    // Camera will be set externally or created by caller
    this.camera = null;

    // Setup resize handler
    this.setupResizeHandler();
  }

  /**
   * Initialize the renderer canvas into a container element
   */
  init(container: HTMLElement): this {
    container.appendChild(this.renderer.domElement);
    this.setSize(container.clientWidth, container.clientHeight);
    return this;
  }

  /**
   * Set the camera to use for rendering
   */
  setCamera(camera: THREE.Camera): this {
    this.camera = camera;
    return this;
  }

  /**
   * Get the scene instance
   */
  getScene(): THREE.Scene {
    return this.scene;
  }

  /**
   * Get the renderer instance
   */
  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  /**
   * Get the clock instance
   */
  getClock(): THREE.Clock {
    return this.clock;
  }

  /**
   * Get the current camera
   */
  getCamera(): THREE.Camera | null {
    return this.camera;
  }

  /**
   * Set renderer size
   */
  setSize(width: number, height: number): this {
    this.renderer.setSize(width, height);
    return this;
  }

  /**
   * Render the scene with the camera
   */
  render(): void {
    if (!this.camera) {
      console.warn('SceneManager: No camera set for rendering');
      return;
    }

    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Render with delta time update (for animations)
   */
  renderWithDelta(): number {
    const deltaTime = this.clock.getDelta();
    this.render();
    return deltaTime;
  }

  /**
   * Setup window resize handler
   */
  private setupResizeHandler(): void {
    const onResize = () => {
      // Find the parent container to get new dimensions
      const container = this.renderer.domElement.parentElement;
      if (container) {
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.setSize(width, height);

        // Update camera aspect ratio if it's a PerspectiveCamera or OrthographicCamera
        if (this.camera) {
          if (this.camera instanceof THREE.PerspectiveCamera) {
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
          } else if (this.camera instanceof THREE.OrthographicCamera) {
            this.camera.left = -width / 2;
            this.camera.right = width / 2;
            this.camera.top = height / 2;
            this.camera.bottom = -height / 2;
            this.camera.updateProjectionMatrix();
          }
        }
      }
    };

    window.addEventListener('resize', onResize);
  }

  /**
   * Manually trigger resize (useful for testing or programmatic resize)
   */
  resize(width: number, height: number): this {
    this.setSize(width, height);

    // Update camera aspect ratio
    if (this.camera) {
      if (this.camera instanceof THREE.PerspectiveCamera) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
      } else if (this.camera instanceof THREE.OrthographicCamera) {
        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -height / 2;
        this.camera.updateProjectionMatrix();
      }
    }

    return this;
  }

  /**
   * Add an object to the scene
   */
  addToScene(object: THREE.Object3D): this {
    this.scene.add(object);
    return this;
  }

  /**
   * Remove an object from the scene
   */
  removeFromScene(object: THREE.Object3D): this {
    this.scene.remove(object);
    return this;
  }

  /**
   * Set scene background color
   */
  setBackgroundColor(color: string | number): this {
    this.clearColor = new THREE.Color(color);
    this.renderer.setClearColor(this.clearColor);
    return this;
  }

  /**
   * Clear the scene (remove all children)
   */
  clearScene(): this {
    // Remove all children from scene
    while (this.scene.children.length > 0) {
      const child = this.scene.children[0];
      this.scene.remove(child);
      
      // Dispose geometries and materials if applicable
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    }
    return this;
  }

  /**
   * Dispose renderer and cleanup
   */
  dispose(): void {
    window.removeEventListener('resize', this.setupResizeHandler);
    this.clearScene();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
