/** Mirror of game-server/server.js reach bonuses for client visuals. */
export const STEAL_RADIUS_BONUS = 1.35;
export const PICKUP_RADIUS_BONUS = 1.25;
export const BALL_CONTROL_RADIUS = 1.5;

/** Mirror of game-server/physics/collisions.js CHARACTER_STATS for client visuals. */
export const CHARACTER_STATS = {
  player: { speedMultiplier: 1.35, controlRadius: 1.35, shotMultiplier: 0.85, radius: 0.5 },
  pig: { speedMultiplier: 0.82, controlRadius: 1.85, shotMultiplier: 1.3, radius: 0.58 },
  lizard: { speedMultiplier: 1.35, controlRadius: 1.35, shotMultiplier: 0.85, radius: 0.5 },
  turtle: { speedMultiplier: 0.82, controlRadius: 1.85, shotMultiplier: 1.3, radius: 0.58 },
};

export function getCharacterStats(characterType) {
  return CHARACTER_STATS[characterType] || CHARACTER_STATS.player;
}

export function getStealRadius(characterType) {
  const stats = getCharacterStats(characterType);
  return (stats.controlRadius || BALL_CONTROL_RADIUS) * STEAL_RADIUS_BONUS;
}

export function getPickupRadius(characterType) {
  const stats = getCharacterStats(characterType);
  return (stats.controlRadius || BALL_CONTROL_RADIUS) * PICKUP_RADIUS_BONUS;
}

/** Visual Y offset for player meshes (matches server collision radius). */
export function getPlayerVisualY(characterType) {
  return getCharacterStats(characterType).radius;
}
