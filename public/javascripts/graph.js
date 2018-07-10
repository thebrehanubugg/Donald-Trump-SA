/* Donald Trump SA - Client-Side JavaScript */

var ctx = document.getElementById("graph").getContext("2d");
var p = document.getElementById("data_paragraph");

p.style.visibility = "hidden";

var data = p.innerHTML;
var temp = data.split(",");

var tweet_data = [];

for(a in temp) {
	var a_temp = parseInt(temp[a], 10);
	tweet_data.push(a_temp);
}

var fifty = [];
for(var i = 1; i < 51; i++) {
	fifty.push(i);
}

var chart = new Chart(ctx, {
	type: "line",

	data: {
		labels: fifty,
		datasets: [{
			label: "Last 50 Tweets concerning Trump",
			backgroundColor: "rgb(255, 99, 132)",
			borderColor: "rgb(255, 99, 132)",
			fill: false,
			data: tweet_data,
		}]
	},

	options: {}
})
