// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import { graphValue, trackSize } from './utils';

export default class Marker extends Component {

  constructor (props) {
    super(props);
    this.state = { size: {} };
    this._size = new trackSize(props, this._onSize.bind(this));
  }

  componentDidMount () {
    this._size.start(this.refs.marker);
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
    const { count, values, max, min, vertical, colorIndex, onActive } = this.props;
    const { size: { height, width } } = this.state;

    let classes = ['marker'];
    if (vertical) {
      classes.push('marker--vertical');
    }
    classes.push(`color-index-${colorIndex || 'grey-1'}`);

    let style = {...this.props.style};
    if (height) {
      style.height = `${height}px`;
    }
    if (width) {
      style.width = `${width}px`;
    }

    let graphValues = [];
    if (values) {
      graphValues = values.map((value, index) => (
        graphValue(value, min, max, (vertical ? height : width))
      ));
    } else if (count) {
      const delta = (max - min) / (count - 1);
      for (let value=min; value<=max; value+=delta) {
        graphValues.push(graphValue(value, min, max, (vertical ? height : width)));
      }
    }

    let priorEnd = graphValues[0];
    let totalBasis = 0;
    const items = graphValues.map((graphValue, index) => {
      const classes = ['marker__band'];
      const start = priorEnd;
      let end;
      if (index >= (graphValues.length - 1)) {
        end = graphValue;
      } else {
        end = graphValue + ((graphValues[index + 1] - graphValue) / 2);
      }
      priorEnd = end;
      const delta = (end - start);

      let basis;
      if (index > 0 && index === (graphValues.length - 1)) {
        basis = 100 - totalBasis;
      } else {
        basis = (delta / ((vertical ? height : width) || 1)) * 100;
        totalBasis += basis;
      }
      const style = { flexBasis: `${basis}%`};

      let onOver, onOut;
      if (onActive) {
        onOver = () => onActive(index);
        onOut = () => onActive(undefined);
      }

      return (
        <div key={index} className={classes.join(' ')} style={style}
          onMouseOver={onOver} onMouseOut={onOut} />
      );
    });

    return (
      <div ref="marker" className={classes.join(' ')} style={style}>
        {items}
      </div>
    );
  }

};

Marker.propTypes = {
  activeIndex: PropTypes.number,
  colorIndex: PropTypes.string,
  count: PropTypes.number,
  max: PropTypes.number.isRequired,
  min: PropTypes.number,
  onActive: PropTypes.func,
  values: PropTypes.arrayOf(PropTypes.number),
  vertical: PropTypes.bool
};

Marker.defaultProps = {
  min: 0
};
