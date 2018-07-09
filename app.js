var express = require("express")
var path = require("path")
var logger = require("morgan")
var Sentiment = require("sentiment")
var sentiment = new Sentiment()

var Twitter = require("twitter")

var indexRouter = require("./routes/index")

var app = express()

var total_sentiments = 0
var sentiment_totals = 0

var tweets_arr = []
var sentiments_total = []
var sentiments_arr = []

var client = new Twitter({
	consumer_key: "5E6Ccz6Dva64Fy5zdWxJ9Z5Yj",
	consumer_secret: "vxHW4Qxzs9BIMb0BLHlZPt75wzEj0cIZ5kam4Qq5oQDCAUixXO",
	access_token_key: "1014994241817337862-jcEssofCPztMyO4yHa21XIoyVrOYJU",
	access_token_secret: "cZpcdJCH9RNbgBRw2AKFweImhs6U2jGwT3GQf7AgxBOMf"
})

client.stream("statuses/filter", {track: "donald trump"}, function(stream) {
	stream.on("data", function(tweet) {
		var tweet_data = tweet.text
		var tweet_sentiment = sentiment.analyze(tweet_data).score

		console.log(tweet_data)

		tweets_arr.push(tweet_data)
		sentiments_arr.push(tweet_sentiment)

		total_sentiments += 1
		sentiment_totals += tweet_sentiment
	})

	stream.on("error", function(err) {
		console.log("AN ERROR HAS OCCURED: " + err)
	})
})

function requestSentimentAverage() {
	return sentiment_totals / total_sentiments
}

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))

// app.use("/", indexRouter)

app.get("/", function(req, res) {
	// res.render("index", {value: requestSentimentAverage(), arr_of_tweets: tweets_arr, arr_of_sentiments: sentiments_arr})
	res.render("index", {value: requestSentimentAverage(), arr_of_sentiments: sentiments_arr, number_of_tweets: sentiments_arr.length})
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
