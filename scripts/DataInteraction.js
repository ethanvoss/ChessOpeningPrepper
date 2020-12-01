function newMove()
{
	var input = document.getElementById('moveInput');
	var playerMove = input.value;
	var move = expandMove(currentFen[pieceMoves], input.value, side);

	if(move != "err")
		{
			currentFen.push(moveToFen(currentFen[pieceMoves], move));
			makeMove(move);
			input.value = "";

			updatePgn(playerMove);		
		}
	else
		{
			console.log("error with move input");
		}



	//findMove(input.value);
}


function findMove()
{
	var oppSide = "white";
	if(side == "white") oppSide = "black";

	var pool = [];
	for(var g in games)
	{
		if(games[g].fens[pieceMoves] == currentFen[pieceMoves])
		{
			pool.push(games[g]);
		}
	}
	if(pool.length < 1)
	{
		return "noGames";
	}
	//find most common move
	var movePool = {};
	for(var i in pool)
		{

			var game = pool[i];
			var move = game.moves[pieceMoves+1];	
			//adds all moves played in this position to movePool
			var found = false;
	            for (var mov in movePool) 
		            {
		                if (mov == move) 
			                {
			                    found = true;
			                    movePool[move] += 1;
			                    continue;
			                }
		            }
	            if (!found) movePool[move] = 1;
		}

	var moveCount = 0;
	var playedMove;
	//find most played move
	for(var mov in movePool)
		{
			if(movePool[mov] > moveCount)
				{
					moveCount = movePool[mov];
					playedMove = mov;
				}
		}
	var out = 
	{
		"move" : playedMove,
		"timesPlayed" : moveCount
	}

	//handle opp move
	if(displaySide == side)
		{
			oppMove = playedMove;
			updateMoveDisplay(out);
		}
	return out;

}



function makeMove(move, source)
{
	console.log("making move " + move);
	source = source || false;
	if(!source) board.move(move);
	pieceMoves++;
	updateFaced(findMove());
	
	if(displaySide == "white") displaySide = "black";
	else displaySide = "white";
	
	if(displaySide == side)
	{
		openingFetch();
	}
	var comparer = 1;
	if(side == "black") comparer = 0;
	if(pieceMoves % 2 == comparer)
		{
			//opponents move
			var findmove = findMove();
			if(findmove == "noGames")
				{
					var display = document.getElementById('moveDisplay');
					display.innerHTML = "They have never reached this position in the loaded games.";
				}
			else
				{
					updatePgn(findmove["move"]);
					var oMove = expandMove(currentFen[pieceMoves], findmove["move"],oppSide);
					currentFen.push(moveToFen(currentFen[pieceMoves], oMove));

					makeMove(oMove);
				}
		}
}






function undo()
{
	if(pieceMoves > 1)
	{
		//undo possible
		currentFen.pop();
		pieceMoves -= 1;
		if(displaySide == side)
			{
				console.log("same side");
				currentFen.pop();
				pieceMoves -= 1;	
			}
		else
			{
				if(displaySide == "white") displaySide = "black";
				if(displaySide == "black") displaySide = "white";
			}
		
		findMove();
		updateFaced(findMove());
		updatePgn("undo");
		var newPos = fenToBoardFen(currentFen[pieceMoves]);
		board.position(newPos,true);
	}
}


function updatePopular(data)
{
	var move = data.moves[0];
	console.log(move['san']);
	var display = document.getElementById('popular');
	display.innerHTML = "The popular line here is " + move['san'] + ".";
}

function openingFetch()
{
var api = "https://explorer.lichess.ovh/master?variant=standard&fen=";
//api += "r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R";
api += fenToBoardFen(currentFen[pieceMoves]);
console.log(api);
// add b if it is blacks move
if(pieceMoves % 2 != 0) api += " b"; 
fetch(api).then(function(e){
  return e.json();
}).then(function(data){
  updatePopular(data);
}).catch(err => console.log(err));
//return dataOut;
}