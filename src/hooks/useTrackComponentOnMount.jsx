import { useEffect } from 'react';

import useIsMounted from './useIsMounted';
import useAnalytics from './useAnalytics';

import packageJSON from '../../package.json';

const useTrackComponentOnMount = (eventName, attrs) => {
  const isMounted = useIsMounted();
  const analytics = useAnalytics();

  useEffect(
    () => {
      if (isMounted.current && analytics?.sendTrackingLogEvent) {
        analytics.sendTrackingLogEvent(eventName, {
          paragonVersion: packageJSON.version,
          attributes: attrs,
        });
      }
    },
    [isMounted, analytics],
  );
};

export default useTrackComponentOnMount;
