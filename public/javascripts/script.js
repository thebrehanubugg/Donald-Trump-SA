var sentiment_score = $("#sentiment_score");

if(sentiment_score > 0) {
	/* Then the sentiment is POS */
	document.body.style.background = "green";
} else {
	/* Then the sentiment is NEG */
	document.body.style.background = "red";
}