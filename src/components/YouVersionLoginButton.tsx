import React from 'react';

const loginButtonUrl = 'https://github.com/youversion/yvp-sdks/blob/main/shared-assets/roundedButton-dark.png?raw=true';

interface YouVersionLoginButtonProps {
  onClick: () => void;
}

export const YouVersionLoginButton: React.FC<YouVersionLoginButtonProps> = ({ onClick }) => {
  return (
    <img
      src={loginButtonUrl}
      alt="Sign in with YouVersion"
      onClick={onClick}
      style={{ cursor: 'pointer', width: '200px' }}
    />
  );
}; 