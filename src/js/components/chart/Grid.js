// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';

export default class Grid extends Component {

  constructor () {
    super();
    this._onResize = this._onResize.bind(this);
    this._layout = this._layout.bind(this);
    this.state = { height: 1, width: 1 };
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
    const grid = this.refs.grid;
    const rect = grid.getBoundingClientRect();
    this.setState({ height: height || rect.height });
    this.setState({ width: width || rect.width });
  }

  render () {
    const { columns, rows } = this.props;
    const { height, width } = this.state;
    let commands = '';

    if (columns) {
      const basis =
        Math.floor(width / (columns.count - (columns.stretch ? 1 : 0)));
      for (let i=0; i<columns.count; i+=1) {
        let x = i * basis;
        if ('end' === columns.justify) {
          x += (basis - 1);
        } else if ('center' === columns.justify) {
          x += Math.floor(basis / 2);
        }
        commands += `M${x},0 L${x},${height} `;
      }
    }

    if (rows) {
      const basis =
        Math.floor(height / (rows.count - (rows.stretch ? 1 : 0)));
      for (let i=0; i<rows.count; i+=1) {
        let y = i * basis;
        if ('end' === rows.justify) {
          y += (basis - 1);
        } else if ('center' === rows.justify) {
          y += Math.floor(basis / 2);
        }
        commands += `M0,${y} L${width},${y} `;
      }
    }

    return (
      <svg ref="grid" className="grid"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none">
        <path fill="none" d={commands} />
      </svg>
    );
  }

};

Grid.propTypes = {
  columns: PropTypes.shape({
    justify: PropTypes.oneOf(['start', 'center', 'end']),
    count: PropTypes.number.isRequired,
    stretch: PropTypes.bool
  }),
  rows: PropTypes.shape({
    justify: PropTypes.oneOf(['start', 'center', 'end']),
    count: PropTypes.number.isRequired,
    stretch: PropTypes.bool
  })
};
