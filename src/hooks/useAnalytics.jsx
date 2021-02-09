import { useContext } from 'react';

import { ParagonContext } from '../ParagonProvider';

const useAnalytics = () => {
  const { analytics } = useContext(ParagonContext);
  return analytics;
};

export default useAnalytics;
