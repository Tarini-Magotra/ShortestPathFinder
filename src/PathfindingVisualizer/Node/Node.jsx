import React, { Component } from 'react';
import './Node.css';

export default class Node extends Component {
  handleMouseDown = () => {
    const { row, col, onMouseDown, isWall, isTraffic } = this.props;
    if (!isWall && !isTraffic && this.isShiftPressed()) {
      this.props.onToggleTraffic(row, col);
    } else {
      onMouseDown(row, col);
    }
  };

  handleMouseEnter = () => {
    const { row, col, onMouseEnter, isWall, isTraffic } = this.props;
    if (!isWall && !isTraffic && this.isShiftPressed()) {
      this.props.onToggleTraffic(row, col);
    } else {
      onMouseEnter(row, col);
    }
  };

  isShiftPressed = () => {
    return window.event.shiftKey;
  };

  render() {
    const { col, isFinish, isStart, isWall, isTraffic, onMouseUp, row } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : isTraffic
      ? 'node-traffic'
      : '';

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={this.handleMouseDown}
        onMouseEnter={this.handleMouseEnter}
        onMouseUp={onMouseUp}
      ></div>
    );
  }
}

