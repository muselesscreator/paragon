import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from 'react-bootstrap/Button';

import ButtonDeprecated from './deprecated';
import { ParagonContext } from '../Paragon';

const Button = React.forwardRef(({
  children, onClick, ...attrs
}, ref) => {
  const { dependencies } = useContext(ParagonContext);
  const { analytics } = dependencies || {};

  return (
    <ButtonBase
      ref={ref}
      {...attrs}
      onClick={(e) => {
        if (analytics?.sendTrackEvent) {
          console.log('edx.bi.paragon.button');
          analytics.sendTrackEvent({
            event: 'edx.bi.paragon.button',
          });
        }
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {children}
    </ButtonBase>
  );
});

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

Button.defaultProps = {
  onClick: undefined,
};

Button.Deprecated = ButtonDeprecated;

export default Button;
export { default as ButtonGroup } from 'react-bootstrap/ButtonGroup';
export { default as ButtonToolbar } from 'react-bootstrap/ButtonToolbar';
