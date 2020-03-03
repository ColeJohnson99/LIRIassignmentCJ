require("dotenv").config();

//node module imports needed for functions
var request = require("request");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var fs = require("fs");

// var used for terminal command if/elses
var liriArg = process.argv[2];

//terminal commands
 if (liriArg === "spotify-this-song") {
    song();
} else if (liriArg === "movie-this") {
    movie();
} else if (liriArg === "concert-this") {
    concert();
} else if (liriArg === "do-what-it-says") {
    getRandom();
} else {
    console.log("Please enter one of the following commands: spotify-this-song, movie-this, concert-this, do-what-it-says.");
}
//function to show Bands in town

function concert(){

    if ('concert-this')
    {
        var artist="";
        for (var i = 3; i < process.argv.length; i++)
        {
            artist+=process.argv[i];
        }
    let bandsFig = "Bandsintown"
        figlet(bandsFig, function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(chalk.green(data));
        });
        // console.log(artist);
    }
    else
    {
        artist = parameter;
    }
    
    var queryUrl = "https://rest.bandsintown.com/artists/"+ artist +"/events?app_id=codingbootcamp";
    
    
    request(queryUrl, function(error, response, body) {
    
      if (!error && response.statusCode === 200) {
    
        var JS = JSON.parse(body);
        for (i = 0; i < JS.length; i++)
        {
          var dateTime = JS[i].datetime;
            var month = dateTime.substring(5,7);
            var year = dateTime.substring(0,4);
            var day = dateTime.substring(8,10);
            var dateForm = month + "/" + day + "/" + year
      
          display(chalk.blue("\n---------------------------------------------------\n"));
          display(chalk.green("Name: " + JS[i].venue.name));
          display(chalk.green("City: " + JS[i].venue.city));
          if (JS[i].venue.region !== "")
          {
            display(chalk.green("Country: " + JS[i].venue.region));
          }
          display(chalk.green("Country: " + JS[i].venue.country));
          display(chalk.green("Date: " + dateForm));
          display(chalk.blue("\n---------------------------------------------------\n"));
    
        }
      }
    });
    }

//function to show movie data
function movie() {

    var args = process.argv;
    var movieName = "";

    for (i = 3; i < args.length; i++) {
        if (i > 3 && i < args.length) {
            movieName = movieName + "+" + args[i];
        } else {
            movieName = args[i];
        }
    };

    if (movieName === "") {
        movieName = "Mr." + "+" + "Nobody"
    };

    //run a request to the OMDB API with the specified movie
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("-------------------------------------------------------------------------------------------");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("-------------------------------------------------------------------------------------------");
        } else {
            console.log("ya' messed up");
        }
    });
};

//function to show spotify data
function song() {

    var spotify = new Spotify(keys.spotify);
    var args = process.argv;
    var songName = "";

    for (i = 3; i < args.length; i++) {
        if (i > 3 && i < args.length) {
            songName = songName + " " + args[i];
        } else {
            songName = args[i];
        }
    };
    //console.log(songName);
    if (args.length < 4) {
        songName = "the sign ace of base"
        process.argv[3] = songName;
    }
    //console.log(songName);
    spotify.search({
        type: "track",
        query: songName,
        limit: 1
    }, function (err, data) {
        if (err) {
            console.log("ya' messed up: " + err);
            return;
        }
        console.log("-------------------------------------------------------------------------------------------");
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Preview link: " + data.tracks.items[0].external_urls.spotify);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("-------------------------------------------------------------------------------------------");
    });
};

//random fs function
function getRandom() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var data = data.split(',');

        if (data[0] === "spotify-this-song") {
            process.argv[3] = data[1];
            song();
        }
    })
};