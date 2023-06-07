'use strict';

import './toggler.js';
import { Grid } from './grid.js';
import { Tile } from './tile.js';

const gameBoard = document.getElementById('game-board');
const gameOverWindow = document.getElementById('game-over');
const tryAgainButton = document.getElementById('try-again');
const newGameButton = document.getElementById('new-game');
const scoreElement = document.getElementById('score');


const grid = new Grid(gameBoard);
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  
let isInputActive = true;
setupInput();

const inputHandlers = {
  ArrowUp: {
    canMove: () => canMoveUp(),
    move: async() => moveUp(),
  },
  ArrowDown: {
    canMove: () => canMoveDown(),
    move:async() => moveDown(),
  },
  ArrowLeft: {
    canMove:() => canMoveLeft(),
    move:async() => moveLeft(),
  },
  ArrowRight: {
    canMove:() => canMoveRight(),
    move:async() => moveRight(),
  },
};

function setupInput() {
  window.addEventListener('keydown', handleInput);
}

async function handleInput(event) {
  if (!isInputActive) {
    return;
  }

  isInputActive = false;

  const handler = inputHandlers[event.key];
  if (handler) {
    if (!handler.canMove()) {
      isInputActive = true;
      return;
    }
    await handler.move();
  }

  const newTile = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveDirection()) {
    await newTile.waitForAnimationEnd();
    displayGameOver();
    return;
  }

  isInputActive = true;
}

const moveUp = async() =>{
  await slideTiles(grid.cellsGroupedByColumn);
  isInputActive = true;

}

const moveDown = async() =>{
  await slideTiles(grid.cellsGroupedByReversedColumn);
  isInputActive = true;

}

const moveLeft = async() =>{
  await slideTiles(grid.cellsGroupedByRow);
  isInputActive = true;
  
}

const moveRight = async() =>{
  await slideTiles(grid.cellsGroupedByReversedRow);
  isInputActive = true;

}

const slideTiles = async(groupedCells) =>{
  const promises = [];

  groupedCells.forEach(group => slideTilesInGroup(group, promises));

  await Promise.all(promises);

  grid.cells.forEach((cell) => {
    if (cell.hasTileForMerge()) {
      cell.mergeTiles();
      let mergedValue = cell.getMergedTileValue();
      calculateScore(mergedValue);
     }
  });

}

const slideTilesInGroup = (group, promises) =>{
  for (let i = 1; i < group.length; i++){
    if(group[i].isEmpty()){
      continue;
    }

    const cellWithTile = group[i];

    let targetCell;
    let j = i - 1;
    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)){
      targetCell = group[j];
      j--;
    }

    if(!targetCell){
      continue;
    }

    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

    if(targetCell.isEmpty()){
      targetCell.linkTile(cellWithTile.linkedTile);
    }else{
      targetCell.linkTileForMerge(cellWithTile.linkedTile);
    }

    cellWithTile.unlinkTile();
  }
}

const canMoveUp = () => canMove(grid.cellsGroupedByColumn);

const canMoveDown = () => canMove(grid.cellsGroupedByReversedColumn);

const canMoveLeft = () => canMove(grid.cellsGroupedByRow);

const canMoveRight = () => canMove(grid.cellsGroupedByReversedRow);


const canMoveDirection = () =>{
    return (
      canMoveLeft()||
      canMoveRight() ||
      canMoveDown() ||
      canMoveUp()
    );
  }

const canMove = (groupedCells) => groupedCells.some(group => canMoveInGroup(group));

const canMoveInGroup = (group) => {
  return group.some((cell, index) => {
    if(index === 0){
      return false;
    }

    if(cell.isEmpty()){
      return false;
    }

    const targetCell = group[index -1];
    return targetCell.canAccept(cell.linkedTile);
  });
}

const displayGameOver = () =>{
   gameOverWindow.style.display = "block";
   tryAgainButton.addEventListener('click', tryAgain);
}

const tryAgain = () => {
  removeTiles();
  grid.cells.forEach(cell => cell.unlinkTile());
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));

  resetScore();
  isInputActive = true;
  gameOverWindow.style.display = 'none';
}

const removeTiles = () => {
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach(tile => tile.remove());
}

newGameButton.addEventListener('click', tryAgain);


const bestScoreElement = document.getElementById('best-score');

let score = 0;
let bestScore = 0;

function calculateScore(value) {
  score += value;
  updateScore();
}

function updateScore() {
  scoreElement.textContent ='Score: ' + score;
  if (score > bestScore) {
    bestScore = score;
    bestScoreElement.textContent ='Best: ' + bestScore;
  }
}

function resetScore() {
  score = 0;
  updateScore();
}














