var http = require('http');
var url = require('url');
var requests = 0;

var rooms = [{name:"Lobby",turn:0,num:0,score:0,dices:[0,0,0,0,0,0,0,0],bigdicenumber1:0,bigdicebasenumber1:0,bigdicenumber2:0,bigdicebasenumber2:0,showtakebutton:false,showrollallbutton:false,allowroll:true,chats:[],startscore:1000,players:0},{name:"Room #1",turn:0,num:1,score:0,dices:[0,0,0,0,0,0,0,0],bigdicenumber1:0,bigdicebasenumber1:0,bigdicenumber2:0,bigdicebasenumber2:0,showtakebutton:false,showrollallbutton:false,allowroll:true,chats:[],startscore:1000,players:0}];

var players = [];

			/* Button Codes:
                -1: Roll All Button
                0: Roll Button
                1: Dice 1
                2: Dice 2
                3: Dice 3
                4: Dice 4
                5: Dice 5
                6: Dice 6
                7: Big Dice 1
                8: Big Dice 2
                9: Take it Button
            */
console.log("Server Started.");


http.createServer(function (req, res) {
	//res.setHeader('Access-Control-Allow-Origin', 'http://waldoweb.net'); // Don't delete this line.
	res.setHeader('Access-Control-Allow-Origin', null); // For local testing.
	res.writeHead(200, {'Content-Type': 'text/html'});
	requests += 1;
	
	var q = url.parse(req.url, true);

	if(q.query.update != null){ // Then it is a game update request.  This function will require the number of the player that is requesting the data.
		//console.log("Update Request  " + requests);
		//console.log(q.query.update);
		var playerroom = players[q.query.update].room;
		var gamevalues = '{"d1":"' + rooms[playerroom].dices[0] + '", "d2":"' + rooms[playerroom].dices[1] + '", "d3":"'+rooms[playerroom].dices[2]
         + '", "d4":"'+rooms[playerroom].dices[3] + '", "d5":"' + rooms[playerroom].dices[4] + '", "d6":"' + rooms[playerroom].dices[5] + '", "turn":"'
		  + rooms[playerroom].turn + '", "bd1":"' + rooms[playerroom].dices[6] + '", "bd2":"' + rooms[playerroom].dices[7] + '", "score":"' + rooms[playerroom].score + '", "takebutton":"'
		   + rooms[playerroom].showtakebutton + '", "rollallbutton":"' + rooms[playerroom].showrollallbutton + '", "room":"' + playerroom + '"}';
		// Servers must return text in JSON format. eg. '{ "name":"John", "age":31, "city":"New York" }'
		res.end(gamevalues);
	}
	else if(q.path == '/setup'){ // Setup the player to start playing.
		console.log("Setup Request  " + requests);
		var p = 0;
		var n = 0;
		if(players.length == 0){
			players.push({name:"Player " + (players.length), num:players.length, ping:null, score:rooms[0].startscore, chat:rooms[0].chats.length, room:0});
		}
		else {
			for(var i=0;i<players.length+1;i++){
				if(players[i] == undefined){
					players[i] = {name:"Player " + i.toString(), num:i, ping:null, score:rooms[0].startscore, chat:rooms[0].chats.length, room:0}
					p = "Player " + i.toString();
					n = i;
					i = players.length+1;
				}
			}
		}
		players[n].ping = setTimeout(function(){
			delete players[n];
			console.log("Kicked player " + p);
			rooms[0].chats.push("Player " + p + " left the game.");
			console.log(players);
			console.log("players.length: " + players.length);
		}, 10000);
		console.log("Player " + players[n].name  + " has joined");
		setTimeout(function(){ 
			rooms[0].chats.push(players[n].name + " has joined the game.");
		}, 1000);
		res.end('{"player":"' + (n).toString() + '"}');
	}
	else if(q.query.chatupdate != null){ // Give him the latest chat that he hasen't got. 
		if(players[q.query.chatupdate] != null){
			if(rooms[players[q.query.chatupdate].room].chats.length != 0 && rooms[players[q.query.chatupdate].room].chats[players[q.query.chatupdate].chat] != null){
				players[q.query.chatupdate].chat += 1;
				res.end(rooms[players[q.query.chatupdate].room].chats[players[q.query.chatupdate].chat-1]);
			}
			else{
				res.end('');
			}
		}
	}
	else if(q.query.sendchat == "/restart"){
		chats.push('The Game has been restarted.');
		console.log("Game Reset");
		var roomreset = 0; // For now this only resets the lobby
		for(var i=0;i<6;i++){
			rooms[roomreset].dices[i] = 0;
		}
		for(var i=0;i<players.length;i++){
			if(players[i] != null){
				if(players[i].room == roomreset){
					players[i].score = 0;
				}
			}
		}
		rooms[roomreset].score = 0;
		rooms[roomreset].turn = 0;
		rooms[roomreset].showtakebutton = false;
		rooms[roomreset].showrollallbutton = false;
		rooms[roomreset].allowroll = true;
		res.end('Game Reset');
	}
	else if(q.query.sendchat != null){ // It is a send chat request
		var theroom = players[q.query.player].room;
		if(q.query.sendchat != ""){
			rooms[theroom].chats.push(players[q.query.player].name + ": " + q.query.sendchat);
			console.log(rooms[theroom].chats[rooms[theroom].chats.length-1]);
		}
		res.end('Chat send');
	}
	else if(q.query.setname != null){ // It is a set name request.
		rooms[players[q.query.player].room].chats.push(players[q.query.player].name + " is now known as " + q.query.setname);
		players[q.query.player].name = q.query.setname;
		res.end("name changed");
	}
	else if(q.query.roomrequest != null){
		res.end(JSON.stringify(rooms));
	}
	else if(q.query.changeroom != null){
		console.log("Change Room Request");
		if(players[q.query.player] != undefined){
			rooms[players[q.query.player].room].chats.push(players[q.query.player].name + " has left " + rooms[players[q.query.player].room].name);
			players[q.query.player].chat = rooms[q.query.changeroom].chats.length;
			players[q.query.player].room = parseInt(q.query.changeroom);
			players[q.query.player].score = rooms[q.query.changeroom].startscore;
			rooms[q.query.changeroom].chats.push(players[q.query.player].name + " has joined " + rooms[q.query.changeroom].name);
		}
	}
	else if(q.query.player != null){ // Then it is a attempt to play.
		console.log("Play Request  " + requests);
		if(q.query.player == rooms[players[q.query.player].room].turn){
			play(q.query.player, q.query.button);
		}
		res.end("hello??");
	}
	else if(q.query.ping != null){
        if(players[q.query.ping] == undefined){
            res.end('RESET');
            return;
        }
        clearTimeout(players[q.query.ping].ping);
        if(allDicesDisabled(players[q.query.ping].room)){
            for(var i=0;i<6;i++){
                rooms[players[q.query.ping].room].dices[i] = 0;
            }
        }
		players[q.query.ping].ping = null;
		players[q.query.ping].ping = setTimeout(function(){
			rooms[players[q.query.ping].room].chats.push(players[q.query.ping].name + " left the game.");
			delete players[q.query.ping];
			console.log("Kicked player " + q.query.ping);
			console.log(players);
			console.log("players.length: " + players.length);
		}, 10000);
		var allplayers = '{';
		for(var i = 0;i<players.length;i++){
			if(i == 0 || allplayers == '{'){
				if(players[i] != undefined && players[i].room == players[q.query.ping].room){ // If the player actually exists and he is in my room add him to the list.
					allplayers += '"p' + i + '":"' + players[i].name + ': ' + players[i].score + '"';
				}
			}
			else{
				if(players[i] != undefined && players[i].room == players[q.query.ping].room){ // If the player actually exists and he is in my room add him to the list.
					allplayers += ',"p' + i + '":"' + players[i].name + ': ' + players[i].score + '"';
				}
			}
		}
		allplayers += '}';
		res.end(allplayers);
	}
	else {
		res.end("404");
	}
	if(players.length > 0){
		for(var i=0;i<rooms.length;i++){
			/*if(i==0){
				fixturns(i);
			}*/
			fixturns(i);
			if(players[rooms[i].turn] != null){
				if(players[rooms[i].turn].score < 999){
					if(rooms[i].score > 999){
						rooms[i].showtakebutton = true;
					}
					else{
						rooms[i].showtakebutton = false;
					}
				}
			}
		}
	}
	for(var i=0;i<rooms.length;i++){  // Reset the amount of players in each room.
		rooms[i].players = 0;
	}
	for(var i=0;i<players.length;i++){  // Set the amount of players in each room.
		if(players[i] != undefined){
			rooms[players[i].room].players += 1;
		}
	}
	res.end("Something is broken :(");
}).listen(8080);


function play(player, button){ // Line 30 shows all the button codes
	if(button == -1){
        // Roll all dice.
		RollAll(players[player].room);
		rooms[players[player].room].showrollallbutton = false;
	}
	if(button == 0 && rooms[players[player].room].allowroll){
        // Roll the available dice.
		roll(players[player].room);
		rooms[players[player].room].showrollallbutton = false;
	}
	if(button == 1){
        // Take dice 1
        var r = button-1;;
		if(rooms[players[player].room].dices[r] == 1){
            rooms[players[player].room].score += 100;
			rooms[players[player].room].dices[r] = -1;
			if(players[rooms[players[player].room].turn].score > 999){
				rooms[players[player].room].showtakebutton = true;
			}
			rooms[players[player].room].allowroll = true;
			checkThreeOfAKind(rooms[players[player].room]);
        }
        if(rooms[players[player].room].dices[r] == 5){
            rooms[players[player].room].score += 50;
			rooms[players[player].room].dices[r] = -1;
			if(players[rooms[players[player].room].turn].score > 999){
				rooms[players[player].room].showtakebutton = true;
			}
			rooms[players[player].room].allowroll = true;
			checkThreeOfAKind(rooms[players[player].room]);
		}
    }
	if(button == 2){
		// Take dice 2
		var r = button-1;;
		if(rooms[players[player].room].dices[r] == 1){
            rooms[players[player].room].score += 100;
			rooms[players[player].room].dices[r] = -1;
			if(players[rooms[players[player].room].turn].score > 999){
				rooms[players[player].room].showtakebutton = true;
			}
			rooms[players[player].room].allowroll = true;
			checkThreeOfAKind(rooms[players[player].room]);
        }
        if(rooms[players[player].room].dices[r] == 5){
            rooms[players[player].room].score += 50;
			rooms[players[player].room].dices[r] = -1;
			if(players[rooms[players[player].room].turn].score > 999){
				rooms[players[player].room].showtakebutton = true;
			}
			rooms[players[player].room].allowroll = true;
			checkThreeOfAKind(rooms[players[player].room]);
		}
	}
	if(button == 3){
		// Take dice 3
		var r = button-1;;
		if(rooms[players[player].room].dices[r] == 1){
            rooms[players[player].room].score += 100;
			rooms[players[player].room].dices[r] = -1;
			if(players[rooms[players[player].room].turn].score > 999){
				rooms[players[player].room].showtakebutton = true;
			}
			rooms[players[player].room].allowroll = true;
			checkThreeOfAKind(rooms[players[player].room]);
        }
        if(rooms[players[player].room].dices[r] == 5){
            rooms[players[player].room].score += 50;
			rooms[players[player].room].dices[r] = -1;
			if(players[rooms[players[player].room].turn].score > 999){
				rooms[players[player].room].showtakebutton = true;
			}
			rooms[players[player].room].allowroll = true;
			checkThreeOfAKind(rooms[players[player].room]);
        }
	}
	if(button == 4){
		// Take dice 4
		var r = button-1;;
		if(rooms[players[player].room].dices[r] == 1){
            rooms[players[player].room].score += 100;
			rooms[players[player].room].dices[r] = -1;
			if(players[rooms[players[player].room].turn].score > 999){
				rooms[players[player].room].showtakebutton = true;
			}
			rooms[players[player].room].allowroll = true;
			checkThreeOfAKind(rooms[players[player].room]);
        }
        if(rooms[players[player].room].dices[r] == 5){
            rooms[players[player].room].score += 50;
			rooms[players[player].room].dices[r] = -1;
			if(players[rooms[players[player].room].turn].score > 999){
				rooms[players[player].room].showtakebutton = true;
			}
			rooms[players[player].room].allowroll = true;
			checkThreeOfAKind(rooms[players[player].room]);
        }
	}
	if(button == 5){
		// Take dice 5
		var r = button-1;;
		if(rooms[players[player].room].dices[r] == 1){
            rooms[players[player].room].score += 100;
			rooms[players[player].room].dices[r] = -1;
			if(players[rooms[players[player].room].turn].score > 999){
				rooms[players[player].room].showtakebutton = true;
			}
			rooms[players[player].room].allowroll = true;
			checkThreeOfAKind(rooms[players[player].room]);
        }
        if(rooms[players[player].room].dices[r] == 5){
            rooms[players[player].room].score += 50;
			rooms[players[player].room].dices[r] = -1;
			if(players[rooms[players[player].room].turn].score > 999){
				rooms[players[player].room].showtakebutton = true;
			}
			rooms[players[player].room].allowroll = true;
			checkThreeOfAKind(rooms[players[player].room]);
        }
	}
	if(button == 6){
		// Take dice 6
		var r = button-1;
		if(rooms[players[player].room].dices[r] == 1){
            rooms[players[player].room].score += 100;
			rooms[players[player].room].dices[r] = -1;
			if(players[rooms[players[player].room].turn].score > 999){
				rooms[players[player].room].showtakebutton = true;
			}
			rooms[players[player].room].allowroll = true;
			checkThreeOfAKind(rooms[players[player].room]);
        }
        if(rooms[players[player].room].dices[r] == 5){
            rooms[players[player].room].score += 50;
			rooms[players[player].room].dices[r] = -1;
			if(players[rooms[players[player].room].turn].score > 999){
				rooms[players[player].room].showtakebutton = true;
			}
			rooms[players[player].room].allowroll = true;
			checkThreeOfAKind(rooms[players[player].room]);
        }
	}
	if(button == 7){
		// Take big dice 1
		rooms[players[player].room].score += rooms[players[player].room].dices[6];
		rooms[players[player].room].dices[6] = 0;
		var numbertaken = 0;
		for(var i=0;i<6;i++){
			if(rooms[players[player].room].dices[i] == rooms[players[player].room].bigdicebasenumber1 && numbertaken != rooms[players[player].room].bigdicenumber1){
				rooms[players[player].room].dices[i] = -1;
				numbertaken += 1;
			}
		}
		rooms[players[player].room].bigdicenumber1 = 0;
		rooms[players[player].room].bigdicebasenumber1 = 0;
		if(players[rooms[players[player].room].turn].score > 999){
			rooms[players[player].room].showtakebutton = true;
		}
		rooms[players[player].room].allowroll = true;
		checkThreeOfAKind(rooms[players[player].room]);
	}
	if(button == 8){
		// Take big dice 2
		rooms[players[player].room].score += dices[7];
		rooms[players[player].room].dices[7] = 0;
		var numbertaken = 0;
		for(var i=0;i<6;i++){
			if(rooms[players[player].room].dices[i] == rooms[players[player].room].bigdicebasenumber2 && numbertaken != rooms[players[player].room].bigdicenumber2){
				rooms[players[player].room].dices[i] = -1;
				numbertaken += 1;
			}
		}
		rooms[players[player].room].bigdicenumber2 = 0;
		rooms[players[player].room].bigdicebasenumber2 = 0;
		if(players[turn].score > 999){
			rooms[players[player].room].showtakebutton = true;
		}
		rooms[players[player].room].allowroll = true;
		checkThreeOfAKind(rooms[players[player].room]);
	}
	if(button == 9){
		// Take it
		if(players[rooms[players[player].room].turn].score == 0){ // If the player's score is 0
			if(rooms[players[player].room].score > 999){ // If the room score is greater than 999
				players[player].score += rooms[players[player].room].score;
				rooms[players[player].room].turn += 1;
				rooms[players[player].room].allowroll = true;
				fixturns(players[player].room);
				if(players[rooms[players[player].room].turn] != undefined){
					if(players[rooms[players[player].room].turn].score < 999){
						rooms[players[player].room].score = 0;
						for(var i=0;i<6;i++){
							rooms[players[player].room].dices[i] = 0;
						}
					}
				}
				else{
					for(var i=0;i<players.length;i++){
						if(players[i] != undefined){
							if(players[i].score < 999){
								rooms[players[player].room].score = 0;
								for(var i=0;i<6;i++){
									rooms[players[player].room].dices[i] = 0; // Reset all the dices.
								}
							}
						}
					}
				}
			}
		}
		else{ // If the players score is greater than 0
			players[player].score += rooms[players[player].room].score;
			rooms[players[player].room].turn += 1;
			rooms[players[player].room].allowroll = true;
			fixturns(players[player].room);
			if(players[rooms[players[player].room].turn] != undefined){
				if(players[rooms[players[player].room].turn].score < 999){
					rooms[players[player].room].score = 0;
					for(var i=0;i<6;i++){
						rooms[players[player].room].dices[i] = 0;
					}
				}
			}
			else{
				for(var i=0;i<players.length;i++){
					if(players[i] != undefined){
						if(players[i].score < 999){
							rooms[players[player].room].score = 0;
							for(var i=0;i<6;i++){
								rooms[players[player].room].dices[i] = 0;
							}
						}
					}
				}
			}
			fixturns(players[player].room);
			//console.log(players[rooms[players[player].room].turn]);
			if(players[rooms[players[player].room].turn] != undefined){
				if(players[rooms[players[player].room].turn].score > 999){
					rooms[players[player].room].showrollallbutton = true;
				}
				else{
					rooms[players[player].room].showrollallbutton = false;
				}
			}
		}
		rooms[players[player].room].showtakebutton = false;
		//rooms[players[player].room].turn += 1;
	}
}

function fixturns(theroom){ // If the current player doens't exist then go to the next player that does exist and is in the right room. 
	//console.log("Players in" + theroom + " room " + playersinroom(theroom));
	if(players[rooms[theroom].turn] == undefined){
		rooms[theroom].turn += 1;
	}
	if(rooms[theroom].turn > largestplayerinroom(theroom)){
		var nextroom = null;
		for(var i=0;i<players.length;i++){
			if(players[i] != undefined){
				if(players[i].room == theroom){
					nextroom = i;
					break;
				}
			}
		}
		rooms[theroom].turn = nextroom;
	}
	//console.log(rooms[1].turn);
}

function largestplayerinroom(theroom){
	var pir = 0;
	for(var i=0;i<players.length;i++){
		if(players[i] != undefined){
			if(i > pir){
				pir = i;
			}
		}
	}
	return pir;
}


function playersinroom(theroom){
	var pir = 0;
	for(var i=0;i<players.length;i++){
		if(players[i] != undefined){
			if(players[i].room == theroom){
				pir += 1;
			}
		}
	}
	return pir;
}

function rolldice(){
    var num1 = Math.round(Math.random()*10);
    while(num1 > 6 || num1 == 0){
        num1 = Math.round(Math.random()*10);
    }
    return num1;
}

function roll(theroom){
    if(allDicesDisabled(theroom)){ // IF all dices are disabled then roll them all.
        for(var i=0;i<6;i++){
            rooms[theroom].dices[i] = 0;
        }
	}

    for(var i=0;i<6;i++){ // Roll the available dice. 
        if(rooms[theroom].dices[i] != -1){
            rooms[theroom].dices[i] = rolldice();
        }
	}


	// Check if the player broke.

	var b = true;

	for(var i=0;i<6;i++){
		if(rooms[theroom].dices[i] == 1 || rooms[theroom].dices[i] == 5){
			b = false;
		}
	}
	
	// Check if there is 3 of a kind of something

	checkThreeOfAKind(rooms[theroom]);

	// Checking if the player broke
	if(b == true){
		rooms[theroom].score = 0;
		for(var i=0;i<8;i++){ // Set all dices to 0. 
			rooms[theroom].dices[i] = 0;
		}
		rooms[theroom].turn += 1;
		rooms[theroom].showrollallbutton = false;
		rooms[theroom].allowroll = true;
	}
	else{
		rooms[theroom].allowroll = false;
	}
}

function RollAll(theroom){
    rooms[theroom].score = 0;
    for(var i=0;i<6;i++){
        rooms[theroom].dices[i] = 0;
    }
    roll(theroom);
}

function allDicesDisabled(theroom){
    var r = true;
    for(var i=0;i<6;i++){
        if(rooms[theroom].dices[i] != -1){
            return false;
        }
    }
    return true;
}

function checkThreeOfAKind(theroom){
		// Check if there is 3 of a kind of something
		//console.log("the room:" + theroom.dices[6]);
		theroom.dices[6] = 0;
		theroom.dices[7] = 0;
	
		var numberofdice = [];
		numberofdice.push(0);
		numberofdice.push(0);
		numberofdice.push(0);
		numberofdice.push(0);
		numberofdice.push(0);
		numberofdice.push(0);
	
		for(var i=0;i<6;i++){
			if(theroom.dices[i] == 1){
				numberofdice[0] += 1;
			}
			if(theroom.dices[i] == 2){
				numberofdice[1] += 1;
			}
			if(theroom.dices[i] == 3){
				numberofdice[2] += 1;
			}
			if(theroom.dices[i] == 4){
				numberofdice[3] += 1;
			}
			if(theroom.dices[i] == 5){
				numberofdice[4] += 1;
			}
			if(theroom.dices[i] == 6){
				numberofdice[5] += 1;
			}
		}
	
		for(var i=0;i<6;i++){
			var o = i+1;
			if(numberofdice[i] == 3){
				b = false;
				if(i != 0){
					if(theroom.dices[6] == 0 || theroom.dices[6] == o*100){
						theroom.dices[6] = o*100;
						theroom.bigdicenumber1 = 3;
						theroom.bigdicebasenumber1 = o;
					}
					else{
						theroom.dices[7] = o*100;
						theroom.bigdicenumber2 = 3;
						theroom.bigdicebasenumber2 = o;
					}
				}
				else{
					if(theroom.dices[6] == 0 || theroom.dices[6] == o*1000){
						theroom.dices[6] = o*1000;
						theroom.bigdicenumber1 = 3;
						theroom.bigdicebasenumber1 = o;
					}
					else{
						theroom.dices[7] = o*1000;
						theroom.bigdicenumber2 = 3;
						theroom.bigdicebasenumber2 = o;
					}
				}
			}
			if(numberofdice[i] == 4){
				b = false;
				if(i != 0){
					if(theroom.dices[6] == 0 || theroom.dices[6] == o*100*2){
						theroom.dices[6] = o*100*2;
						theroom.bigdicenumber1 = 4;
						theroom.bigdicebasenumber1 = o;
					}
					else{
						theroom.dices[7] = o*100*2;
						theroom.bigdicenumber2 = 4;
						theroom.bigdicebasenumber2 = o;
					}
				}
				else{
					if(theroom.dices[6] == 0 || theroom.dices[6] == o*1000*2){
						theroom.dices[6] = o*1000*2;
						theroom.bigdicenumber1 = 4;
						theroom.bigdicebasenumber1 = o;
					}
					else{
						theroom.dices[7] = o*1000*2;
						theroom.bigdicenumber2 = 4;
						theroom.bigdicebasenumber2 = o;
					}
				}
			}
			if(numberofdice[i] == 5){
				b = false;
				if(i != 0){
					if(theroom.dices[6] == o || theroom.dices[6] == o*100*2*2){
						theroom.dices[6] = o*100*2*2;
						theroom.bigdicenumber1 = 5;
						theroom.bigdicebasenumber1 = o;
					}
					else{
						theroom.dices[7] = o*100*2*2;
						theroom.bigdicenumber2 = 5;
						theroom.bigdicebasenumber2 = o;
					}
				}
				else{
					if(theroom.dices[6] == 0 || theroom.dices[6] == o*1000*2*2){
						theroom.dices[6] = o*1000*2*2;
						theroom.bigdicenumber1 = 5;
						theroom.bigdicebasenumber1 = o;
					}
					else{
						theroom.dices[7] = o*1000*2*2;
						theroom.bigdicenumber2 = 5;
						theroom.bigdicebasenumber2 = o;
					}
				}
			}
			if(numberofdice[i] == 6){
				b = false;
				if(i != 0){
					if(theroom.dices[6] == 0 || theroom.dices[6] == o*100*2*2*2){
						theroom.dices[6] = o*100*2*2*2;
						theroom.bigdicenumber1 = 6;
						theroom.bigdicebasenumber1 = o;
					}
					else{
						theroom.dices[7] = o*100*2*2*2;
						theroom.bigdicenumber2 = 6;
						theroom.bigdicebasenumber2 = o;
					}
				}
				else{
					if(theroom.dices[6] == 0 || theroom.dices[6] == o*1000*2*2){
						theroom.dices[6] = o*1000*2*2*2;
						theroom.bigdicenumber1 = 6;
						theroom.bigdicebasenumber1 = o;
					}
					else{
						theroom.dices[7] = o*1000*2*2*2;
						theroom.bigdicenumber2 = 6;
						theroom.bigdicebasenumber2 = o;
					}
				}
			}
		}
	
	
		if(numberofdice[0] == 1 && numberofdice[1] == 1 && numberofdice[2] == 1 && numberofdice[3] == 1 && numberofdice[4] == 1 && numberofdice[5] == 1){
			theroom.dices[6] = 500;
			b= false;
		}
		else{
			if(theroom.dices[6] == 500 && numberofdice[4] != 3){
				theroom.dices[6] = 0;
			}
		}
}