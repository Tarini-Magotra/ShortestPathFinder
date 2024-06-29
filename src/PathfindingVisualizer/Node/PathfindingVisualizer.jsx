import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';
import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown = (row, col, isShiftPressed) => {
    const newGrid = isShiftPressed
      ? getNewGridWithTrafficToggled(this.state.grid, row, col)
      : getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  };

  handleMouseEnter = (row, col, isShiftPressed) => {
    if (!this.state.mouseIsPressed) return;
    const newGrid = isShiftPressed
      ? getNewGridWithTrafficToggled(this.state.grid, row, col)
      : getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  };

  handleMouseUp = () => {
    this.setState({ mouseIsPressed: false });
  };

  handleToggleTraffic = (row, col) => {
    const newGrid = getNewGridWithTrafficToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  };

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra = () => {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <div>
        <button onClick={this.visualizeDijkstra}>
          Visualize Dijkstra's Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => (
                <Node
                  key={nodeIdx}
                  col={node.col}
                  row={node.row}
                  isStart={node.isStart}
                  isFinish={node.isFinish}
                  isWall={node.isWall}
                  isTraffic={node.isTraffic}
                  mouseIsPressed={mouseIsPressed}
                  onMouseDown={(row, col, isShiftPressed) =>
                    this.handleMouseDown(row, col, isShiftPressed)
                  }
                  onMouseEnter={(row, col, isShiftPressed) =>
                    this.handleMouseEnter(row, col, isShiftPressed)
                  }
                  onMouseUp={this.handleMouseUp}
                  onToggleTraffic={this.handleToggleTraffic}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => ({
  col,
  row,
  isStart: row === START_NODE_ROW && col === START_NODE_COL,
  isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
  distance: Infinity,
  isVisited: false,
  isWall: false,
  isTraffic: false,
  previousNode: null,
});

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithTrafficToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isTraffic: !node.isTraffic,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

