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