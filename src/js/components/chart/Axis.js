// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import { graphValue, trackSize } from './utils';

export default class Axis extends Component {

  constructor (props) {
    super(props);
    this.state = { size: {} };
    this._size = new trackSize(this.props, this._onSize.bind(this));
  }

  componentDidMount () {
    this._size.start(this.refs.axis);
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
    const { vertical, reverse, align, min, max, valueAlign, highlight,
      values, ticks } = this.props;
    const { size: { height, width } } = this.state;

    let classes = ['axis'];
    if (reverse) {
      classes.push('axis--reverse');
    }
    if (vertical) {
      classes.push('axis--vertical');
    }
    if (align) {
      classes.push(`axis--align-${align}`);
    }
    if (valueAlign) {
      classes.push(`axis--value-align-${valueAlign}`);
    }
    if (ticks) {
      classes.push('axis--ticks');
    }

    let style = {...this.props.style};
    if (height) {
      style.height = `${height}px`;
    }
    if (width) {
      style.width = `${width}px`;
    }

    let priorItemGraphValue, borrowedSpace;
    let totalBasis = 0;
    let items = values.map((item, index) => {

      let classes = ['axis__slot'];
      if (index === highlight) {
        classes.push('axis__slot--highlight');
      }
      if (item.value <= min) {
        classes.push('axis__slot--zeroed');
      }
      if (item.colorIndex) {
        classes.push(`color-index-${item.colorIndex}`);
      }
      let contents = item.label;
      if (typeof contents === 'string' || typeof contents === 'number') {
        contents = <span>{contents}</span>;
      }

      const itemGraphValue =
        graphValue(item.value, min, max, (vertical ? height : width));
      let style = {};
      let delta;
      if (undefined === priorItemGraphValue) {
        // first value
        if (item.value <= min) {
          if (index < (values.length - 1)) {
            // need to borrow some space from the next value
            const nextItemGraphValue =
              graphValue(values[index+1].value, min, max, (vertical ? height : width));
            delta = (nextItemGraphValue - itemGraphValue) / 2;
            borrowedSpace = true;
          }
        } else {
          delta = itemGraphValue;
        }
      } else if (borrowedSpace) {
        delta = (itemGraphValue - priorItemGraphValue) / 2;
        borrowedSpace = false;
      } else {
        delta = (itemGraphValue - priorItemGraphValue);
      }
      priorItemGraphValue = itemGraphValue;

      let basis;
      if (index > 0 && index === (values.length - 1)) {
        basis = 100 - totalBasis;
      } else {
        basis = (delta / ((vertical ? height : width) || 1)) * 100;
        totalBasis += basis;
      }
      style.flexBasis = `${basis}%`;

      return (
        <div key={index} className={classes.join(' ')} style={style}>
          {contents}
        </div>
      );
    });

    const maxGraphValue = graphValue(max, min, max, (vertical ? height : width));
    if (priorItemGraphValue < maxGraphValue) {
      // fill remaining space
      const delta = maxGraphValue - priorItemGraphValue;
      const basis = `${Math.round((delta / ((vertical ? height : width) || 1)) * 100)}%`;
      const style = { flexBasis: basis };
      items.push(
        <div key={values.length}
          className="axis__slot axis__slot--placeholder" style={style} />
      );
    }

    if (vertical && ! reverse) {
      items.reverse();
    }

    return (
      <div ref="axis" className={classes.join(' ')} style={style}>
        {items}
      </div>
    );
  }

};

Axis.propTypes = {
  // alignment across values. vertical: left|center|right, horizontal: top|center|bottom
  align: PropTypes.oneOf(['start', 'center', 'end']),
  height: PropTypes.number,
  highlight: PropTypes.number,
  max: PropTypes.number,
  min: PropTypes.number,
  reverse: PropTypes.bool,
  ticks: PropTypes.bool,
  // alignment within each value. vertical: top|center|bottom, horizontal: left|center|right
  valueAlign: PropTypes.oneOf(['start', 'center', 'end']),
  values: PropTypes.arrayOf(PropTypes.shape({
    colorIndex: PropTypes.string,
    label: PropTypes.node,
    value: PropTypes.number.isRequired
  })),
  vertical: PropTypes.bool,
  width: PropTypes.number
};

Axis.defaultProps = {
  align: 'center',
  max: 100,
  min: 0
};
