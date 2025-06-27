export interface YouVersionLoginOptions {
    appId: string;
    language?: string;
    requiredPerms?: string[];
    optionalPerms?: string[];
    onSuccess: (result: LoginSuccess) => void;
    onError: (error: LoginError) => void;
}
export interface LoginSuccess {
    lat: string;
    yvpUserId: string;
    grants: string[];
    session: string;
}
export interface LoginError {
    message: string;
    session?: string;
}
export declare const useYouVersionLogin: ({ appId, language, requiredPerms, optionalPerms, onSuccess, onError, }: YouVersionLoginOptions) => {
    login: () => void;
};
export declare const processLoginCallback: () => void;
