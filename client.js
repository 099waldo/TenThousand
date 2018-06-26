var testing = true;

// Room Info
var rooms = [];
var roomdiv = document.getElementById("gameroomdiv");

// Get all our HTML Elements

var rollbutton = document.getElementById("rollbutton");
var rollallbutton = document.getElementById("rollallbutton");

var dices = [];
dices.push(document.getElementById("dice1"));
dices.push(document.getElementById("dice2"));
dices.push(document.getElementById("dice3"));
dices.push(document.getElementById("dice4"));
dices.push(document.getElementById("dice5"));
dices.push(document.getElementById("dice6"));

var bigdice1 = document.getElementById("bigdice1");
var bigdice2 = document.getElementById("bigdice2");

var infopar = document.getElementById("infopar");
var scorepar = document.getElementById("scorepar");
var namepar = document.getElementById("playername");

var takeitbutton = document.getElementById("takeitbutton");
var rollallbutton = document.getElementById("rollallbutton");

var playernum = null;
var playername = "";
var turn = 0;
var score = 0;
var roomnum = null;

var name = document.getElementById("name");

var chat = document.getElementById("chat");
var chatbox = document.getElementById("chatbox");
var chatsubmit = document.getElementById("chatsubmit");

var chatscroll = 0;

var localbutton = document.getElementById("localbutton");

var turnnotification = document.getElementById("turnnotification");
var turnNotInterval = null;
var turnNotIntervalGoing = false;
var turnNotIntervalEnabled = true;
var title = document.getElementById("title");
var snd2 = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
// I think that url is just a tone and isn't getting anything from the web. 

var roomname = document.getElementById("roomname");
var pings = 0;
var restartbutton = document.getElementById("restartbutton");

var roomtojoin = document.getElementById("roomtojoin");
var roompassword = document.getElementById("roompassword");

var newroomname = document.getElementById("newroomname");
var newroompassword = document.getElementById("newroompassword");
var privategamecheckbox = document.getElementById("privategamecheckbox");

var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
var modalmessage = document.getElementById("modalmessage");

/*var add = setInterval(function() {
    // allow 1px inaccuracy by adding 1
    var isScrolledToBottom = chat.scrollHeight - chat.clientHeight <= chat.scrollTop + 1;
    //console.log(chat.scrollHeight - chat.clientHeight,  chat.scrollTop + 1);
    var newElement = document.createElement("div");
    newElement.innerHTML = chatscroll++;
    chat.appendChild(newElement);
    // scroll to bottom if isScrolledToBotto
    if(isScrolledToBottom)
      chat.scrollTop = chat.scrollHeight - chat.clientHeight;
}, 1000);
*/

chatbox.onkeypress = function (e) {
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13') {
        // Enter pressed
        sendChat();
    }
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function startgame() {
    document.getElementById("gamediv").hidden = false;
    document.getElementById("startgamebutton").hidden = true;
    setup();
    setInterval(function () {
        update();
        if (playernum != null) {
            updateChat();
        }
        if (!testing) {
            if (localbutton.checked && url != "http://192.168.0.100:8080") {
                url = "http://192.168.0.100:8080";
                console.log("local server");
            }
            else {
                if (!localbutton.checked && url == "http://192.168.0.100:8080") {
                    url = "http://games.waldoweb.net:8080";
                }
            }
        }
        else {
            url = "http://127.0.0.1:8080";
        }
    }, 1000);
    setInterval(function () {
        updateRooms();
    }, 5000);
}
var url = "http://games.waldoweb.net:8080";
//var url = "http://192.168.0.100:8080";
//var url = "http://127.0.0.1:8080";  // For local testing only.
//var url  = "http://localhost:8080";

function updateRooms() {
    var xhr = httpRequest('GET', url + "/?roomrequest=" + roomnum);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            rooms = JSON.parse(xhr.responseText);
            var texttosend = "";
            for (var i = 0; i < rooms.length; i++) {
                if (rooms[i] != undefined) {
                    if (rooms[i].privateroom == false) { // Check if the room is a public room and display it in the menu.
                        texttosend += '<button value="' + rooms[i].num + '" onclick="gotoroom(' + rooms[i].num + ')">' + rooms[i].name + ' (' + rooms[i].players + ')</button>';
                    }
                    rooms[i].password = 'null';
                }
            }
            roomdiv.innerHTML = texttosend;
            if (rooms != undefined && roomnum != null) {
                restartbutton.hidden = !rooms[roomnum].showrestart; // Show/Hide the restart game button. 
                //console.log(xhr.responseText);
            }
        }
    }
}

function gotoroom(theroom, thepassword) {
    if (thepassword == undefined) {
        thepassword = 'null';
    }
    var xhr = httpRequest('GET', url + "/?player=" + playernum + '&changeroom=' + theroom + '&password=' + thepassword);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (xhr.responseText == "Wrong Password") {
                showmodal("Wrong Password");
            }
        }
    }
}

function joinPrivateRoom() {
    // Decide what room to join.
    var theroom = 0;
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i].name == roomtojoin.value) {
            theroom = i;
            break;
        }
    }
    if (theroom == 0) {
        showmodal("Room doesn't exist");
    }
    gotoroom(theroom, roompassword.value);
    roomtojoin.value = '';
    roompassword.value = '';
    document.getElementById("joinprivateroom").hidden = true;
    document.getElementById("createroom").hidden = true;
}

function createNewRoom() {
    var roomexists = false;
    var privategame = privategamecheckbox.checked;
    if (newroomname.value != '') {
        var newgamename = newroomname.value;
    }
    else {
        var newgamename = "Room #" + rooms.length.toString();
    }
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i] != undefined) {
            if (rooms[i].name == newgamename) {
                showmodal("Room already exists please try again.");
                newroomname.value = '';
                newroompassword.value = '';
                return;
            }
        }
    }
    var newRoom = { name: newgamename, turn: 0, num: numberofrooms(), score: 0, dices: [0, 0, 0, 0, 0, 0, 0, 0], bigdicenumber1: 0, bigdicebasenumber1: 0, bigdicenumber2: 0, bigdicebasenumber2: 0, showtakebutton: false, showrollallbutton: false, allowroll: true, chats: [], startscore: 0, players: 0, showrestart: false, privateroom: privategame, password: newroompassword.value };

    var xhr = httpRequest('GET', url + "/?createroom=" + JSON.stringify(newRoom));
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhr.responseText);
            setTimeout(function () {
                gotoroom(newRoom.num, newRoom.password);
            }, 1000);
        }
    }
    newroomname.value = '';
    newroompassword.value = '';
    document.getElementById("joinprivateroom").hidden = true;
    document.getElementById("createroom").hidden = true;
}

function showjoinmenu(hideit) {
    document.getElementById("joinprivateroom").hidden = hideit;
    document.getElementById("createroom").hidden = !hideit;
}

function showcreateroommenu(hideit) {
    document.getElementById("createroom").hidden = hideit;
    document.getElementById("joinprivateroom").hidden = !hideit;
}

function hidemenus() {
    document.getElementById("joinprivateroom").hidden = true;
    document.getElementById("createroom").hidden = true;
}

function showmodal(themessage) {
    modalmessage.innerHTML = themessage;
    modal.style.display = "block";
}

function closemodal() {
    modal.style.display = "none";
}

function numberofrooms() {
    var numofrooms = 0;
    for (var i = 0; i < rooms.length; i++) {
        if (rooms[i] != undefined) {
            numofrooms += 1;
        }
    }
    return numofrooms;
}

function setup() {
    var xhr = httpRequest('GET', url + "/setup");
    console.log("setting up");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(xhr.responseText);
            var results = JSON.parse(xhr.responseText);
            playernum = results.player;
            // console.log("Player " + playernum);
            playername = "Player " + playernum;
            document.getElementById("name").value = playername;
        }
    }
    roomnum = 0;
    updateRooms();
}

function pingserver() {
    pings += 1;
    //console.log(pings);
    var xhr = httpRequest('GET', url + '/?ping=' + playernum);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (xhr.responseText == 'RESET') {// && playernum != null){
                playernum = null;
                setup();
                return;
            }
            if (xhr.responseText == '') {
                playernum = null;
                setup();
                return;
            }
            //console.log(pings + " " + xhr.responseText);
            var results = JSON.parse(xhr.responseText);
            scorepar.innerHTML = '<br>';
            writeScore(results.p0, 0);  // Figure out a way to change this to a for loop later. 
            writeScore(results.p1, 1);
            writeScore(results.p2, 2);
            writeScore(results.p3, 3);
            writeScore(results.p4, 4);
            writeScore(results.p5, 5);
            writeScore(results.p6, 6);
            disableDices();
        }
    }
}

function changeName() {
    var xhr = httpRequest('GET', url + '/?setname=' + document.getElementById("name").value + '&player=' + playernum);
}

function updateChat() {
    var xhr = httpRequest('GET', url + '/?chatupdate=' + playernum);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            addToChat(xhr.responseText);
        }
    }
}

function sendChat() {
    var xhr = httpRequest('GET', url + '/?sendchat=' + chatbox.value + '&player=' + playernum);
    chatbox.value = '';
}

function addToChat(message) {
    // allow 1px inaccuracy by adding 1
    var isScrolledToBottom = chat.scrollHeight - chat.clientHeight <= chat.scrollTop + 1;
    //console.log(chat.scrollHeight - chat.clientHeight,  chat.scrollTop + 1);
    var newElement = document.createElement("div");
    newElement.innerHTML = message;
    chat.appendChild(newElement);
    // scroll to bottom if isScrolledToBotto
    if (isScrolledToBottom)
        chat.scrollTop = chat.scrollHeight - chat.clientHeight;
}

function writeScore(result, num) {
    if (result != undefined) {
        if (turn == num) {
            scorepar.innerHTML += '* ';
        }
        scorepar.innerHTML += result + '<br>';
    }
}

function restart() {
    var xhr = httpRequest('GET', url + "/?restart=" + roomnum);
    update();
}

//var xhr = httpRequest('GET', url);
//setTimeout(function(){                    // OUTDATED use code sample below.
//document.write(xhr.responseText);
//}, 1000);

// var xhr = httpRequest('GET', url);
// xhr.onreadystatechange = function(){
// if(this.readyState == 4 && this.status == 200){
//DO Stuff
// }
// }

function update() {
    //Update everything in the game.
    if (playernum != null) {
        pingserver();
        if (playernum == turn && playernum != null && !turnNotIntervalGoing && turnNotIntervalEnabled) {
            turnNotInterval = setInterval(function () {
                if (turnnotification.innerHTML != "YOUR TURN!!") {
                    turnnotification.innerHTML = "YOUR TURN!!";
                    title.innerHTML = "YOUR TURN!!";
                    //snd2.play();
                }
                else {
                    turnnotification.innerHTML = "     ";
                    title.innerHTML = "Ten Thousand";
                }
            }, 500);
            turnNotIntervalGoing = true;
        }
        else {
            clearInterval(turnNotInterval);
            turnnotification.innerHTML = "";
            title.innerHTML = "Ten Thousand";
            turnNotIntervalGoing = false;
        }
    }
    if (playernum != null && turn != null && playernum != turn) {
        turnNotIntervalEnabled = true;
    }
    if (playernum == null) {
        setup();
    }
    else {
        xhr = httpRequest('GET', url + "/?update=" + playernum);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                infopar.innerHTML = xhr.responseText;
                var results = JSON.parse(xhr.responseText);
                dices[0].innerHTML = results.d1;
                dices[1].innerHTML = results.d2;
                dices[2].innerHTML = results.d3;
                dices[3].innerHTML = results.d4;
                dices[4].innerHTML = results.d5;
                dices[5].innerHTML = results.d6;
                bigdice1.innerHTML = results.bd1;
                bigdice2.innerHTML = results.bd2;
                turn = results.turn;
                score = results.score;
                infopar.innerHTML = 'Score: ' + score;
                if (results.takebutton == "true") {
                    takeitbutton.disabled = false;
                }
                else {
                    takeitbutton.disabled = true;
                }

                if (results.rollallbutton == "true") {
                    rollallbutton.disabled = false;
                }
                else {
                    rollallbutton.disabled = true;
                }
                roomnum = results.room;
                roomname.innerHTML = rooms[roomnum].name;
                //roomname.innerHTML = rooms[results.room].name;
            }
        }
    }
    disableDices();
}

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
function RollAll() {
    var xhr = httpRequest('GET', url + '/?player=' + playernum + '&button=-1');
    turnNotIntervalEnabled = false;
    update();
}
function roll() {
    var xhr = httpRequest('GET', url + '/?player=' + playernum + '&button=0');
    turnNotIntervalEnabled = false;
    update();
}
function dice1() {
    var xhr = httpRequest('GET', url + '/?player=' + playernum + '&button=1');
    turnNotIntervalEnabled = false;
    update();
}
function dice2() {
    var xhr = httpRequest('GET', url + '/?player=' + playernum + '&button=2');
    turnNotIntervalEnabled = false;
    update();
}
function dice3() {
    var xhr = httpRequest('GET', url + '/?player=' + playernum + '&button=3');
    turnNotIntervalEnabled = false;
    update();
}
function dice4() {
    var xhr = httpRequest('GET', url + '/?player=' + playernum + '&button=4');
    turnNotIntervalEnabled = false;
    update();
}
function dice5() {
    var xhr = httpRequest('GET', url + '/?player=' + playernum + '&button=5');
    turnNotIntervalEnabled = false;
    update();
}
function dice6() {
    var xhr = httpRequest('GET', url + '/?player=' + playernum + '&button=6');
    turnNotIntervalEnabled = false;
    update();
}
function bigDice1() {
    var xhr = httpRequest('GET', url + '/?player=' + playernum + '&button=7');
    turnNotIntervalEnabled = false;
    update();
}
function bigDice2() {
    var xhr = httpRequest('GET', url + '/?player=' + playernum + '&button=8');
    turnNotIntervalEnabled = false;
    update();
}
function takeit() {
    var xhr = httpRequest('GET', url + '/?player=' + playernum + '&button=9');
    turnNotIntervalEnabled = false;
    update();
}

function disableDices() { // Deciding weather or not to hide or disable the dice. 
    for (var i = 0; i < 6; i++) {
        if (dices[i].innerHTML == "1" || dices[i].innerHTML == "5") {
            dices[i].disabled = false;
            dices[i].hidden = false;
        }
        else {
            dices[i].disabled = true;
            dices[i].hidden = true;
        }

        if (dices[i].innerHTML == "-1") {
            dices[i].hidden = true;
        }
        else {
            dices[i].hidden = false;
        }
    }
    if (bigdice1.innerHTML == "0") {
        bigdice1.disabled = true;
        bigdice1.hidden = true;
    }
    else {
        bigdice1.disabled = false;
        bigdice1.hidden = false;
    }
    if (bigdice2.innerHTML == "0") {
        bigdice2.disabled = true;
        bigdice2.hidden = true;
    }
    else {
        bigdice2.disabled = false;
        bigdice2.disabled = false;
    }
}

function httpGet(theUrl) // This would probably work but use httpRequest instead.
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            return xhttp.responseText;
        }
    };
    xhttp.open("GET", theUrl, true);
    xhttp.send();
}


function httpRequest(method, myurl) {
    var xhr = new XMLHttpRequest();
    //xhr.withCredentials = true;
    if ("withCredentials" in xhr) {
        // Check if the XMLHttpRequest object has a "withCredentials" property.
        // "withCredentials" only exists on XMLHTTPRequest2 objects.
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                return xhr;
            }
        };
        xhr.open(method, myurl, true);
        xhr.send();
        //console.log("Chrome");

    } else if (typeof XDomainRequest != "undefined") {

        // Otherwise, check if XDomainRequest.
        // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
        xhr = new XDomainRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                return xhr;
            }
        };
        xhr.open(method, myurl);
        xhr.send();
    }
    else {

        // Otherwise, CORS is not supported by the browser.
        xhr = null;

    }
    return xhr;
}