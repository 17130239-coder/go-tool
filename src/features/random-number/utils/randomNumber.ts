/**
 * Generates a random integer within an inclusive [min, max] range.
 */
export function generateRandomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
