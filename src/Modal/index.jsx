import React, { useContext, useCallback } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FocusOn } from 'react-focus-on';

import newId from '../utils/newId';

import ModalDialog from './ModalDialog';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';
import ModalFooter from './ModalFooter';
import ModalTitle from './ModalTitle';
import ModalCloseButton from './ModalCloseButton';
import ModalOpenButton from './ModalOpenButton';
import ModalContext from './ModalContext';

// export const ModalContext = React.createContext();

class Modal extends React.Component {
  static Header = ModalHeader;
  static Body = ModalBody;
  static Footer = ModalFooter;
  static CloseButton = ModalCloseButton;
  static OpenButton = ModalOpenButton;
  static Title = ModalTitle;

  constructor(props) {
    super(props);

    this.el = document.createElement('div');
    this.modalRoot = document.body;
    this.modalId = newId('modal');
    this.modalLabelId = `${this.modalId}-label`;

    this.state = {
      open: props.defaultOpen,
    };
  }

  open = () => {
    this.setState({
      open: true,
    });
  }

  close = () => {
    this.setState({
      open: false,
    });
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    this.modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    this.modalRoot.removeChild(this.el);
  }

  renderDialog() {
    return (
      <ModalDialog>
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
          <Modal.CloseButton>
            <span aria-hidden="true">&times;</span>
          </Modal.CloseButton>
        </Modal.Header>
        <Modal.Body>
          {this.props.children}
          <div style={{height:'250vh'}} />
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary">
            Save changes
          </button>
          <Modal.CloseButton className="btn btn-outline-primary">
            Close
          </Modal.CloseButton>
        </Modal.Footer>
      </ModalDialog>
    );
  }

  render() {
    return (
      <ModalContext.Provider value={{
        close: this.close,
        open: this.open,
        isOpen: this.state.open,
        modalLabelId: this.modalLabelId,
      }}>
        <Modal.OpenButton type="button">OPEN ME</Modal.OpenButton>
        {ReactDOM.createPortal(this.renderDialog(), this.el)}
      </ModalContext.Provider>
    );
  }
}

Modal.propTypes = {
  open: PropTypes.bool,
  parentSelector: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  buttons: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.object, // TODO: Only accept nodes in the future
  ])),
  closeText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onClose: PropTypes.func.isRequired,
  variant: PropTypes.shape({
    status: PropTypes.string,
  }),
  renderHeaderCloseButton: PropTypes.bool,
  defaultOpen: PropTypes.bool,
};

Modal.defaultProps = {
  open: false,
  defaultOpen: true,
  parentSelector: 'body',
  buttons: [],
  closeText: 'Close',
  variant: {},
  renderHeaderCloseButton: true,
};


export default Modal;
