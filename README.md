# YouVersion Platform React SDK

A simple React SDK for authenticating with the YouVersion Platform. This package provides a React hook and components to handle the "Sign in with YouVersion" OAuth flow.

## Installation

You can install this package directly from its GitHub repository. In your project's terminal, run:

```bash
npm install github:youversion/yvp-react-sdk
```

## How to Use

The SDK is composed of three main parts:
1.  `useYouVersionLogin`: A React hook that manages the login state and initiates the login flow.
2.  `YouVersionLoginButton`: A pre-styled button component that you can use to trigger the login.
3.  `processLoginCallback`: A function to handle the OAuth redirect from YouVersion.

### Step 1: Set Up the Login Component

In the component where you want your login button, use the `useYouVersionLogin` hook and connect it to the `YouVersionLoginButton`.

```tsx
// src/components/Login.tsx
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
    appId: 'YOUR_YVP_APP_ID', // Replace with your app_id from YVP
    onSuccess: (result) => {
      setLoginData(result);
      setError(null);
      // You can now use result.lat to make authenticated API calls
      console.log('Login successful:', result);
    },
    onError: (error) => {
      setError(error);
      console.error('Login failed:', error);
    },
  });

  return (
    <div>
      {loginData ? (
        <div>
          <p>Welcome! You are logged in.</p>
          <p>Your Limited Access Token is: {loginData.lat}</p>
        </div>
      ) : (
        <YouVersionLoginButton onClick={login} />
      )}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
    </div>
  );
};

export default Login;
```

### Step 2: Handle the Login Callback

YouVersion will redirect the user to a specific callback URL after they log in. You need to create a page in your application to handle this redirect.

**Important:** You must register your callback URL (e.g., `http://localhost:3000/callback`) in your app's settings on the YouVersion Platform developer portal.

Create a simple component for your callback route.

```tsx
// src/pages/Callback.tsx
import React, { useEffect } from 'react';
import { processLoginCallback } from 'yvp-react-sdk';

const CallbackPage = () => {
  useEffect(() => {
    // This function handles the communication back to the main window
    // and then closes the popup.
    processLoginCallback();
  }, []);

  return <p>Processing login, please wait...</p>;
};

export default CallbackPage;
```

### Step 3: Set Up Your Routes

Make sure your application's router is set up to render the `CallbackPage` component at the correct path. Here is an example using `react-router-dom`:

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import CallbackPage from './pages/Callback';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<CallbackPage />} />
        {/* Other routes... */}
      </Routes>
    </Router>
  );
}

export default App;
```

### Step 4 (Optional): Fetching User Data

Once you have a `lat` (Limited Access Token) from a successful login, you can use the included `fetchUserProfile` helper function to get the user's details.

```tsx
import { fetchUserProfile, UserProfile, LoginSuccess } from 'yvp-react-sdk';
import { useState } from 'react';

// ... inside your component ...

const [user, setUser] = useState<UserProfile | null>(null);

const handleLoginSuccess = async (loginData: LoginSuccess) => {
  try {
    const profile = await fetchUserProfile(loginData.lat);
    setUser(profile);
    console.log('User profile:', profile);
  } catch (e) {
    console.error("Failed to fetch user profile:", e);
  }
}
```

This will return a `UserProfile` object:
```ts
interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  avatar_url: string; // A URL template, e.g. "//.../{width}x{height}/...jpg"
}
```

## Running the Demo App

This repository includes a functional demo application in the `/example` directory that demonstrates a complete implementation.

To run it:
1.  Navigate to the `/example` directory: `cd example`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm start`

The demo will open at `http://localhost:3000`.