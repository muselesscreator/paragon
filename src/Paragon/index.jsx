import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

export const ParagonContext = React.createContext({});

const Paragon = ({ dependencies, children }) => {
  const contextValue = useMemo(
    () => dependencies,
    [dependencies],
  );

  return (
    <ParagonContext.Provider value={contextValue}>
      {children}
    </ParagonContext.Provider>
  );
};

Paragon.propTypes = {
  children: PropTypes.node.isRequired,
  dependencies: PropTypes.shape({}), // TODO: fill this out
};

Paragon.defaultProps = {
  dependencies: undefined,
};

export default Paragon;
