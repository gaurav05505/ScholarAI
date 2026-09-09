import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const PageTransition = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll smoothly to top on page transition unless an in-page hash anchor is targeted
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="page-transition w-full min-h-screen">
      {children}
    </div>
  );
};

export default PageTransition;
