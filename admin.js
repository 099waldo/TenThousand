// Finished for now but could't get the server to send the list of players becuase of the "TypeError: Converting circular structure to JSON"
var rooms = []; 
var players = [];

var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];
var modalmessage = document.getElementById("modalmessage");

window.onload = function(){
    var roomdiv = document.getElementById("roomdiv");
};

var testing = true;

setInterval(function(){ // Main update loop.
    updateRooms();
    // updatePlayers();
    updateURL();
},1000);

var url = "http://games.waldoweb.net:8080";
//var url = "http://192.168.0.100:8080";
//var url = "http://127.0.0.1:8080";  // For local testing only.
//var url  = "http://localhost:8080";


function updateRooms(roomnum) {
    var xhr = httpRequest('GET', url + "/?roomrequest=" + roomnum);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            rooms = JSON.parse(xhr.responseText);
            var texttosend = "";
            texttosend += '<tr><th>Room Name</th><th>Players</th><th>Public/Private Room</th><th>Reset Room</th><th>Delete Room</th></tr>';
            for (var i = 0; i < rooms.length; i++) {
                if (rooms[i] != undefined) {
                    texttosend += '<tr><td>' + rooms[i].name + '</td>';

                    texttosend += '<td><button onclick="openPlayersModal(' + rooms[i].num + ')">' + rooms[i].players + '</button></td>';

                    texttosend += '<td>Private Room: ' + rooms[i].privateroom + '  <button value="' + rooms[i].num + '" onclick="roompublic(' + rooms[i].num + ')">' + 'Public' + '</button><button value="' + rooms[i].num + '" onclick="roomprivate(' + rooms[i].num + ')">' + 'Private' + '</button></td>';

                    texttosend += '<td><button value="' + rooms[i].num + '" onclick="resetroom(' + rooms[i].num + ')">' + 'Reset' + '</button></td>';
                    texttosend += '<td><button value="' + rooms[i].num + '" onclick="delroom(' + rooms[i].num + ')">' + 'Delete' + '</button></td>';
                    texttosend += '</tr>';
                    rooms[i].password = 'null';
                }
            }
            roomdiv.innerHTML = texttosend;
            if (rooms != undefined && roomnum != null) {
                restartbutton.hidden = !rooms[roomnum].showrestart; // Show/Hide the restart game button. 
            }
        }
    }
}

// function updatePlayers(){ // Doesn't work.
//     var xhr = httpRequest('GET', url + '/?getplayers="admin"');
//     xhr.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             players = JSON.parse(xhr.responseText);
//         }
//     }
// }

function roompublic(theroom){
    var xhr = httpRequest('GET', url + "/?roompublic=" + theroom);
}

function roomprivate(theroom){
    var xhr = httpRequest('GET', url + "/?roomprivate=" + theroom);
}

function delroom(theroom){
    var xhr = httpRequest('GET', url + "/?delroom=" + theroom);
}

function resetroom(theroom) {
    var xhr = httpRequest('GET', url + "/?restart=" + theroom);
}


function openPlayersModal(theroom){ // This dosen't work.
    var texttosend = '';
    for(var i=0;i<players.length;i++){
        if(players[i].room == theroom){
            texttosend += players[i].name;
        }
    }
    showmodal(rooms[theroom].name + " " + texttosend);
}

function showmodal(themessage) {
    modal = document.getElementById('myModal');
    span = document.getElementsByClassName("close")[0];
    modalmessage = document.getElementById("modalmessage");
    modalmessage.innerHTML = themessage;
    modal.style.display = "block";
}

function closemodal() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
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

function updateURL(){
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
}