// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import { graphValue, trackSize } from './utils';
import CSSClassnames from '../../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.CHART_HOT_SPOTS;

// Interactive regions.

export default class HotSpots extends Component {

  constructor (props) {
    super(props);
    this.state = { size: {} };
    this._size = new trackSize(props, this._onSize.bind(this));
  }

  componentDidMount () {
    this._size.start(this.refs.hotSpots);
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
    const { count, values, max, min, vertical, activeIndex,
      onActive } = this.props;
    const { size: { height, width } } = this.state;

    let classes = [CLASS_ROOT];
    if (vertical) {
      classes.push(`${CLASS_ROOT}--vertical`);
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
      const classes = ['hot-spots__band'];
      if (index === activeIndex) {
        classes.push('hot-spots__band--active');
      }
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
      <div ref="hotSpots" className={classes.join(' ')}>
        {items}
      </div>
    );
  }

};

HotSpots.propTypes = {
  activeIndex: PropTypes.number,
  count: PropTypes.number,
  max: PropTypes.number.isRequired,
  min: PropTypes.number,
  onActive: PropTypes.func,
  values: PropTypes.arrayOf(PropTypes.number),
  vertical: PropTypes.bool
};

HotSpots.defaultProps = {
  min: 0,
  max: 100
};
