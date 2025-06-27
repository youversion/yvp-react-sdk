import React, { useEffect, useRef } from 'react';
import { processLoginCallback } from 'yvp-react-sdk';

const CallbackPage = () => {
  const processed = useRef(false);

  useEffect(() => {
    if (!processed.current) {
      processLoginCallback();
      processed.current = true;
    }
  }, []);

  return <div>Processing login...</div>;
};

export default CallbackPage; 