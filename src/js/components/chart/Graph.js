// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';

const POINT_RADIUS = 6;

export default class Graph extends Component {

  constructor (props) {
    super(props);
    this._onResize = this._onResize.bind(this);
    this._layout = this._layout.bind(this);
    this.state = { height: props.height || 1, width: props.width || 1 };
  }

  componentDidMount () {
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  componentWillUnmount () {
    clearTimeout(this._resizeTimer);
    window.removeEventListener('resize', this._onResize);
  }

  _onResize () {
    // debounce
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(this._layout, 50);
  }

  _layout () {
    const { height, width } = this.props;
    const graph = this.refs.graph;
    const rect = graph.getBoundingClientRect();
    this.setState({ height: height || Math.floor(rect.height) });
    this.setState({ width: width || Math.floor(rect.width) });
  }

  render () {
    const { colorIndex, vertical, reverse, highlight, max, min, values, type,
      activeIndex } = this.props;
    const { height, width } = this.state;

    let classes = ['graph', `graph--${type}`];
    if (vertical) {
      classes.push('graph--vertical');
    }
    if (highlight) {
      classes.push('graph--highlight');
    }
    classes.push(`color-index-${colorIndex || 'graph-1'}`);

    let scale, step;
    if (vertical) {
      if (! values.length) {
        scale = 1;
        step = height;
      } else {
        scale = width / (max - min);
        step = height / (values.length - 1);
      }
    } else {
      if (! values.length) {
        scale = 1;
        step = width;
      } else {
        scale = height / (max - min);
        step = width / (values.length - 1);
      }
    }

    // Get all coordinates up front so they are available
    // if we are drawing a smooth chart.
    let points = [];
    const coordinates = values.map((value, index) => {
      let coordinate;
      if (vertical) {
        coordinate = [
          (value - min) * scale,
          (reverse ? (index * step) : height - (index * step))
        ];
      } else {
        coordinate = [
          (reverse ? width - (index * step) : index * step),
          height - ((value - min) * scale)
        ];
      }

      if ((this.props.points || index === activeIndex) && ! this.props.sparkline) {
        const classes = ['graph__point', `color-index-${colorIndex}`];
        if (index === activeIndex) {
          classes.push('graph__point--active');
        }
        let x = Math.max(POINT_RADIUS + 1,
          Math.min(width - (POINT_RADIUS + 1), coordinate[0]));
        let y = Math.max(POINT_RADIUS + 1,
          Math.min(height - (POINT_RADIUS + 1), coordinate[1]));
        points.push(
          <circle key={index} className={classes.join(' ')}
            cx={x} cy={y} r={POINT_RADIUS} />
        );
        coordinate = [x, y];
      }

      return coordinate;
    });

    // Build the commands for this set of coordinates.
    let commands = `M${coordinates.map(c => c.join(',')).join(' L')}`;

    let pathProps = {};
    if ('area' === type) {
      if (vertical) {
        if (reverse) {
          // Close the path by drawing to the left
          // and across to the top of where we started.
          commands +=
            `L0,${coordinates[coordinates.length - 1][1]} L0,0 Z`;
        } else {
          // Close the path by drawing to the left
          // and across to the bottom of where we started.
          commands +=
            `L0,${coordinates[coordinates.length - 1][1]} L0,${height} Z`;
        }
      } else {
        // Close the path by drawing down to the bottom
        // and across to the left of where we started.
        commands +=
          `L${coordinates[coordinates.length - 1][0]},${height} L0,${height} Z`;
      }
      pathProps.stroke = 'none';
    } else {
      pathProps.fill = 'none';
    }

    return (
      <svg ref="graph" className={classes.join(' ')}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none">
        <path {...pathProps} d={commands} />
        {points}
      </svg>
    );
  }

};

Graph.propTypes = {
  activeIndex: PropTypes.number,
  colorIndex: PropTypes.string,
  height: PropTypes.number,
  highlight: PropTypes.number,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  points: PropTypes.bool,
  reverse: PropTypes.bool,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  type: PropTypes.oneOf(['area', 'line']).isRequired,
  vertical: PropTypes.bool,
  width: PropTypes.number
};
