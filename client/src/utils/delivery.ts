/**
 * Utility functions for generating smart delivery app links (Grab & LINE MAN)
 */

export const getLineManUrl = (restaurant: {
  name: string;
  sourceUrl?: string;
  lineManUrl?: string;
}): string => {
  if (restaurant.lineManUrl && restaurant.lineManUrl.trim()) {
    return restaurant.lineManUrl.trim();
  }
  // Wongnai is integrated with LINE MAN (LINE MAN Wongnai) and has direct order buttons
  if (restaurant.sourceUrl && restaurant.sourceUrl.includes('wongnai.com')) {
    return restaurant.sourceUrl;
  }
  return `https://www.google.com/search?q=${encodeURIComponent('LINE MAN ' + restaurant.name)}`;
};

export const getGrabUrl = (restaurant: {
  name: string;
  grabUrl?: string;
}): string => {
  if (restaurant.grabUrl && restaurant.grabUrl.trim()) {
    return restaurant.grabUrl.trim();
  }
  return `https://food.grab.com/th/th/restaurants?search=${encodeURIComponent(restaurant.name)}`;
};
