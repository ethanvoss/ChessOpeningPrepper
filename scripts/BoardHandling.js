var config = {
      position: 'start',
      draggable: true,
      onDrop: onDrop
    }
var board = Chessboard('board', config);

function onDrop (source, target, piece, newPos, oldPos, orientation) {
  if(source == target) return; //no move was made

  //find move in san
  //P(x)CR
  var move = source + "-" + target;
  currentFen.push(moveToFen(currentFen[pieceMoves],move));
  updatePgn(uciToSan(currentFen[pieceMoves],move));
  makeMove(move, "board move");

}
