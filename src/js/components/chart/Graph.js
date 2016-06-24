// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';

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
    const { colorIndex, vertical, highlight, max, min, series, type } = this.props;
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
      if (! series.length) {
        scale = 1;
        step = height;
      } else {
        scale = width / (max - min);
        step = height / (series.length - 1);
      }
    } else {
      if (! series.length) {
        scale = 1;
        step = width;
      } else {
        scale = height / (max - min);
        step = width / (series.length - 1);
      }
    }

    // Get all coordinates up front so they are available
    // if we are drawing a smooth chart.
    const coordinates = series.map((value, index) => {
      if (vertical) {
        return [(value - min) * scale, height - (index * step)];
      } else {
        return [index * step, height - ((value - min) * scale)];
      }
    });

    // Build the commands for this set of coordinates.
    let commands = `M${coordinates.map(c => c.join(',')).join(' L')}`;

    let pathProps = {};
    if ('area' === type) {
      // Close the path by drawing down to the bottom
      // and across to the bottom of where we started.
      commands +=
        `L${coordinates[coordinates.length - 1][0]},${height} L0,${height} Z`;
      pathProps.stroke = 'none';
    } else {
      pathProps.fill = 'none';
    }

    return (
      <svg ref="graph" className={classes.join(' ')}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none">
        <path {...pathProps} d={commands} />
      </svg>
    );
  }

};

Graph.propTypes = {
  colorIndex: PropTypes.string,
  height: PropTypes.number,
  highlight: PropTypes.number,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  series: PropTypes.arrayOf(PropTypes.number).isRequired,
  type: PropTypes.oneOf(['area', 'line']).isRequired,
  vertical: PropTypes.bool,
  width: PropTypes.number
};
