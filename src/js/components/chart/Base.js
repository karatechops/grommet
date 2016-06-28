// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import Props from '../../utils/Props';

export default class Base extends Component {

  render () {
    const { height, width } = this.props;
    const restProps = Props.omit(this.props, Object.keys(Base.propTypes));

    let classes = ['base'];
    if (height) {
      classes.push(`base--height-${height}`);
    }
    if (width) {
      classes.push(`base--width-${width}`);
    }

    return (
      <div {...restProps} className={classes.join(' ')}>
        {this.props.children}
      </div>
    );
  }

};

Base.propTypes = {
  height: PropTypes.oneOf(['small', 'medium', 'large']),
  width: PropTypes.oneOf(['small', 'medium', 'large', 'full'])
};
