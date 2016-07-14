// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import CSSClassnames from '../../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.CHART_LAYERS;

export default class Layers extends Component {

  render () {
    const { height, width } = this.props;
    let classes = [CLASS_ROOT];
    let style = {...this.props.style};
    if (height) {
      if (typeof height === 'string') {
        classes.push(`${CLASS_ROOT}--height-${height}`);
      } else {
        style.height = `${height}px`;
      }
    }
    if (width) {
      if (typeof width === 'string') {
        classes.push(`${CLASS_ROOT}--width-${width}`);
      } else {
        style.width = `${width}px`;
      }
    }

    return (
      <div className={classes.join(' ')} style={style}>
        {this.props.children}
      </div>
    );
  }

};

Layers.propTypes = {
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['small', 'medium', 'large'])
  ]),
  width: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['small', 'medium', 'large', 'full'])
  ])
};
