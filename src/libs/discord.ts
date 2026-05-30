const ROLE_MAP: Record<string, string> = {
  '1454594433965359165': "owner", // Lead Developer
  '1500426556160348360': "admin", // Manging Director
  '1501295951405645926': "developer", // engineering team
  '1500426637744013422': "staff", // Team Boostify role
  '1500439003672088588': "contributor" // contributor, as you guessed
};

export function resolveRole(discordRoles: string[]): string {
  for (const roleId of discordRoles) {
    if (ROLE_MAP[roleId]) return ROLE_MAP[roleId];
  }
  return "guest";
}