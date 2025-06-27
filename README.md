# YouVersion Platform React SDK

A simple React SDK for authenticating with the YouVersion Platform. This package provides a React hook and a pre-styled button to handle the "Sign in with YouVersion" OAuth flow.

## Installation

You can install this package directly from its GitHub repository.

#### Standard Method

In your project's terminal, run:

```bash
npm install github:youversion/yvp-react-sdk
```

#### Alternative Method (for CI/CD or Build Tools)

Some build environments (like Docker containers, Netlify, Vercel, or other no-code platforms) may not have SSH configured. If the command above fails with an SSH error, use the `git+https` URL instead:

```bash
npm install git+https://github.com/youversion/yvp-react-sdk.git
```

### A Note on Imports

When you install directly from GitHub, the package name is taken from the `package.json` file, not from a scoped NPM registry name. Therefore, your import statements should use `yvp-react-sdk`:

```tsx
// Correct import
import { useYouVersionLogin } from 'yvp-react-sdk';

// Incorrect import
import { useYouVersionLogin } from '@youversion/yvp-react-sdk'; // This will not work
```

## How to Use

The SDK is designed to be straightforward. The two main parts you'll use together are:
1.  `YouVersionLoginButton`: A pre-styled "Sign in with YouVersion" button component.
2.  `useYouVersionLogin`: A React hook that provides the `login` function for the button and handles the `onSuccess` and `onError` callbacks.

### Step 1: Add the Login Button

In the component where you want your login button, import `YouVersionLoginButton` and `useYouVersionLogin`. Use the hook to get a `login` function, and pass that function to the button's `onClick` prop.

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

**Important:** You must register this callback URL (e.g., `http://localhost:3000/callback`) in your app's settings on the YouVersion Platform developer portal.

Create a simple component for your callback route that calls the `processLoginCallback` function.

```tsx
// src/pages/Callback.tsx
import React, { useEffect } from 'react';
import { processLoginCallback } from 'yvp-react-sdk';

const CallbackPage = () => {
  useEffect(() => {
    // This function handles communication with the main window and closes the popup.
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