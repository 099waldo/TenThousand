var http = require('http');
var url = require('url');
var requests = 0;

var turn = 0;  
var score = 0;

var dices = [];
dices.push(0); // Dice 1
dices.push(0); // Dice 2
dices.push(0); // Dice 3
dices.push(0); // Dice 4
dices.push(0); // Dice 5
dices.push(0); // Dice 6
dices.push(0); // Big Dice 1
dices.push(0); // Big Dice 2

var bigdicenumber1 = 0;
var bigdicebasenumber1 = 0;

var bigdicenumber2 = 0;
var bigdicebasenumber2 = 0;

var showtakebutton = false;
var showrollallbutton = false;
var allowroll = true;

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


var chats = [];

var startscore = 0;
//var startscore = 1000; // For debuging
console.log("Server Started.");

http.createServer(function (req, res) {
	//res.setHeader('Access-Control-Allow-Origin', 'http://waldoweb.net'); // Don't delete this line.
	res.setHeader('Access-Control-Allow-Origin', null); // For local testing.
	res.writeHead(200, {'Content-Type': 'text/html'});
	requests += 1;
	
	var q = url.parse(req.url, true);

	if(q.path == "/update"){ // Then it is a game update request.
		//console.log("Update Request  " + requests);
		var gamevalues = '{"d1":"' + dices[0] + '", "d2":"' + dices[1] + '", "d3":"'+dices[2]
         + '", "d4":"'+dices[3] + '", "d5":"' + dices[4] + '", "d6":"' + dices[5] + '", "turn":"'
		  + turn + '", "bd1":"' + dices[6] + '", "bd2":"' + dices[7] + '", "score":"' + score + '", "takebutton":"'
		   + showtakebutton + '", "rollallbutton":"' + showrollallbutton + '"}';
		// Servers must return text in JSON format. eg. '{ "name":"John", "age":31, "city":"New York" }'
		res.end(gamevalues);
	}
	else if(q.path == '/setup'){ // Setup the player to start playing.
		console.log("Setup Request  " + requests);
		var p = 0;
		var n = 0;
		if(players.length == 0){
			players.push({name:"Player " + (players.length), num:players.length, ping:null, score:startscore, chat:chats.length});
		}
		else {
			for(var i=0;i<players.length+1;i++){
				if(players[i] == undefined){
					players[i] = {name:"Player " + i.toString(), num:i, ping:null, score:startscore, chat:chats.length}
					p = "Player " + i.toString();
					n = i;
					i = players.length+1;
				}
			}
		}
		players[n].ping = setTimeout(function(){
			delete players[n];
			console.log("Kicked player " + p);
			chats.push("Player " + p + " left the game.");
			console.log(players);
			console.log("players.length: " + players.length);
		}, 10000);
		console.log("Player " + players[n].name  + " has joined");
		setTimeout(function(){ 
			chats.push(players[n].name + " has joined the game.");
		}, 1000);
		res.end('{"player":"' + (n).toString() + '"}');
	}
	else if(q.query.chatupdate != null){ // Give him the latest chat that he hasen't got. 
		if(players[q.query.chatupdate] != null){
			if(chats.length != 0 && chats[players[q.query.chatupdate].chat] != null){
				players[q.query.chatupdate].chat += 1;
				res.end(chats[players[q.query.chatupdate].chat-1]);
			}
			else{
				res.end('');
			}
		}
	}
	else if(q.query.sendchat == "/restart"){
		chats.push('The Game has been restarted.');
		console.log("Game Reset");
		for(var i=0;i<6;i++){
			dices[i] = 0;
		}
		for(var i=0;i<players.length;i++){
			if(players[i] != null){
				players[i].score = 0;
			}
		}
		score = 0;
		turn = 0;
		showtakebutton = false;
		showrollallbutton = false;
		allowroll = true;
		res.end('Game Reset');
	}
	else if(q.query.sendchat != null){ // It is a send chat request
		if(q.query.sendchat != ""){
			chats.push(players[q.query.player].name + ": " + q.query.sendchat);
			console.log(chats[chats.length-1]);
		}
		res.end('Chat send');
	}
	else if(q.query.setname != null){ // It is a set name request.
		chats.push(players[q.query.player].name + " is now known as " + q.query.setname);
		players[q.query.player].name = q.query.setname;
		res.end("name changed");
	}
	else if(q.query.player != null){ // Then it is a attempt to play.
		console.log("Play Request  " + requests);
		if(q.query.player == turn){
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
        if(allDicesDisabled()){
            for(var i=0;i<6;i++){
                dices[i] = 0;
            }
        }
		players[q.query.ping].ping = null;
		players[q.query.ping].ping = setTimeout(function(){
			chats.push(players[q.query.ping].name + " left the game.");
			delete players[q.query.ping];
			console.log("Kicked player " + q.query.ping);
			console.log(players);
			console.log("players.length: " + players.length);
		}, 10000);
		var allplayers = '{';
		for(var i = 0;i<players.length;i++){
			if(i == 0 || allplayers == '{'){
				if(players[i] != undefined){ // If the player actually exists add him to the list.
					allplayers += '"p' + i + '":"' + players[i].name + ': ' + players[i].score + '"';
				}
			}
			else{
				if(players[i] != undefined){ // If the player actually exists add him to the list.
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
		fixturns();
		if(players[turn] != null){
			if(players[turn].score < 999){
				if(score > 999){
					showtakebutton = true;
				}
				else{
					showtakebutton = false;
				}
			}
		}
	}
}).listen(8080);


function play(player, button){ // Line 30 shows all the button codes
	if(button == -1){
        // Roll all dice.
		RollAll();
		showrollallbutton = false;
	}
	if(button == 0 && allowroll){
        // Roll the available dice.
		roll();
		showrollallbutton = false;
	}
	if(button == 1){
        // Take dice 1
        var r = button-1;;
		if(dices[r] == 1){
            score += 100;
			dices[r] = -1;
			if(players[turn].score > 999){
				showtakebutton = true;
			}
			allowroll = true;
			checkThreeOfAKind();
        }
        if(dices[r] == 5){
            score += 50;
			dices[r] = -1;
			if(players[turn].score > 999){
				showtakebutton = true;
			}
			allowroll = true;
			checkThreeOfAKind();
		}
    }
	if(button == 2){
		// Take dice 2
		var r = button-1;;
		if(dices[r] == 1){
            score += 100;
			dices[r] = -1;
			if(players[turn].score > 999){
				showtakebutton = true;
			}
			allowroll = true;
			checkThreeOfAKind();
        }
        if(dices[r] == 5){
            score += 50;
			dices[r] = -1;
			if(players[turn].score > 999){
				showtakebutton = true;
			}
			allowroll = true;
			checkThreeOfAKind();
		}
	}
	if(button == 3){
		// Take dice 3
		var r = button-1;;
		if(dices[r] == 1){
            score += 100;
			dices[r] = -1;
			if(players[turn].score > 999){
				showtakebutton = true;
			}
			allowroll = true;
			checkThreeOfAKind();
        }
        if(dices[r] == 5){
            score += 50;
			dices[r] = -1;
			if(players[turn].score > 999){
				showtakebutton = true;
			}
			allowroll = true;
			checkThreeOfAKind();
        }
	}
	if(button == 4){
		// Take dice 4
		var r = button-1;;
		if(dices[r] == 1){
            score += 100;
			dices[r] = -1;
			if(players[turn].score > 999){
				showtakebutton = true;
			}
			allowroll = true;
			checkThreeOfAKind();
        }
        if(dices[r] == 5){
            score += 50;
			dices[r] = -1;
			if(players[turn].score > 999){
				showtakebutton = true;
			}
			allowroll = true;
			checkThreeOfAKind();
        }
	}
	if(button == 5){
		// Take dice 5
		var r = button-1;;
		if(dices[r] == 1){
            score += 100;
			dices[r] = -1;
			if(players[turn].score > 999){
				showtakebutton = true;
			}
			allowroll = true;
			checkThreeOfAKind();
        }
        if(dices[r] == 5){
            score += 50;
			dices[r] = -1;
			if(players[turn].score > 999){
				showtakebutton = true;
			}
			allowroll = true;
			checkThreeOfAKind();
        }
	}
	if(button == 6){
		// Take dice 6
		var r = button-1;
		if(dices[r] == 1){
            score += 100;
			dices[r] = -1;
			if(players[turn].score > 999){
				showtakebutton = true;
			}
			allowroll = true;
			checkThreeOfAKind();
        }
        if(dices[r] == 5){
            score += 50;
			dices[r] = -1;
			if(players[turn].score > 999){
				showtakebutton = true;
			}
			allowroll = true;
			checkThreeOfAKind();
        }
	}
	if(button == 7){
		// Take big dice 1
		score += dices[6];
		dices[6] = 0;
		var numbertaken = 0;
		for(var i=0;i<6;i++){
			if(dices[i] == bigdicebasenumber1 && numbertaken != bigdicenumber1){
				dices[i] = -1;
				numbertaken += 1;
			}
		}
		bigdicenumber1 = 0;
		bigdicebasenumber1 = 0;
		if(players[turn].score > 999){
			showtakebutton = true;
		}
		allowroll = true;
		checkThreeOfAKind();
	}
	if(button == 8){
		// Take big dice 2
		score += dices[7];
		dices[7] = 0;
		var numbertaken = 0;
		for(var i=0;i<6;i++){
			if(dices[i] == bigdicebasenumber2 && numbertaken != bigdicenumber2){
				dices[i] = -1;
				numbertaken += 1;
			}
		}
		bigdicenumber2 = 0;
		bigdicebasenumber2 = 0;
		if(players[turn].score > 999){
			showtakebutton = true;
		}
		allowroll = true;
		checkThreeOfAKind();
	}
	if(button == 9){
		// Take it
		if(players[turn].score == 0){
			if(score > 999){
				players[turn].score += score;
				turn += 1;
				allowroll = true;
				if(players[turn] != undefined){
					if(players[turn].score < 999){
						score = 0;
						for(var i=0;i<6;i++){
							dices[i] = 0;
						}
					}
				}
				else{
					for(var i=0;i<players.length;i++){
						if(players[i] != undefined){
							if(players[i].score < 999){
								score = 0;
								for(var i=0;i<6;i++){
									dices[i] = 0;
								}
							}
						}
					}
				}
			}
		}
		else{
			players[turn].score += score;
			turn += 1;
			allowroll = true;
			if(players[turn] != undefined){
				if(players[turn].score < 999){
					score = 0;
					for(var i=0;i<6;i++){
						dices[i] = 0;
					}
				}
			}
			else{
				for(var i=0;i<players.length;i++){
					if(players[i] != undefined){
						if(players[i].score < 999){
							score = 0;
							for(var i=0;i<6;i++){
								dices[i] = 0;
							}
						}
					}
				}
			}
			fixturns();
			console.log(players[turn]);
			if(players[turn] != undefined){
				if(players[turn].score > 999){
					showrollallbutton = true;
				}
				else{
					showrollallbutton = false;
				}
			}
		}
		showtakebutton = false;
	}
}

function fixturns(){ // If the current player doens't exist then go to the next player that does exist. 
	while(players[turn] == undefined){
		if(players[turn] == undefined){
			turn += 1;
		}
		if(turn+1 > players.length){
			turn = 0;
		}
	}
}

function rolldice(){
    var num1 = Math.round(Math.random()*10);
    while(num1 > 6 || num1 == 0){
        num1 = Math.round(Math.random()*10);
    }
    return num1;
}

function roll(){
    if(allDicesDisabled()){ // IF all dices are disabled then roll them all.
        for(var i=0;i<6;i++){
            dices[i] = 0;
        }
	}

    for(var i=0;i<6;i++){ // Roll the available dice. 
        if(dices[i] != -1){
            dices[i] = rolldice();
        }
	}


	// Check if the player broke.

	var b = true;

	for(var i=0;i<6;i++){
		if(dices[i] == 1 || dices[i] == 5){
			b = false;
		}
	}
	
	// Check if there is 3 of a kind of something

	checkThreeOfAKind();

	// Checking if the player broke
	if(b == true){
		score = 0;
		for(var i=0;i<8;i++){ // Set all dices to 0. 
			dices[i] = 0;
		}
		turn += 1;
		showrollallbutton = false;
		allowroll = true;
	}
	else{
		allowroll = false;
	}
}

function RollAll(){
    score = 0;
    for(var i=0;i<6;i++){
        dices[i] = 0;
    }
    roll();
}

function allDicesDisabled(){
    var r = true;
    for(var i=0;i<6;i++){
        if(dices[i] != -1){
            return false;
        }
    }
    return true;
}

function checkThreeOfAKind(){
		// Check if there is 3 of a kind of something

		dices[6] = 0;
		dices[7] = 0;
	
		var numberofdice = [];
		numberofdice.push(0);
		numberofdice.push(0);
		numberofdice.push(0);
		numberofdice.push(0);
		numberofdice.push(0);
		numberofdice.push(0);
	
		for(var i=0;i<6;i++){
			if(dices[i] == 1){
				numberofdice[0] += 1;
			}
			if(dices[i] == 2){
				numberofdice[1] += 1;
			}
			if(dices[i] == 3){
				numberofdice[2] += 1;
			}
			if(dices[i] == 4){
				numberofdice[3] += 1;
			}
			if(dices[i] == 5){
				numberofdice[4] += 1;
			}
			if(dices[i] == 6){
				numberofdice[5] += 1;
			}
		}
	
		for(var i=0;i<6;i++){
			var o = i+1;
			if(numberofdice[i] == 3){
				b = false;
				if(i != 0){
					if(dices[6] == 0 || dices[6] == o*100){
						dices[6] = o*100;
						bigdicenumber1 = 3;
						bigdicebasenumber1 = o;
					}
					else{
						dices[7] = o*100;
						bigdicenumber2 = 3;
						bigdicebasenumber2 = o;
					}
				}
				else{
					if(dices[6] == 0 || dices[6] == o*1000){
						dices[6] = o*1000;
						bigdicenumber1 = 3;
						bigdicebasenumber1 = o;
					}
					else{
						dices[7] = o*1000;
						bigdicenumber2 = 3;
						bigdicebasenumber2 = o;
					}
				}
			}
			if(numberofdice[i] == 4){
				b = false;
				if(i != 0){
					if(dices[6] == 0 || dices[6] == o*100*2){
						dices[6] = o*100*2;
						bigdicenumber1 = 4;
						bigdicebasenumber1 = o;
					}
					else{
						dices[7] = o*100*2;
						bigdicenumber2 = 4;
						bigdicebasenumber2 = o;
					}
				}
				else{
					if(dices[6] == 0 || dices[6] == o*1000*2){
						dices[6] = o*1000*2;
						bigdicenumber1 = 4;
						bigdicebasenumber1 = o;
					}
					else{
						dices[7] = o*1000*2;
						bigdicenumber2 = 4;
						bigdicebasenumber2 = o;
					}
				}
			}
			if(numberofdice[i] == 5){
				b = false;
				if(i != 0){
					if(dices[6] == o || dices[6] == o*100*2*2){
						dices[6] = o*100*2*2;
						bigdicenumber1 = 5;
						bigdicebasenumber1 = o;
					}
					else{
						dices[7] = o*100*2*2;
						bigdicenumber2 = 5;
						bigdicebasenumber2 = o;
					}
				}
				else{
					if(dices[6] == 0 || dices[6] == o*1000*2*2){
						dices[6] = o*1000*2*2;
						bigdicenumber1 = 5;
						bigdicebasenumber1 = o;
					}
					else{
						dices[7] = o*1000*2*2;
						bigdicenumber2 = 5;
						bigdicebasenumber2 = o;
					}
				}
			}
			if(numberofdice[i] == 6){
				b = false;
				if(i != 0){
					if(dices[6] == 0 || dices[6] == o*100*2*2*2){
						dices[6] = o*100*2*2*2;
						bigdicenumber1 = 6;
						bigdicebasenumber1 = o;
					}
					else{
						dices[7] = o*100*2*2*2;
						bigdicenumber2 = 6;
						bigdicebasenumber2 = o;
					}
				}
				else{
					if(dices[6] == 0 || dices[6] == o*1000*2*2){
						dices[6] = o*1000*2*2*2;
						bigdicenumber1 = 6;
						bigdicebasenumber1 = o;
					}
					else{
						dices[7] = o*1000*2*2*2;
						bigdicenumber2 = 6;
						bigdicebasenumber2 = o;
					}
				}
			}
		}
	
	
		if(numberofdice[0] == 1 && numberofdice[1] == 1 && numberofdice[2] == 1 && numberofdice[3] == 1 && numberofdice[4] == 1 && numberofdice[5] == 1){
			dices[6] = 500;
			b= false;
		}
		else{
			if(dices[6] == 500 && numberofdice[4] != 3){
				dices[6] = 0;
			}
		}
}