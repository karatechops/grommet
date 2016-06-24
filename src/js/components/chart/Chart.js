// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component, Children, PropTypes } from 'react';
import Axis from './Axis';
import Layers from './Layers';

export default class Chart extends Component {

  constructor () {
    super();
    this.state = {};
  }

  componentDidMount () {
    this._layout();
  }

  _layout () {
    const { horizontalAlignWith, verticalAlignWith } = this.props;
    const chartRect = this.refs.chart.getBoundingClientRect();

    if (horizontalAlignWith) {
      const elem = document.getElementById(horizontalAlignWith);
      if (elem) {
        const rect = elem.getBoundingClientRect();
        this.setState({
          alignWidth: rect.width,
          alignLeft: rect.left - chartRect.left
        });
      }
    }

    if (verticalAlignWith) {
      const elem = document.getElementById(verticalAlignWith);
      if (elem) {
        const rect = elem.getBoundingClientRect();
        this.setState({
          alignHeight: rect.height,
          alignTop: rect.top - chartRect.top
        });
      }
    }
  }

  render () {
    const { alignHeight, alignLeft, alignTop, alignWidth, vertical } = this.state;

    let children = Children.map(this.props.children, child => {

      if (child.type === Axis || child.type.name === 'Axis') {
        if (vertical) {
          child = React.cloneElement(child, {
            width: alignWidth,
            style: { paddingLeft: alignLeft }
          });
        } else {
          child = React.cloneElement(child, {
            height: alignHeight,
            style: { paddingTop: alignTop }
          });
        }

      } else if (child.type === Layers || child.type.name === 'Layers') {
        child = React.cloneElement(child, {
          height: alignHeight,
          width: alignWidth,
          style: { paddingLeft: alignLeft, paddingTop: alignTop }
        });
      }

      return child;
    });

    return (
      <div ref="chart" className="chart">
        {children}
      </div>
    );
  }

};

Chart.propTypes = {
  height: PropTypes.number,
  horizontalAlignWith: PropTypes.string,
  vertical: PropTypes.bool,
  verticalAlignWith: PropTypes.string,
  width: PropTypes.number
};
