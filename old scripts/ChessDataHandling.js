    //requires p with id instruction, div with id inputdiv, input with id input, p with id loadingstatus, div with id output
    const api = "http://lichess.org/api/games/user/";
    var user;
    const input = document.getElementById('input');
    const log = document.getElementById('loadingstatus');
    var importedGames;
    const outputdiv = document.getElementById('output');
    const instruct = document.getElementById('instruction');
    var side;
    var oppSide;
    var movenum = 1;
    var lastMove;

    var state = "pickingUser";

    var WhiteGames = [];
    var BlackGames = [];
    var pool = [];


    input.addEventListener('change', buttonPressed);

    function buttonPressed(e) { 
        if (state == "pickingUser")
        {
            pullGames(e);
        }
        if (state == "pickingSide")
        {
            setPool(e);
        }
        if (state == "gettingMoves")
        {
            play(e);
        }
    }

    //setup
    function pullGames(e) {
        log.textContent = "Loading...";

        user = e.target.value;
        fetch(api + user)
            .then(function (res) { 
                return res.text();

            }).then(function (data) { 
                log.textContent = "Loaded";
                importedGames = data.split("\n");
                createGameLists(importedGames, user);

                instruct.textContent = "enter the side you wish to play as";
                input.value = "";
                state = "pickingSide";
            })
    }

    //turn incoming data to array of games
    function createGameLists(incomingArr, playername)
    { 
        var nextSide;
        
        for (var i = 0; i < incomingArr.length; i++)
        { 
            
            //Find Side
            if (incomingArr[i].toLowerCase() == "[white \"" + playername.toLowerCase() + "\"]") nextSide = "white";
      
            if (incomingArr[i].toLowerCase() == "[black \"" + playername.toLowerCase() + "\"]") nextSide = "black"; 
            
            var line = incomingArr[i].split('');
            
            if (line[0] == "1")
            { 
                if (nextSide == "white") { 
                    WhiteGames.push(new Game(incomingArr[i], nextSide));
                }
                if (nextSide == "black") {
                    BlackGames.push(new Game(incomingArr[i], nextSide));
                }
            }
           

        }

    }

    //restrict pool to certain color
    function setPool(e)
    {
        side = e.target.value.toLowerCase();

        if(side == "white") oppSide = "black";
        if(side == "black") oppSide = "white";

        if (side == "white") pool = BlackGames;
        if (side == "black") pool = WhiteGames;
        log.textContent = "Side chosen";

        //if white get opp move
        if (side == "black")
        {
            var oppMove = getOppMove()
            makeMove(oppMove["move"], oppSide);
            lastMove = oppMove["move"];
            log.textContent = "Their move is " + oppMove["move"] + " which was played " + oppMove["timesPlayed"] + " times";
        }


        input.value = "";
        instruct.textContent = "You may now enter moves";
        state = "gettingMoves";
    }

    //play loop
    function play(e)
    {
        var temp;
        if (e.target.value != "")
        {
            if (side == "white") {
                console.log(pool);
                temp = e.target.value;
                lastMove = temp;
                makeMove(temp, side);
                
                fixPool("white");

                var oppMove = getOppMove()
                lastMove = oppMove["move"];
                makeMove(oppMove["move"], oppSide);
                log.textContent = "Their move is " + oppMove["move"] + " which was played " + oppMove["timesPlayed"] + " times";
                

                fixPool("black");
                addToOutputDiv(movenum + ". " + temp + " " + lastMove);
                movenum++;

                input.value = "";
            }
            if (side == "black") {
                console.log(pool);
                fixPool("white");
                temp = e.target.value;
                makeMove(temp, side);
                
                console.log(lastMove);
                addToOutputDiv(movenum + ". " + lastMove + " " + temp);
                lastMove = temp;
                fixPool("black");
                movenum++;

                var oppMove = getOppMove()
                makeMove(oppMove["move"], oppSide);
                lastMove = oppMove["move"];
                log.textContent = "Their move is " + oppMove["move"] + " which was played " + oppMove["timesPlayed"] + " times";
                input.value = "";
            }
        }
    }

    function getOppMove()
    {
        var moves = {};
        
        for (var i in pool)
        {
            var g = pool[i];
            
            
            //get move for this turn
            var indexAdder = 0; if (side == "black") indexAdder = 1; if (side == "white") indexAdder = 2;
            var move;
            var numberName = movenum.toString() + ".";
            
            
            for (var k = 0; k < g.gameArr.length; k++)
            {
                if (g.gameArr[k] == numberName) move = g.gameArr[k + indexAdder];
            }
            
            var found = false;
            for (var mov in moves) {
                if (mov == move) {
                    found = true;
                    moves[move] += 1;
                    continue;
                }
            }
            if (!found) {
                moves[move] = 1;
            }

           
            
        }

        var mostPlayed;
        var playCount = 0;
        
        //console.log(moves)
        for (var m in moves)
        {
            
            if (moves[m] > playCount)
            {
                mostPlayed = m;
                playCount = moves[m];
            }
        }
        var sorted = {
            "move" : mostPlayed,
            "timesPlayed" : playCount
        }
        //console.log(sorted);
        //log.textContent = ("Their Move is " + sorted[move] + " which was played " + sorted[timesPlayed] + " times");
        return sorted;
        
    }

    function fixPool(sideIn)
    {
        var returnPool = [];
        var numberName = movenum.toString() + ".";
        var indexAdder = 0; if (sideIn == "black") indexAdder = 2; if (sideIn == "white") indexAdder = 1;
        console.log(lastMove);
        for (var p in pool)
        {
            var g = pool[p];
            for (var k = 0; k < g.gameArr.length; k++) {
                if (g.gameArr[k] == numberName) {
                    if (g.gameArr[k + indexAdder] == lastMove) { 
                        returnPool.push(g);
                    }

                }
            }
        }
        //console.log(returnPool);
        pool = returnPool;
    }

    function addToOutputDiv(textIn)
    { 
        var tag = document.createElement("p");
        var text = document.createTextNode(textIn);
        tag.appendChild(text);
        outputdiv.appendChild(tag);
    }

    class Game
    { 
        constructor(pgn, side)
        { 
            this.pgn = pgn
            this.side = side;
            this.gameArr = pgn.split(' ');
        }
    
    }

    