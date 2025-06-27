export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  avatar_url: string;
}

export const fetchUserProfile = async (lat: string): Promise<UserProfile> => {
  if (!lat) {
    throw new Error('A valid LAT (Limited Access Token) is required.');
  }

  const response = await fetch(
    `https://api-dev.youversion.com/auth/me?lat=${lat}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch user profile: ${response.status} ${errorText}`
    );
  }

  const data: UserProfile = await response.json();
  return data;
}; 