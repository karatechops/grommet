// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import { graphValue, trackSize } from './utils';

export default class Threshold extends Component {

  constructor (props) {
    super(props);
    this.state = { size: {} };
    this._size = new trackSize(props, this._onSize.bind(this));
  }

  componentDidMount () {
    this._size.start(this.refs.svg);
  }

  componentWillReceiveProps (nextProps) {
    this._size.reset(nextProps);
  }

  componentWillUnmount () {
    this._size.stop();
  }

  _onSize (size) {
    this.setState({ size: size });
  }

  render () {
    const { value, max, min, vertical, colorIndex } = this.props;
    const { size: { height, width } } = this.state;
    let classes = ['threshold'];
    classes.push(`color-index-${colorIndex || 'graph-1'}`);
    let commands = '';

    if (vertical) {
      const x = graphValue(value, min, max, width) || 0;
      commands = `M${x},0 L${x},${height}`;
    } else {
      const y = (height - graphValue(value, min, max, height)) || 0;
      commands = `M0,${y} L${width || 1},${y}`;
    }

    return (
      <svg ref="svg" className={classes.join(' ')}
        viewBox={`0 0 ${width || 1} ${height || 1}`}
        preserveAspectRatio="none">
        <path fill="none" d={commands} />
      </svg>
    );
  }

};

Threshold.propTypes = {
  colorIndex: PropTypes.string,
  max: PropTypes.number.isRequired,
  min: PropTypes.number,
  value: PropTypes.number.isRequired,
  vertical: PropTypes.bool
};

Threshold.defaultProps = {
  min: 0
};
