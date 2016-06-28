// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

export function graphValue (value, min, max, size) {
  const scale = size / (max - min);
  return Math.floor(scale * (value - min));
};

export class trackSize {

  constructor (props, onSize) {
    this._width = props.width;
    this._height = props.height;
    this._size = { width: props.width, height: props.height };
    this._onSize = onSize;
  }

  _measure () {
    const rect = this._element.getBoundingClientRect();
    this._size.width = this._width || Math.round(rect.width);
    this._size.height = this._height || Math.round(rect.height);
    this._onSize(this._size);
  }

  _onResize () {
    // debounce
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(this._measure, 50);
  }

  size () {
    return this._size;
  }

  start (element) {
    this._element = element;
    if (! this._width || ! this._height) {
      window.addEventListener('resize', this._onResize);
      // delay just a bit to allow the browser to lay things out
      setTimeout(this._measure.bind(this), 3);
    }
  }

  reset (props) {
    this._width = props.width;
    this._height = props.height;
    this._size.width = props.width || this._size.width;
    this._size.height = props.height || this._size.height;
    this._onSize(this._size);
  }

  stop () {
    window.removeEventListener('resize', this._onResize);
    this._element = undefined;
  }
}
