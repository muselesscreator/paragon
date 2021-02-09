import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

export const ParagonContext = React.createContext({});

const ParagonProvider = ({
  analytics,
  logging,
  children,
}) => {
  // ``contextValue`` must be memoized such that re-renders of ParagonProvider do
  // not trigger erroneous updates of the context value.
  const contextValue = useMemo(
    () => ({
      analytics,
      logging,
    }),
    [analytics],
  );

  return (
    <ParagonContext.Provider value={contextValue}>
      {children}
    </ParagonContext.Provider>
  );
};

ParagonProvider.propTypes = {
  children: PropTypes.node.isRequired,
  analytics: PropTypes.shape({
    sendTrackEvent: PropTypes.func,
    sendTrackingLogEvent: PropTypes.func,
  }),
  i18n: PropTypes.shape({
    pagination: PropTypes.shape({
      next: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      previous: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    }),
  }),
  logging: PropTypes.shape({}), // TODO: fill me out
};

ParagonProvider.defaultProps = {
  analytics: undefined,
  i18n: undefined,
  logging: undefined,
};

export default ParagonProvider;
