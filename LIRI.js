require("dotenv").config();

//node module imports needed for functions
//var request = require("request");
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
} else if (liriArg === "do-what-it-says") {
    doSome();
} else {
    console.log("Please enter one of the following commands: spotify-this-song, movie-this, do-what-it-says.");
}


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
function doSome() {

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