import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from 'react-bootstrap/Button';

import ButtonDeprecated from './deprecated';
import { ParagonContext } from '../Paragon';

const Button = React.forwardRef((props, ref) => {
  const { dependencies } = useContext(ParagonContext);
  const { analytics } = dependencies || {};
  const {
    children, onClick, ...attrs
  } = props;

  return (
    <ButtonBase
      ref={ref}
      {...attrs}
      onClick={(e) => {
        if (analytics?.sendTrackEvent) {
          // check the console.log from frontend-platform's example app when this button is clicked
          analytics.sendTrackEvent({
            event: 'edx.paragon.Button.click',
            attributes: { ...props },
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
