document.getElementById('submit').addEventListener('click', function(){
	var user = document.getElementById('input').value;
	var type = document.getElementById('types').value;
	side = document.getElementById('side').value;
	var limit = document.getElementById('limit').value;
	oppSide = "black";
	if(side == "black") oppSide = "white";

	//initialize board
    var config = 
      {
        draggable: true,
        dropOffBoard: 'snapback', 
        position: 'start',
        orientation: side
      }

    board = Chessboard('board', config);

	fetchFromLichess(user,type,limit,oppSide);

	//remove input elements
	var inputdiv = document.getElementById('inputdiv');
	inputdiv.innerHTML = '';

	//loading status
	var loadingStatus = document.getElementById('loadingstatus');
	var status = document.createElement("H3");
	status.setAttribute('id','status');
	status.textContent = "Loading " + user + "'s games";
	loadingStatus.appendChild(status);

});

