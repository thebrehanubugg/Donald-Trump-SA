/* Donald Trump SA Server File. */

var express = require("express")
var app = express()

var path = require("path")
var Sentiment = require("sentiment")
var sentiment = new Sentiment()

var Twitter = require("twitter")
var client = new Twitter({
	consumer_key: "5E6Ccz6Dva64Fy5zdWxJ9Z5Yj",
	consumer_secret: "vxHW4Qxzs9BIMb0BLHlZPt75wzEj0cIZ5kam4Qq5oQDCAUixXO",
	access_token_key: "1014994241817337862-jcEssofCPztMyO4yHa21XIoyVrOYJU",
	access_token_secret: "cZpcdJCH9RNbgBRw2AKFweImhs6U2jGwT3GQf7AgxBOMf"
})

var total_sentiments = 0
var sentiment_totals = 0

var sentiments_arr = []

client.stream("statuses/filter", {track: "donald trump"}, function(stream) {
	stream.on("data", function(tweet) {
		var tweet_data = tweet.text
		var tweet_sentiment = sentiment.analyze(tweet_data).score

		if(sentiments_arr.length >= 50) {
			sentiments_arr.pop()
		}

		sentiments_arr.push(tweet_sentiment)

		total_sentiments += 1
		sentiment_totals += tweet_sentiment
	})

	stream.on("error", function(err) {
		throw err;
	})
})

function requestSentimentAverage() {
	return sentiment_totals / total_sentiments
}

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))

app.get("/", function(req, res) {
	res.render("index", {value: requestSentimentAverage(), number_of_tweets: total_sentiments})
})

app.get("/graph", function(req, res) {
	res.render("graph", {data: sentiments_arr})
})

app.get("/data", function(req, res) {
	return "#YOLO"
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get("env") === "development" ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render("error")
})

app.listen(8080)

module.exports = app
