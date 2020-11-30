var outgoingFens = [];
outgoingFens.push(baseFen.getFen());
console.log(outgoingFens[0]);

function initializeGames(pgnArr)
{
  for(var i in pgnArr)
    {
      var pieceMoves = 0;
      var moveNumber = 1;
      var g = pgnArr[i].split(' ');
      var game = new Game([]);
      game.addFen(baseFen.getFen());

      for(var j = 0; j < g.length; j++)
        {
          if(g[j] == moveNumber.toString() + ".")
            {
              
              var whiteMove = g[j+1];
              var blackMove = g[j+2];

              //break on castling bc i cant handle it as a move yet
              if(whiteMove == "O-O") break;
              if(blackMove == "O-O") break;
              if(whiteMove == "O-O-O") break;
              if(blackMove == "O-O-O") break;


              //expands whites move
              whiteMove = expandMove(game.fens[pieceMoves],whiteMove,"white");
              if(whiteMove == "err") break; //breaks if expandMove() cant expand

              //adds fen
              var newFen = (moveToFen(game.fens[pieceMoves],whiteMove));
              game.addFen(newFen,g[j+1]);
              pieceMoves++;
              
              console.log(blackMove);
              blackMove = expandMove(game.fens[pieceMoves],blackMove,"black");
              if(blackMove == "err") break;

              newFen = moveToFen(game.fens[pieceMoves],blackMove);
              
              game.addFen(newFen,g[j+2]);
              pieceMoves++;
              moveNumber++;
            } 
        }
        games.push(game);
    }
  
    console.log(games);
    setupUserInput();
    if(side == "black")
    {
      var findmove = findMove();
      var oMove = expandMove(currentFen[0], findmove["move"],oppSide);
      currentFen.push(moveToFen(currentFen[0], oMove));
      makeMove(oMove);
      updatePgn(findmove["move"]);
    }
}

class Game
{
  constructor(fens)
  {
    this.fens = fens;
    this.moves = [];
  }

  addFen(fen,move)
  {
    this.fens.push(fen);
    this.moves.push(move);
  }
}



function setupUserInput()
{
  //creates new input ui
  var instruction = document.createElement("label");
  instruction.setAttribute('for','MoveInput');
  instruction.innerHTML = 'Enter your move:';
  var newInput = document.createElement("input");
  newInput.setAttribute('id','moveInput');
  newInput.setAttribute('name','MoveInput');
  var linebreak = document.createElement("p");
  var newButton = document.createElement("button");
  newButton.setAttribute('id','moveSubmit');
  newButton.innerHTML = 'Submit';
  newButton.onclick = newMove;

  var undoButton = document.createElement('button');
  undoButton.setAttribute('id','undoButton');
  undoButton.innerHTML = 'Undo';
  undoButton.onclick = undo;

  //add new inputs to input div
  var inputDiv = document.getElementById('inputdiv');
  inputDiv.appendChild(instruction);
  inputDiv.appendChild(newInput);
  inputDiv.appendChild(newButton);
  inputDiv.appendChild(undoButton);
}