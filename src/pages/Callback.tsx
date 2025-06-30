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