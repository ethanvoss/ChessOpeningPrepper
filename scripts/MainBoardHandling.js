function makeMove(moveIn, side)
{
	var currentFen = fenArr[pieceMoves].fen
	var move = expandMove(currentFen,moveIn,side);
	fenArr.push(new fenObj(moveToFen(currentFen,move)));
	board.move(move);
	moveNum++;
}


