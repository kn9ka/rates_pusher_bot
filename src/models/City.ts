export const City = {
  LOS_ANGELES: 'LOSAN',
  MIAMI: 'MIAMI',
  NEW_YORK: 'NEWYORK',
  CHICAGO: 'CHCG',
  ORANGE_COUNTY: 'ORANGE_COUNTY',
} as const;

export type City = (typeof City)[keyof typeof City];
