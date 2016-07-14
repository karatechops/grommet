// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import { graphValue, trackSize } from './utils';
import CSSClassnames from '../../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.CHART_AXIS;
const COLOR_INDEX = CSSClassnames.COLOR_INDEX;

export default class Axis extends Component {

  constructor (props) {
    super(props);
    this.state = { size: { width: 0, height: 0 } };
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
    const { vertical, reverse, align, min, max, highlight,
      values, count, ticks } = this.props;
    const { size: { height, width } } = this.state;

    let classes = [CLASS_ROOT];
    if (reverse) {
      classes.push(`${CLASS_ROOT}--reverse`);
    }
    if (vertical) {
      classes.push(`${CLASS_ROOT}--vertical`);
    }
    if (align) {
      classes.push(`${CLASS_ROOT}--align-${align}`);
    }
    if (ticks) {
      classes.push(`${CLASS_ROOT}--ticks`);
    }

    let style = {...this.props.style};
    if (height) {
      style.height = `${height}px`;
    }
    if (width) {
      style.width = `${width}px`;
    }

    let graphItems = [];
    if (count) {
      const delta = (max - min) / (count - 1);
      for (let value=min; value<=max; value+=delta) {
        const gValue = graphValue(value, min, max, (vertical ? height : width));
        let valueItem;
        if (values) {
          valueItem = values.filter(item => item.value === value)[0];
        }
        if (valueItem) {
          graphItems.push({ ...valueItem, graphValue: gValue });
        } else {
          graphItems.push({ value: value, graphValue: gValue });
        }
      }
    } else if (values) {
      graphItems = values.map((item, index) => ({ ...item,
        graphValue: graphValue(item.value, min, max, (vertical ? height : width))
      }));
    }
    const maxGraphValue = graphValue(max, min, max, (vertical ? height : width));

    let priorItem, borrowedSpace;
    let totalBasis = 0;
    let items = graphItems.map((item, index) => {

      let classes = [`${CLASS_ROOT}__slot`];
      if (index === highlight) {
        classes.push(`${CLASS_ROOT}__slot--highlight`);
      }
      if (item.value <= min) {
        classes.push(`${CLASS_ROOT}__slot--zeroed`);
      }
      if (item.colorIndex) {
        classes.push(`${COLOR_INDEX}-${item.colorIndex}`);
      }
      let label = item.label;
      if (typeof contents === 'string' || typeof contents === 'number') {
        label = <span>{label}</span>;
      }

      let delta;
      if (0 === index) {
        // first value
        if (item.value <= min) {
          if (index < (graphItems.length - 1)) {
            // need to borrow some space from the next value
            delta = (graphItems[index+1].graphValue - item.graphValue) / 2;
            borrowedSpace = true;
          } else {
            // first and only value
            delta = maxGraphValue;
          }
        } else {
          delta = item.graphValue;
        }
      } else if (borrowedSpace) {
        delta = (item.graphValue - priorItem.graphValue) / 2;
        borrowedSpace = false;
      } else {
        delta = (item.graphValue - priorItem.graphValue);
      }
      priorItem = item;

      let basis;
      if (index > 0 && index === (graphItems.length - 1)) {
        basis = 100 - totalBasis;
        totalBasis = 100;
      } else {
        basis = (delta / ((vertical ? height : width) || 1)) * 100;
        totalBasis += basis;
      }
      const style = { flexBasis: `${basis}%`};

      return (
        <div key={item.value + index} className={classes.join(' ')} style={style}>
          {label}
        </div>
      );
    });

    if (totalBasis < 100) {
      // fill remaining space
      const style = { flexBasis: `${100 - totalBasis}%` };
      items.push(
        <div key={values.length}
          className={`${CLASS_ROOT}__slot ${CLASS_ROOT}__slot--placeholder`}
          style={style} />
      );
    }

    return (
      <div ref="axis" className={classes.join(' ')} style={style}>
        {items}
      </div>
    );
  }

};

Axis.propTypes = {
  align: PropTypes.oneOf(['start', 'end']),
  count: PropTypes.number,
  height: PropTypes.number,
  highlight: PropTypes.number,
  max: PropTypes.number,
  min: PropTypes.number,
  reverse: PropTypes.bool,
  ticks: PropTypes.bool,
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
