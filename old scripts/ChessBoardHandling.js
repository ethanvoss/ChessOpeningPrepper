//add undo and reset functions

//board fen desyncs
//looks for black or white pieces
// include     <div id="board1" style="width: 40%"></div> in html
var config = {
  draggable: true,
  dropOffBoard: 'snapback', // this is the default
  position: 'start'
}

var fen; 
var board = Chessboard('board1', config);

console.log(fixFen(board.fen()));
function makeMove(moveIn, side)
{
	board.move(newMove(moveIn, side));

}

function newMove(moveIn, side)
{
	//goal: create a move that the board can use from an incoming move 
	//example 'e4' => 'e2-e4'
	fen = fixFen(board.fen().split('/'));
	var xValues = ['a','b','c','d','e','f','g','h'];
	var yValues = ['8','7','6','5','4','3','2','1'];
	var moveInArr = moveIn.split('');
	//remove check tag from move
	if(moveInArr[moveInArr.length-1] == "+" || moveInArr[moveInArr.length-1] == "#")
	{
		console.log("check detected");

	 	moveInArr.pop();
	 	console.log(moveInArr);
	}
	var moveOut;
	var newPos = moveIn;
	var prevPos;
	var newPos = (moveInArr[moveInArr.length-2] + moveInArr[moveInArr.length-1]);
	var piece;
	const Pieces = ["K", "Q", "R", "B", "N", "P"];
	var capture = checkCapture(moveIn);
	
	const pieceMoves = [
	"King",
	"Queen/1,0/-1,0/0,1/0,-1/1,1/1,-1/-1,-1/-1,1/Loop",
	"Rook/1,0/-1,0/0,1/0,-1/Loop",
	"Bishop/1,1/1,-1/-1,-1/-1,1/Loop",
	"Knight/-2,1/-1,2/1,2/2,1/-2,-1/-1,-2/1,-2/2,-1/NoLoop"

	]

	fen = fixFen(fen);

	//goal: get prevPos. method? check for what piece was moves, then look for that piece in valid squares
		//get piece symbol in fen
		switch(moveInArr[0])
		{
			case "K":
				piece = 0;
				break;
			case "Q":
				piece = 1;
				break;
			case "R":
				piece = 2;
				break;
			case "B":
				piece = 3;
				break;
			case "N":
				piece = 4;
				break;
			default:
				piece = 5;
				break;
		}

		if(piece == 5){
			piece = Pieces[piece];
			if(side == "black") piece = piece.toLowerCase();
		}
		//Pawn Cap
		if(true)
		{	
			if(piece == "P" && capture)
			{
				//White pawn cap
				var prevPosX = moveInArr[0];
				var prevPosY = (parseInt(moveInArr[3]) - 1).toString();
				prevPos = prevPosX + prevPosY;
			}
			if(piece == "p" && capture)
			{
				//black pawn cap
				var prevPosX = moveInArr[0];

				var prevPosY = (parseInt(moveInArr[3]) + 1).toString();
				prevPos = prevPosX + prevPosY;
				console.log(prevPos);
			}
		}

		//Pawn move
		if(true)
		{
			if(piece == "P" && !capture)
			{
				var xIn = moveInArr[0];
				var x;
				var y = moveInArr[1];
				//find x
				for(var i = 0; i < xValues.length; i++)
				{
					if(xValues[i] == xIn)
					{
						x = i;
						break;
					}
				}

				prevPos = xIn + (parseInt(y) - 1).toString();
				//check for double
				if(y == 4)
				{
					//check in fen for P at x2
					
					var row = fen[1].split('');
					console.log("found double");
					
					console.log(fen)

							if(row[x] == "p")
							{
								prevPos = xIn + "2".toString();
							}
							
						
					
				}
			}
			if(piece == "p" && !capture)
			{
				var xIn = moveInArr[0];
				var x;
				var y = moveInArr[1];
				//find x
				for(var i = 0; i < xValues.length; i++)
				{
					if(xValues[i] == xIn)
					{
						x = i;
						break;
					}
				}

				prevPos = xIn + (parseInt(y) + 1).toString();
				
				//check for double
				if(y == 5)
				{
					
					//check in fen for P at x7
					var index = 0;
					var row = fen[6].split('');
					for (var r in row)
					{
						var p = row[r];
						if(p == "1" || p == "2" || p == "3" || p == "4" || p == "5" || p == "6" || p == "7" || p == "8")
						{
							index += parseInt(p);
							continue;
						} else
						{
							
							if(index == x && row[r] == "p")
							{
								prevPos = xIn + "7".toString();
								break;
							}
							index++;
						}
					}
				}
			}

		}

		//Do Piece Move

		//breaks on night move. y is at 51 somehow
		console.log(piece);
		if(piece != "p" && piece != "P")
		{
			var coords;
			var piecemove = pieceMoves[piece].split('/');
			var instruct = [];
			//find startingPos
			console.log(moveInArr);
			var startPosX;
			var startPosY = parseInt(moveInArr[moveInArr.length-1]) - 1;
			for(var i in xValues)
			{
				if(xValues[i] == moveInArr[moveInArr.length-2]) startPosX = i;
			}
			
			console.log("starting pos " + startPosX + " " + startPosY);


			for(var i = 1; i < piecemove.length-1; i++)
			{
				instruct.push(piecemove[i]);
			}
			
			var found = false;
			var lookingfor = Pieces[piece];
			console.log(lookingfor);
			console.log(instruct);
			for(var i = 0; i < instruct.length; i++)
			{
				
				
				var instruction  = instruct[i].split(',');
				console.log("looking with " + instruction);
				//console.log(piecemove);
				if(piecemove[piecemove.length-1] == "Loop")
				{
					//Piece loops
					console.log("starting search for " + piece);
					var x = parseInt(startPosX);
					var y = parseInt(startPosY);
					var search = true;
					var timesSearched = 0;
					
					while(search)
					{						
						if(timesSearched > 200) search = false;
						if(found == true) search = false;
						if(x > 7 || x < 0) search = false;
						if(y > 7 || y < 0) search = false;
						if(search == false) break;

						console.log("looking in " + fen[y]);
						if(fen[y].split('')[x].toUpperCase() == lookingfor)
						{
							prevPos = xValues[x] + (y + 1).toString();
							console.log("pieceFound");
							found = true;
						}
						else
						{
							console.log(" checked " + x + " " + y);
							x = x + parseInt(instruction[0]);
							y = y + parseInt(instruction[1]);
						}
						timesSearched++;
					}
				}
				else
				{
					//nite moves

					console.log("starting seach");
					var x = parseInt(startPosX) + parseInt(instruction[0]);
					var y = parseInt(startPosY) + parseInt(instruction[1]);
					console.log(fen);
					console.log(startPosY);
					console.log(fen[y]);
						if(fen[y].split('')[x].toUpperCase() == lookingfor)
						{
							prevPos = xValues[x] + (y + 1).toString();
							console.log("pieceFound");
							found = true;
						}						
					
				}
				if(found == true) break;

			}
			if(found == false) console.log("piece not found");

		}
	moveOut = prevPos + '-' + newPos;
	console.log(moveOut);
	
	
	return moveOut;

}

function checkCapture(moveIn)
{
	var moveArr = moveIn.split('');
	for(var c in moveArr)
	{
		if(moveArr[c] == "x") return true;
	}
	return false;
}

function fixFen(fen)
{
	var iConversion = ['7','6','5','4','3','2','1','0'];
	for(var i in fen)
	{
		var line
		var newLine = "";
		line = fen[i].split('');
		for (var j = 0; j <= 7; j++)
		{
			if(j >= line.length) break;
			if(line[j] == "1" || line[j] == "2" || line[j] == "3" || line[j] == "4" || line[j] == "5" || line[j] == "6" || line[j] =="7" ||line[j] == "8")
			{
				for(var k = 0; k < parseInt(line[j]); k++)
				{
					newLine = newLine + "0";
				}
			}
			else
			{
				newLine = newLine + line[j];
			}
		}

		fen[iConversion[i]] = newLine;

	}
	return fen;	
}