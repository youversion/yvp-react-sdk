import { useEffect, useCallback } from 'react';

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

const YV_SESSION_KEY = 'yv_login_session';

export const useYouVersionLogin = ({
  appId,
  language = 'en',
  requiredPerms = [],
  optionalPerms = [],
  onSuccess,
  onError,
}: YouVersionLoginOptions) => {
  const login = useCallback(() => {
    console.log('Starting login, generating session...');
    const session =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    localStorage.setItem(YV_SESSION_KEY, session);
    console.log('Session stored:', session);

    const params = new URLSearchParams({
      app_id: appId,
      language,
      session,
    });
    if (requiredPerms.length > 0) {
      params.append('required_perms', requiredPerms.join(','));
    }
    if (optionalPerms.length > 0) {
      params.append('opt_perms', optionalPerms.join(','));
    }

    const loginUrl = `https://api-dev.youversion.com/auth/login?${params.toString()}`;

    window.open(loginUrl, 'yv-login-popup', 'width=600,height=800');
  }, [appId, language, requiredPerms, optionalPerms]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log('MESSAGE EVENT RECEIVED IN HOOK', event.data);
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, data } = event.data;

      if (type !== 'yv-login-callback') {
        console.log('Ignoring message of type:', type);
        return;
      }

      const storedSession = localStorage.getItem(YV_SESSION_KEY);
      localStorage.removeItem(YV_SESSION_KEY);

      console.log('>>> DEBUGGING SESSION <<<');
      console.log('Stored in localStorage:', storedSession);
      console.log('Received from callback:', data.session);
      console.log('>>> END DEBUGGING <<<');

      if (data.session !== storedSession) {
        console.error('SESSION MISMATCH!');
        onError({ message: 'Session mismatch.' });
        return;
      }

      if (data.status === 'success') {
        onSuccess({
          lat: data.lat,
          yvpUserId: data.yvp_user_id,
          grants: data.grants ? data.grants.split(',') : [],
          session: data.session,
        });
      } else {
        onError({
          message: 'Login failed.',
          session: data.session,
        });
      }
    };
    console.log('Setting up message listener...');
    window.addEventListener('message', handleMessage);

    return () => {
      console.log('Cleaning up message listener.');
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return { login };
};

export const processLoginCallback = () => {
  const params = new URLSearchParams(window.location.search);
  const data = {
    lat: params.get('lat'),
    status: params.get('status'),
    yvp_user_id: params.get('yvp_user_id'),
    grants: params.get('grants'),
    session: params.get('session'),
  };

  if (window.opener) {
    window.opener.postMessage(
      { type: 'yv-login-callback', data },
      window.location.origin
    );
    window.close();
  } else {
    console.error(
      'No opener window found. This page should be opened as a popup.'
    );
  }
}; 