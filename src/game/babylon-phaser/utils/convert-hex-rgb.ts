import convert from "color-convert";

/**
 * Converts a hex color string to an RGB array normalized between 0 and 1.
 * @param hex - The hex color string (e.g., "#ffffff" or "fff")
 * @returns An array of three numbers [r, g, b] where each is between 0 and 1
 */
export const hex2rgb = (hex: string): [number, number, number] => {
  const [r, g, b] = convert.hex.rgb(hex);
  return [r / 255, g / 255, b / 255];
};
