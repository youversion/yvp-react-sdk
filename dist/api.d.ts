export interface UserProfile {
    id: number;
    first_name: string;
    last_name: string;
    avatar_url: string;
}
export declare const fetchUserProfile: (lat: string) => Promise<UserProfile>;
