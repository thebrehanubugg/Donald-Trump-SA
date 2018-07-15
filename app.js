/* Donald Trump SA Server File. */

var express = require("express")
var app = express()

var http = require("http").Server(app)

var io = require("socket.io")(http)

var path = require("path")
var ml = require("ml-sentiment")()

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
var tweets_arr = []

client.stream("statuses/filter", {track: "donald trump"}, function(stream) {
	stream.on("data", function(tweet) {
		var tweet_data = ""
		if(tweet.retweeted_status && tweet.retweeted_status.extended_tweet) {
			tweet_data = tweet.retweeted_status.extended_tweet.full_text
		} else if(tweet.extended_tweet) {
			tweet_data = tweet.extended_tweet.full_text
		} else {
			tweet_data = tweet.text
		}

		var tweet_sentiment = ml.classify(tweet_data)

		if(sentiments_arr.length >= 150) {
			sentiments_arr.pop()
		}

		if(tweets_arr.length >= 150) {
			tweets_arr.pop()
		}

		sentiments_arr.push(tweet_sentiment)
		tweets_arr.push([tweet_data, tweet_sentiment])

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
app.use("/dtsa", express.static(__dirname + "/public"))

io.on("connection", function(socket) {
	io.emit("data", tweets_arr)

	io.on("disconnect", function() {
	})
})

app.get("/", function(req, res) {
	res.redirect("/dtsa")	
})

app.get("/dtsa", function(req, res) {
	res.render("index", {value: requestSentimentAverage(), number_of_tweets: total_sentiments})
})

app.get("/dtsa/graph", function(req, res) {
	res.render("graph", {data: sentiments_arr})
})

app.get("/dtsa/tweets", function(req, res) {
	res.render("tweets")
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

http.listen(1993, function() {
	console.log("Listening on *:1993")
})

module.exports = app
