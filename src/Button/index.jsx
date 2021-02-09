import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from 'react-bootstrap/Button';

import {
  useSendTrackingLogEvent,
  useTrackComponentOnMount,
} from '../hooks';

import ButtonDeprecated from './deprecated';

const Button = React.forwardRef(({
  children,
  analyticsEvent,
  ...attrs
}, ref) => {
  useTrackComponentOnMount('edx.ui.paragon.Button.mounted', attrs);
  const sendTrackingLogEvent = useSendTrackingLogEvent(analyticsEvent);

  const handleClick = (e) => {
    sendTrackingLogEvent();

    if (attrs?.onClick) {
      attrs.onClick(e);
    }
  };

  return (
    <ButtonBase
      ref={ref}
      {...attrs}
      onClick={handleClick}
    >
      {children}
    </ButtonBase>
  );
});

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  analyticsEvent: PropTypes.shape({
    eventName: PropTypes.string.isRequired,
  }),
};

Button.defaultProps = {
  onClick: undefined,
  analyticsEvent: undefined,
};

Button.Deprecated = ButtonDeprecated;

export default Button;
export { default as ButtonGroup } from 'react-bootstrap/ButtonGroup';
export { default as ButtonToolbar } from 'react-bootstrap/ButtonToolbar';
