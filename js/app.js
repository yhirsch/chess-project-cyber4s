const BOARD_SIZE = 8;
const WHITE_PLAYER = 'white';
const BLACK_PLAYER = 'black';

const PAWN = 'pawn';
const ROOK = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const KING = 'king';
const QUEEN = 'queen';
//add names so it can be accessed in array
const PIECES = [ROOK, KNIGHT, BISHOP, KING, QUEEN, BISHOP, KNIGHT, ROOK];

const CHESS_BOARD_ID = 'chess-board';

let game;
let table;
let selectedPiece;
//The game doesn't track turns, so turns keeps track
let turn = 0

//
function tryUpdateSelectedPiece(row, col) {
  // Clear all previous possible moves
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      table.rows[i].cells[j].classList.remove('possible-move');
      table.rows[i].cells[j].classList.remove('selected');
    }
  }

  // Show possible moves
  const piece = game.boardData.getPiece(row, col);
  if (piece !== undefined) {
    let possibleMoves = game.getPossibleMoves(piece);
    for (let possibleMove of possibleMoves) {
      const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
      cell.classList.add('possible-move');
    }
  }

  table.rows[row].cells[col].classList.add('selected');
  selectedPiece = piece;
}
//id needs to be declared
function onCellClick(row, col, id) {
  // selectedPiece - The current selected piece (selected in previous click)
  // row, col - the currently clicked cell - it may be empty, or have a piece.
  if (selectedPiece !== undefined && game.tryMove(selectedPiece, row, col)) {
    selectedPiece = undefined;
    // Recreate whole board - this is not efficient, but doesn't affect user experience
    createChessBoard(game.boardData);
    //if piece successfully moves, increment turn
    turn = turn + 1
    if(turn % 2 === 0){
document.getElementById(id).style.transform = "rotate(180deg)";
    }
  } else {
    tryUpdateSelectedPiece(row, col);
  }
}

// Adds an image to cell with the piece's image
function addImage(cell, player, name) {
  const image = document.createElement('img');
  if (turn % 2 !== 0){
    //I need to check if its not even 
    image.src = 'invertedimages/' + player + '/' + name + '.png';
  }else{
    image.src = 'images/' + player + '/' + name + '.png';
  }
  image.draggable = false;
  cell.appendChild(image);
}

function createChessBoard(boardData) {
  table = document.getElementById(CHESS_BOARD_ID);
  if (table !== null) {
    table.remove();
  }

  // Create empty chess board HTML:
  table = document.createElement('table');
  table.id = CHESS_BOARD_ID;
  document.body.appendChild(table);
  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowElement = table.insertRow();
    for (let col = 0; col < BOARD_SIZE; col++) {
      const cell = rowElement.insertCell();
      if ((row + col) % 2 === 0) {
        cell.className = 'light-cell';
      } else {
        cell.className = 'dark-cell';
      }//add chess id so I can use call it from Addimage
      cell.addEventListener('click', () => onCellClick(row, col, CHESS_BOARD_ID));
    }
  }

  // Add pieces images to board
  for (let piece of boardData.pieces) {
    const cell = table.rows[piece.row].cells[piece.col];
    addImage(cell, piece.player, piece.type);
  }

  if (game.winner !== undefined) {
    const winnerPopup = document.createElement('div');
    // black -> B + lack -> Black
    const winner = game.winner.charAt(0).toUpperCase() + game.winner.slice(1);
    winnerPopup.textContent = winner + ' player wins!';
    winnerPopup.classList.add('winner-dialog');
    table.appendChild(winnerPopup)
  }

}

function initGame() {
  game = new Game(WHITE_PLAYER);
  createChessBoard(game.boardData);
}

window.addEventListener('load', initGame);
