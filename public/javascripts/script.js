/* Donald Trump SA - Client-Side JavaScript */

var sentiment_score = $("#sentiment_score")[0].innerHTML;
var info_div = document.getElementById("info");

if(sentiment_score > 0) {
	/* Then the sentiment is POS */
	info_div.style.background = "#2BC016";
	$("img").attr("src", "/images/smile.svg");
} else {
	/* Then the sentiment is NEG */
	info_div.style.background = "#F93943";
	$("img").attr("src", "/images/frown.svg");
}

function numberOfTweets() {
	alert("YOLO")
}
