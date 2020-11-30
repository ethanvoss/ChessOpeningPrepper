function fetchFromLichess(user, type,limit,side)
{
  console.log("Loading ");
  const api = "https://lichess.org/api/games/user/";
  var perams = "?color=" + side;

  if(type != "all") { //if something other than "all" is selected, add game type to params
    perams += "&perfType=" + type;
  }
  if(limit != "")
  {
    perams += "&max=" + limit; //adds limit to how many games are pulled
  }

  fetch(api + user + perams).then(function(res) { //make request to lichess for the games
    return res.text();
  }).then(function(data){
    //set status
    document.getElementById('status').textContent = "Games loaded";
    //send pulled data to be disected
    disectPgn(data, user);
    console.log(data);
  }).catch(err => console.log(err))

}

function disectPgn(data, user)
{
  var pgn = data.split('\n');

  var tempGames = [];
 
  var pullNextGame = false;
  for(var i in pgn)
  {
    var line = pgn[i].split(''); 
    if(line[0] == "1")
      tempGames.push(pgn[i]);
  }
  initializeGames(tempGames);
}