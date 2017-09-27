//Including the keys data and require, tiwtter, and spotify npm packages and fs node package. 
//Also setting an integer to provide numbers for any feeds with multiple items.

var keys = require("./keys.js");
var request = require("request");
var twitter = require("twitter");
var spotify = require('node-spotify-api');
var fs = require("fs");
var resultsFeed = 0 

//Setting variables for arguments to be input by the user in terminal/bash. Added a for loop to allow the user
//to input arguments for the program's search functions without the need for quotation marks. Titles and song names
//of any length will return a result.

var nodeArgs = process.argv
var liriCommand = process.argv[2];
var liriSubject = "";

for (var i = 3; i < nodeArgs.length; i++) {
  if (i > 3 && i < nodeArgs.length) {
    liriSubject = liriSubject + "+" + nodeArgs[i];
  }
  else {
    liriSubject += nodeArgs[i];
  }
}

//The tweet feed condition and function. This will post the last 20 tweets under the account I created for this assignment.
//They'll be numbered to make it easier on the reader as well. I've also added code to log the results to log.txt.

if (liriCommand === "my-tweets") {
	myTwitterFeed();
} 

function myTwitterFeed(){
	client = new twitter(keys.twitterKeys);
	client.get('statuses/user_timeline', { screen_name: 'lJustAlexl', count: 20 }, function(error, tweets, response) {
      fs.appendFile("log.txt", "\r\nCommand to run: "+process.argv.slice(2)+"\r\n"
      +"----------------------------"+"\r\n"
      +"Beginning Twitter feed..."+"\r\n")
      for (i=0;i<tweets.length;i++){
      resultsFeed++
      fs.appendFile("log.txt", "----------------------------"+"\r\n"
      +resultsFeed+"."+"\r\n"
      +"Text: "+tweets[i].text+"\r\n"
      +"Published: "+tweets[i].created_at+"\r\n");
      console.log("----------------------------");
      console.log(resultsFeed+".");
      console.log("Text: "+tweets[i].text);
      console.log("Published: "+tweets[i].created_at);
    };
    if (error) {
    	console.log(error)
    	fs.appendFile("log.txt", "Error occured. See below: "+"\r\n"+error)
    }
  });
 }

//The spotify search condition and function. In the event that the second argument is blank, the spotify function
//will run a search for 'The Sign' by Ace of Base. During research, I learned that some tracks won't have preview links.
//Rather than display a null property, I've included a link to the full song if there isn't an available preview link.
//The results will be saved to log.txt. 

if (liriCommand === "spotify-this-song") {
	spotifyThisSong();
}

function spotifyThisSong() {
	client = new spotify(keys.spotifyKeys);
	fs.appendFile("log.txt", "\r\nCommand to run: "+process.argv.slice(2)+"\r\n"
	+"---------------------------------------------"+"\r\n"
  +"Beginning Spotify search..."+"\r\n")
	if (liriSubject === "") {
  	client.search({ type: 'track', query: "The Sign Ace of Base", limit: "1" }, function(err, data) {
  
  	if (err) {
    	return console.log("Error occurred: "+err);
    	fs.appendFile("log.txt", "Error occurred. See below: "+"\r\n"+err+"\r\n");
  	}
  	console.log("---------------------------------------------")
 		console.log("Artist: "+data.tracks.items[0].artists[0].name);
		console.log("Song Name: "+data.tracks.items[0].name);
		fs.appendFile("log.txt", "---------------------------------------------"+"\r\n"
		+"Artist: "+data.tracks.items[0].artists[0].name+"\r\n"
		+"Song Name: "+data.tracks.items[0].name+"\r\n");
		if (data.tracks.items[0].preview_url == null) {
		console.log("Link: "+data.tracks.items[0].external_urls.spotify);
		fs.appendFile("log.txt", "Link: "+data.tracks.items[0].external_urls.spotify+"\r\n")
		} else {
		console.log("Preview Link: "+data.tracks.items[0].preview_url);
		fs.appendFile("log.txt", "Preview Link: "+data.tracks.items[0].preview_url+"\r\n")
		}
		console.log("Album: "+data.tracks.items[0].album.name);
		console.log("---------------------------------------------")
		fs.appendFile("log.txt", "Album: "+data.tracks.items[0].album.name+"\r\n"
		+"---------------------------------------------"+"\r\n")
		});
  } else {

		client.search({ type: 'track', query: liriSubject, limit: "1" }, function(err, data) {
  
  	if (err) {
    	return console.log('Error occurred: ' + err);
    	fs.appendFile("log.txt", "Error occurred. See below: "+"\r\n"+err+"\r\n");
  	}
  	console.log("---------------------------------------------")
 		console.log("Artist: "+data.tracks.items[0].artists[0].name);
		console.log("Song Name: "+data.tracks.items[0].name);
		fs.appendFile("log.txt", "---------------------------------------------"+"\r\n"
		+"Artist: "+data.tracks.items[0].artists[0].name+"\r\n"
		+"Song Name: "+data.tracks.items[0].name+"\r\n");
		if (data.tracks.items[0].preview_url == null) {
		console.log("Link: "+data.tracks.items[0].external_urls.spotify);
		fs.appendFile("log.txt", "Link: "+data.tracks.items[0].external_urls.spotify+"\r\n")
		} else {
		console.log("Preview Link: "+data.tracks.items[0].preview_url);
		fs.appendFile("log.txt", "Preview Link: "+data.tracks.items[0].preview_url+"\r\n")
		}
		console.log("Album: "+data.tracks.items[0].album.name);
		console.log("---------------------------------------------")
		fs.appendFile("log.txt", "Album: "+data.tracks.items[0].album.name+"\r\n"
		+"---------------------------------------------"+"\r\n")
		});
	};
}

//The movie search condition and function. In the event of a successful request (response satus code == 200), the
//body of the response will be parsed and the data we need will be displayed to the user. In the event that no
//movie is specified, the program will produce the information for Mr. Nobody, an excellent and thought-provoking film.
//The results will be saved to log.txt.

if (liriCommand === "movie-this") {
movieSearch();
}

function movieSearch() {
	fs.appendFile("log.txt", "\r\nCommand to run: "+process.argv.slice(2)+"\r\n")
	if (liriSubject === "") {
	request("http://www.omdbapi.com/?t=mr+nobody&y=&plot=short&apikey=40e9cece", function(error, response, body) {
  if (!error && response.statusCode === 200) {
  	console.log("--------------------------------")
  	console.log("Title: "+JSON.parse(body).Title)
  	console.log("Released: "+JSON.parse(body).Released)
    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
    console.log("Rotten Tomatoes Rating: "+JSON.parse(body).Ratings[1].Value)
    console.log("Produced in "+JSON.parse(body).Country)
    console.log("Language: "+JSON.parse(body).Language)
    console.log("Plot: "+JSON.parse(body).Plot)
    console.log("--------------------------------")
    fs.appendFile("log.txt", "---------------------------------------------"+"\r\n"
	  +"Beginning movie search..."+"\r\n"
	  +"---------------------------------------------"+"\r\n"
    +"Title: "+JSON.parse(body).Title+"\r\n"
		+"Released: "+JSON.parse(body).Released+"\r\n"
		+"IMDB Rating: " + JSON.parse(body).imdbRating+"\r\n"
		+"Rotten Tomatoes Rating: "+JSON.parse(body).Ratings[1].Value+"\r\n"
		+"Produced in "+JSON.parse(body).Country+"\r\n"
		+"Language: "+JSON.parse(body).Language+"\r\n"
		+"Plot: "+JSON.parse(body).Plot+"\r\n"
		+"---------------------------------------------"+"\r\n")
  	} else {
  		console.log("See Error: "+error);
  		fs.appendFile("log.txt", "Error occurred. See below: "+"\r\n"+error+"\r\n");
  		}
		})
	} else {
			request("http://www.omdbapi.com/?t="+liriSubject+"&y=&plot=short&apikey=40e9cece", function(error, response, body) {
			if (!error && response.statusCode === 200) {
  		console.log("--------------------------------")
	  	console.log("Title: "+JSON.parse(body).Title)
	  	console.log("Released: "+JSON.parse(body).Released)
	    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
	    console.log("Rotten Tomatoes Rating: "+JSON.parse(body).Ratings[1].Value)
	    console.log("Produced in "+JSON.parse(body).Country)
	    console.log("Language: "+JSON.parse(body).Language)
	    console.log("Plot: "+JSON.parse(body).Plot)
	    console.log("--------------------------------")
	    fs.appendFile("log.txt", "---------------------------------------------"+"\r\n"
	    +"Beginning movie search..."+"\r\n"
	    +"---------------------------------------------"+"\r\n"
	    +"Title: "+JSON.parse(body).Title+"\r\n"
			+"Released: "+JSON.parse(body).Released+"\r\n"
			+"IMDB Rating: " + JSON.parse(body).imdbRating+"\r\n"
			+"Rotten Tomatoes Rating: "+JSON.parse(body).Ratings[1].Value+"\r\n"
			+"Produced in "+JSON.parse(body).Country+"\r\n"
			+"Language: "+JSON.parse(body).Language+"\r\n"
			+"Plot: "+JSON.parse(body).Plot+"\r\n"
			+"---------------------------------------------"+"\r\n")
  		} else {
			console.log("See Error: "+error);
			fs.appendFile("log.txt", "Error occurred. See below: "+"\r\n"+error+"\r\n");
			}
		});
	}
}

//This condition will check a .txt file in the main folder for instructions. It first splits the text into an array
//and looks to the first and second value in that array for how to proceed. The first value informs the program of the 
//function to be run and the second value details the subject in the event that a search will need to be performed.

if (liriCommand === "do-what-it-says") {
	fs.readFile("random.txt", "utf8", function(error, data) {
		var dataArr = data.split(",")
		liriCommand = dataArr[0];
		liriSubject = dataArr[1];
		if (liriCommand === "my-tweets"){
			myTwitterFeed();
		}
		if (liriCommand === "spotify-this-song"){
			spotifyThisSong();
		}
		if (liriCommand === "movie-this"){
			movieSearch();
		}
	});
}