// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes, Children } from 'react';
import Props from '../../utils/Props';

// Equally sized siblings.

export default class Stack extends Component {

  render () {
    const { height, width, vertical } = this.props;
    const restProps = Props.omit(this.props, Object.keys(Stack.propTypes));

    let classes = ['stack'];
    if (vertical) {
      classes.push('stack--vertical');
    }

    let style = {};
    if (height) {
      style.height = `${height}px`;
    }
    if (width) {
      style.width = `${width}px`;
    }

    let children = this.props.children;
    if (! vertical) {
      const basis = Math.floor(100 / Children.count(this.props.children)) + '%';
      children = Children.map(this.props.children, child => (
        child ? React.cloneElement(child, { style: { flexBasis: basis }}) : child
      ));
    }

    return (
      <div {...restProps} className={classes.join(' ')} style={style}>
        {children}
      </div>
    );
  }

};

Stack.propTypes = {
  height: PropTypes.number,
  vertical: PropTypes.bool,
  width: PropTypes.number
};
