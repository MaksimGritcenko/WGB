import { Component } from 'react';
import PropTypes from 'prop-types';

import './Accordion.style';

class AccordionSection extends Component {
  static propTypes = {
      children: PropTypes.instanceOf(Object).isRequired,
      isOpen: PropTypes.bool.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired
  };

  Click = () => {
      const { label, onClick } = this.props;
      onClick(label);
  };

  render() {
      const { isOpen, label, children } = this.props;
      return (
      <div block="Accordion">
        <button
          type="button"
          onClick={ this.Click }
          onKeyDown={ this.Click }
          block="Accordion"
          elem="Button"
        >
          <span block="Accordion" elem="title">
          { label }
          </span>
          <span block="Accordion" elem="arrow">
            { !isOpen && <span>&#9650;</span> }
            { isOpen && <span>&#9660;</span> }
          </span>
        </button>
        { isOpen && (
          <div block="Accordion" elem="Content">
            { children }
          </div>
        ) }
      </div>
      );
  }
}

export default AccordionSection;