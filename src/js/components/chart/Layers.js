// (C) Copyright 2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes, Children } from 'react';

export default class Layers extends Component {

  // constructor (props) {
  //   super(props);
  //   this._onResize = this._onResize.bind(this);
  //   this._layout = this._layout.bind(this);
  //   this.state = { height: props.height, width: props.width };
  // }
  //
  // componentDidMount () {
  //   this._layout();
  // }
  //
  // _layout () {
  //   const { height, width } = this.props;
  //   if (! height) {
  //     this.setState({ height: Math.floor(rect.height) });
  //   }
  //   if (! width) {
  //     this.setState({ width: Math.floor(rect.width) });
  //   }
  // }

  render () {
    const { height, width } = this.props;
    let style = {};
    if (height) {
      style.height = `${height}px`;
    }
    if (width) {
      style.width = `${width}px`;
    }

    let children = Children.map(this.props.children, child => {
      console.log('!!! Layers render', child);
      // child ? React.cloneElement(child, { style: { flexBasis: basis }}) : child
      return child;
    });

    return (
      <div ref="layers" className="layers" style={style}>
        {children}
      </div>
    );
  }

};

Layers.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number
};
