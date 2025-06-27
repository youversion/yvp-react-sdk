import React, { useState, useEffect } from 'react';
import {
  YouVersionLoginButton,
  useYouVersionLogin,
  LoginSuccess,
  LoginError,
  fetchUserProfile,
  UserProfile,
} from 'yvp-react-sdk';

const MainPage = () => {
  const [loginSuccess, setLoginSuccess] = useState<LoginSuccess | null>(null);
  const [loginError, setLoginError] = useState<LoginError | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const { login } = useYouVersionLogin({
    appId: 'SROKTAWvVCJxqSpYceB0pjYC0yA38XdhWE56WJzTS3sG2UXR',
    onSuccess: (result) => {
      setLoginSuccess(result);
      setLoginError(null);
    },
    onError: (error) => {
      setLoginError(error);
      setLoginSuccess(null);
    },
  });

  useEffect(() => {
    if (loginSuccess?.lat) {
      const getProfile = async () => {
        try {
          const profileData = await fetchUserProfile(loginSuccess.lat);
          setUserProfile(profileData);
          setProfileError(null);
        } catch (error) {
          if (error instanceof Error) {
            setProfileError(error.message);
          } else {
            setProfileError(
              'An unknown error occurred while fetching the profile.'
            );
          }
          setUserProfile(null);
        }
      };

      getProfile();
    }
  }, [loginSuccess]);

  const formatAvatarUrl = (url: string) => {
    // The URL from the API is protocol-relative, so we add https:
    const fullUrl = url.startsWith('//') ? `https:${url}` : url;
    // Replace placeholders for a reasonable size
    return fullUrl.replace('{width}x{height}', '100x100');
  };

  const dataBoxStyle: React.CSSProperties = {
    textAlign: 'left',
    backgroundColor: '#000',
    color: '#fff',
    fontSize: '12px',
    padding: '15px',
    borderRadius: '8px',
    margin: '10px 40px',
    wordBreak: 'break-all',
  };

  return (
    <div>
      <h1>YVP React SDK Demo</h1>
      {!loginSuccess && !loginError && <YouVersionLoginButton onClick={login} />}

      {loginSuccess && (
        <div>
          <h2>Login Successful!</h2>
          <p>
            Here is your Limited Access Token (LAT) and other details from the
            login callback:
          </p>
          <div style={dataBoxStyle}>
            <p>
              <strong>LAT:</strong> <code>{loginSuccess.lat}</code>
            </p>
            <p>
              <strong>YVP User ID:</strong> <code>{loginSuccess.yvpUserId}</code>
            </p>
            <p>
              <strong>Grants:</strong>{' '}
              <code>{loginSuccess.grants.join(', ')}</code>
            </p>
          </div>
        </div>
      )}

      {userProfile && (
        <div>
          <h2>User Profile</h2>
          <p>
            Using the LAT, we made a call to <code>/auth/me</code>:
          </p>
          {userProfile.avatar_url && (
            <img
              src={formatAvatarUrl(userProfile.avatar_url)}
              alt="User avatar"
              style={{ borderRadius: '50%', margin: '10px' }}
            />
          )}
          <div style={dataBoxStyle}>
            <p>
              <strong>Name:</strong> {userProfile.first_name}{' '}
              {userProfile.last_name}
            </p>
            <p>
              <strong>ID:</strong> {userProfile.id}
            </p>
          </div>
        </div>
      )}

      {profileError && (
        <div style={{ color: 'red' }}>
          <h2>Profile Fetch Error</h2>
          <p>{profileError}</p>
        </div>
      )}

      {loginError && (
        <div style={{ color: 'red' }}>
          <h2>Login Error</h2>
          <pre
            style={{
              textAlign: 'left',
              backgroundColor: '#f0f0f0',
              padding: '10px',
              borderRadius: '5px',
              color: 'red',
            }}
          >
            {JSON.stringify(loginError, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default MainPage; 