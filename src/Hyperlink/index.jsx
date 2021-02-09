import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import isRequiredIf from 'react-proptype-conditional-require';

import withDeprecatedProps, { DEPR_TYPES } from '../withDeprecatedProps';
import {
  useSendTrackingLogEvent,
  useTrackComponentOnMount,
} from '../hooks';

const Hyperlink = (props) => {
  const {
    analyticsEvent,
    destination,
    children,
    target,
    onClick,
    externalLinkAlternativeText,
    externalLinkTitle,
    ...attrs
  } = props;
  const eventProperties = {
    destination,
    target,
    externalLinkAlternativeText,
    externalLinkTitle,
    ...attrs,
  };

  useTrackComponentOnMount('edx.ui.paragon.Hyperlink.mounted', eventProperties);
  const sendTrackingLogEvent = useSendTrackingLogEvent(analyticsEvent);

  let externalLinkIcon;

  if (target === '_blank') {
    // Add this rel attribute to prevent Reverse Tabnabbing
    attrs.rel = attrs.rel ? `noopener ${attrs.rel}` : 'noopener';

    externalLinkIcon = (
      <span
        className={classNames('fa', 'fa-external-link')}
        aria-hidden={false}
        aria-label={externalLinkAlternativeText}
        title={externalLinkTitle}
      />
    );
  }

  // delay execution of link navigation to allow for tracking log event call to resolve
  // when navigating away from the page. similar to Segment's ``analytics.trackLink``:
  // https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#track-link
  const handleClick = (e) => {
    e.preventDefault();
    sendTrackingLogEvent().finally(() => {
      if (onClick) {
        onClick(e);
      }
      global.location.href = destination;
    });
  };

  return (
    <a
      href={destination}
      target={target}
      onClick={handleClick}
      {...attrs}
    >
      {children}
      {externalLinkIcon && (
        <>
          {' '}
          {externalLinkIcon}
        </>
      )}
    </a>
  );
};

Hyperlink.defaultProps = {
  target: '_self',
  onClick: () => {},
  externalLinkAlternativeText: 'Opens in a new window',
  externalLinkTitle: 'Opens in a new window',
  analyticsEvent: undefined,
};

Hyperlink.propTypes = {
  /** specifies the URL */
  destination: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  /** specifies where the link should open. The default behavior is `_self`, which means that the URL will be loaded into the same browsing context as the current one. If the target is `_blank` (opening a new window) `rel='noopener'` will be added to the anchor tag to prevent any potential [reverse tabnabbing attack](https://www.owasp.org/index.php/Reverse_Tabnabbing).
   */
  target: PropTypes.string,
  /** specifies the callback function when the link is clicked */
  onClick: PropTypes.func,
  // eslint-disable-next-line max-len
  /** specifies the text for links with a `_blank` target (which loads the URL in a new browsing context). */
  externalLinkAlternativeText: isRequiredIf(
    PropTypes.string,
    props => props.target === '_blank',
  ),
  // eslint-disable-next-line max-len
  /** specifies the title for links with a `_blank` target (which loads the URL in a new browsing context). */
  externalLinkTitle: isRequiredIf(
    PropTypes.string,
    props => props.target === '_blank',
  ),
  analyticsEvent: PropTypes.shape({
    eventName: PropTypes.string.isRequired,
  }),
};

export default withDeprecatedProps(Hyperlink, 'Hyperlink', {
  /** specifies the text or element that a URL should be associated with */
  content: {
    deprType: DEPR_TYPES.MOVED,
    newName: 'children',
  },
});
