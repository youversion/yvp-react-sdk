import React, { useState } from 'react';
import {
  YouVersionLoginButton,
  useYouVersionLogin,
  LoginSuccess,
  LoginError,
} from 'yvp-react-sdk';

const Login = () => {
  const [loginData, setLoginData] = useState<LoginSuccess | null>(null);
  const [error, setError] = useState<LoginError | null>(null);

  const { login } = useYouVersionLogin({
    appId: 'demo_react_local', // Using demo app ID
    onSuccess: (result) => {
      setLoginData(result);
      setError(null);
      console.log('Login successful! You can now use the LAT:', result.lat);
    },
    onError: (error) => {
      setError(error);
      console.error('Login failed:', error);
    },
  });

  return (
    <div>
      <h2>Sign In</h2>
      {loginData ? (
        <div>
          <p>Welcome! You are logged in.</p>
          <p>Your LAT: {loginData.lat}</p>
        </div>
      ) : (
        <YouVersionLoginButton onClick={login} />
      )}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
};

export default Login; 