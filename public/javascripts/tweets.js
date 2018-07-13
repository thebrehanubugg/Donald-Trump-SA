/* Donald Trump SA - Client-Side JavaScript */

var socket = io();

socket.on("data", function(data) {
	for(var i = 0; i < data.length; i++) {
		tweet = data[i][0];
		sentiment = data[i][1];
		var div = document.createElement("div");
		var innerDiv = document.createElement("div");

		var h1 = document.createElement("h1");
		var ht = document.createTextNode(sentiment);
		var para = document.createElement("p");
		var t = document.createTextNode(tweet);

		h1.appendChild(ht);
		para.appendChild(t);
		innerDiv.className = "wrapper";

		if(sentiment > 0) {
			div.style.background = "#2BC016";
		} else {
			div.style.background = "#F93943";
		}

		innerDiv.appendChild(h1);
		innerDiv.appendChild(para);

		div.appendChild(innerDiv);

		info = document.getElementById("info")
		info.insertBefore(div, info.firstChild);
	}
})