// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component, Children, PropTypes } from 'react';
import Axis from './Axis';
import Layers from './Layers';

export default class Chart extends Component {

  constructor () {
    super();
    this._layout = this._layout.bind(this);
    this.state = {};
  }

  componentDidMount () {
    setTimeout(this._layout, 1);
  }

  _layout () {
    const { horizontalAlignWith, verticalAlignWith } = this.props;
    const chart = this.refs.chart;
    const chartRect = chart.getBoundingClientRect();
    const base = this.refs.chart.querySelector('.base');

    if (horizontalAlignWith) {
      const elem = document.getElementById(horizontalAlignWith);
      if (elem) {
        const rect = elem.getBoundingClientRect();
        this.setState({
          alignWidth: rect.width,
          alignLeft: rect.left - chartRect.left
        });
      }
    } else if (base) {
      const rect = base.getBoundingClientRect();
      this.setState({
        alignWidth: rect.width,
        alignLeft: rect.left - chartRect.left
      });
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
    } else if (base) {
      const rect = base.getBoundingClientRect();
      this.setState({
        alignHeight: rect.height,
        alignTop: rect.top - chartRect.top
      });
    }
  }

  render () {
    const { vertical, full } = this.props;
    const { alignHeight, alignLeft, alignTop, alignWidth } = this.state;
    let classes = ['chart'];
    if (vertical) {
      classes.push('chart--vertical');
    }
    if (full) {
      classes.push('chart--full');
    }

    let children = Children.map(this.props.children, child => {

      // name comparison is to work around webpack alias issues in development
      if (child.type === Axis || child.type.name === 'Axis') {
        if (vertical) {
          child = React.cloneElement(child, {
            width: alignWidth,
            style: { marginLeft: alignLeft }
          });
        } else {
          child = React.cloneElement(child, {
            height: alignHeight,
            style: { marginTop: alignTop }
          });
        }

      } else if (child.type === Layers || child.type.name === 'Layers') {
        child = React.cloneElement(child, {
          height: alignHeight,
          width: alignWidth,
          style: { left: alignLeft, top: alignTop }
        });
      }

      return child;
    });

    return (
      <div ref="chart" className={classes.join(' ')}>
        {children}
      </div>
    );
  }

};

Chart.propTypes = {
  full: PropTypes.bool,
  height: PropTypes.number,
  horizontalAlignWith: PropTypes.string,
  vertical: PropTypes.bool,
  verticalAlignWith: PropTypes.string,
  width: PropTypes.number
};
