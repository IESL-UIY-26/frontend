import type { IUser, ProfileData } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL as string;

export const authAPI = {
  syncUser: async (accessToken: string, profile?: Partial<ProfileData>): Promise<IUser> => {
    const response = await fetch(`${API_URL}/api/auth/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(profile ?? {}),
    });
    const json = await response.json();
    return json.data;
  },
};
