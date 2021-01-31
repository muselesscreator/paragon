import React, { useCallback, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useResizeDetector } from 'react-resize-detector/build/withPolyfill';

import { useReversedChildren } from '../hooks';

export const CardFooterContext = React.createContext();

const CARD_FOOTER_BREAKPOINTS = {
  STACKED: 420,
};

const CardFooter = ({
  className,
  children,
  stacked: controlledStacked,
  ...attrs
}) => {
  const [stacked, setStacked] = useState(controlledStacked);

  const handleResize = useCallback(
    (width) => {
      if (controlledStacked) {
        // ``stacked`` was passed in as a prop so this component is being used as a
        // controlled component; rely on this prop instead of setting ``stacked`` state below.
        return;
      }

      // TODO: what to do about hardcoded width breakpoints...?
      if (width < CARD_FOOTER_BREAKPOINTS.STACKED) {
        setStacked(true);
      } else {
        setStacked(false);
      }
    },
    [controlledStacked],
  );

  const { ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'throttle',
    refreshRate: 100,
    onResize: handleResize,
  });

  const reversedChildren = useReversedChildren(children);
  const contextValue = useMemo(
    () => ({
      stacked,
    }),
    [stacked],
  );

  return (
    <div
      ref={ref}
      {...attrs}
      className={classNames('pgn__card-footer', className, {
        stacked,
      })}
    >
      <CardFooterContext.Provider value={contextValue}>
        {stacked ? reversedChildren : children}
      </CardFooterContext.Provider>
    </div>
  );
};

CardFooter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  stacked: PropTypes.bool,
};

CardFooter.defaultProps = {
  className: undefined,
  stacked: undefined, // the internals of ``CardFooter`` will decide the initial default state.
};

export default CardFooter;
