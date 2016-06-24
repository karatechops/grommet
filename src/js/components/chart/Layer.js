// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';

export default class Layer extends Component {

  render () {
    const { vertical, height, width } = this.props;

    let classes = ['layer'];
    if (vertical) {
      classes.push(`layer--vertical`);
    }

    let style = {};
    if (height) {
      style.height = `${height}px`;
    }
    if (width) {
      style.width = `${width}px`;
    }

    return (
      <div className={classes.join(' ')} style={style}>
        {this.props.children}
      </div>
    );
  }

};

Layer.propTypes = {
  height: PropTypes.number,
  vertical: PropTypes.bool,
  width: PropTypes.number
};
