import { useContext, useEffect } from 'react';

import { ParagonContext } from '../ParagonProvider';
import useIsMounted from './useIsMounted';

const useTrackComponentOnMount = (eventName, attrs) => {
  const isMounted = useIsMounted();
  const { analytics } = useContext(ParagonContext) || {};

  useEffect(
    () => {
      if (isMounted.current && analytics?.sendTrackingLogEvent) {
        analytics.sendTrackingLogEvent(eventName, {
          ...attrs,
        });
      }
    },
    [isMounted],
  );
};

export default useTrackComponentOnMount;
