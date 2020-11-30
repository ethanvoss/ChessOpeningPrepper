function updatePgn(moveIn)
{
	if(moveIn == "undo")
		{
			pgnMoves.pop();
			if(displaySide == side) pgnMoves.pop();
		}
	else
		{
			pgnMoves.push(moveIn);
		}
	//create pgn
	var pgn = document.getElementById("moveList");
	pgn.innerHTML = "";
	var row = document.createElement("li");
	var count = 0;
	var space = "";
	for(i = 0; i < pgnMoves.length; i++)
		{
			if(count > 0) space = " "; else space = "";
			if(count > 1)
				{
					count = 0;
					pgn.appendChild(row);
					row = document.createElement("li");
				}
			row.innerHTML += space + pgnMoves[i];
			count++;
		}
	pgn.appendChild(row);
	pgnDisplay = pgn;



}

function updateFaced(incoming)
{
	var display = document.getElementById("faced")
	display.innerHTML = "The most common response in their games is " + incoming["move"] + "which theyve faced " + incoming["timesPlayed"] + " times.";
}

function updateMoveDisplay(oMove)
{
	var display = document.getElementById('moveDisplay');
	display.innerHTML = "their move is " + oMove["move"] + ". theyve played this " + oMove["timesPlayed"] + " times in this position."
}