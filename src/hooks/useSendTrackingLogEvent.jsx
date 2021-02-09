import { useCallback } from 'react';

import useAnalytics from './useAnalytics';

const useSendTrackingLogEvent = (analyticsEvent) => {
  const analytics = useAnalytics();
  const sendTrackingLogEvent = useCallback(
    () => {
      if (!analytics?.sendTrackingLogEvent || !analyticsEvent) {
        // no analytics configured for Paragon; return a no-op thenable promise that can still be called.
        return Promise.resolve(null);
      }
      const eventProperties = { ...analyticsEvent };
      const { eventName } = eventProperties;
      delete eventProperties.eventName;
      const payload = eventProperties;
      return analytics.sendTrackingLogEvent(eventName, payload);
    },
    [analytics, analyticsEvent],
  );
  return sendTrackingLogEvent;
};

export default useSendTrackingLogEvent;
