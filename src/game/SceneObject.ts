/**
 * SceneObject interface for game scene objects
 * Defines the lifecycle methods for objects in the game scene
 */
export interface SceneObject {
  /**
   * Register the object with the scene
   * Called when the object is added to the scene
   */
  register(): void;

  /**
   * Update the object's state
   * Called every frame with delta time
   * @param delta - Time elapsed since last update in seconds
   */
  update(delta: number): void;

  /**
   * Dispose of the object and clean up resources
   * Called when the object is removed from the scene
   */
  dispose(): void;
}
