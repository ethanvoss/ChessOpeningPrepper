const cConvert = ["a","b","c","d","e","f","g","h"];

function fenToString(fenIn)
{
	var fenOut = "";
	for(var x = 0; x < fenIn.length; x++)
	{
		if(x > 0) fenOut += "/";
		for(var y = 0; y < fenIn[x].length; y++)
		{
			fenOut += fenIn[x][y];
		}
	}

	return fenOut;
}

function stringToFen(fenIn)
{
	var fen = fenIn.split('');
	var fenOut = [];
	var row = [];
	var r = 0;
	
	for (var i in fen)
	{
		if(fen[i] == "/")
		{
			fenOut.push(row);
			row = [];
			continue;
		}
		row.push(fen[i]);

	}
	fenOut.push(row);
	return fenOut;
}

function fenToBoardFen(fen)
{
	var fenArr = fen.split('');
	var fenOutArr = [];
	var counter = 0;
	var onEmpty = false;
	for(var i in fenArr)
		{
			if(fenArr[i] == "0")
				{
					counter++;
					onEmpty = true;
				}
			else
				{
					if(onEmpty)
					{
						fenOutArr.push(counter.toString());
						counter = 0;
						onEmpty = false;
					}
					fenOutArr.push(fenArr[i]);
				}
		}
	var fenOut = "";
	for(var i in fenOutArr) fenOut+= fenOutArr[i];
	return flipFen(fenOut);
}

function flipFen(fen)
{
	var fenIn = fen.split('/');
	var fenOut = "";
	for(var i = fenIn.length - 1; i >= 0; i--)
	{
		var row = "";
		if(i < fenIn.length - 1) row += "/";
		row += fenIn[i];
		fenOut += row;
	}

	return fenOut;

}

function uciToSan(fen, uci)
{
	fen = stringToFen(fen);
	var oldPos = uci.split('-')[0];
	var newPos = uci.split('-')[1];
	var oldC, newC;
	for(var i = 0; i < cConvert.length; i++)
	{
		var c = cConvert[i];
		if(oldPos.split('')[0] == c) oldC = i;
		if(newPos.split('')[0] == c) newC = i;
	}
	var oldR = oldPos.split('')[1];
	var newR = newPos.split('')[1];

	var piece = fen[parseInt(oldR) - 1][oldC];
	var capture = "";
	var san;
	console.log("looking at " + (parseInt(oldR) - 1) + " " + oldC)
	console.log(fen);

	if(fen[newR][newC] != "0") capture = "x";
	console.log(piece);
	if(piece.toLowerCase() == "p")
		{
			//piece is a pawn
			if(capture == "x") san = oldR + capture + newPos;
			else san = newPos;
		}
	else
		{
			san = piece.toUpperCase() + capture + newPos;
		}
	return san;

}