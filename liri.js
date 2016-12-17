var Twitter = require('twitter');
var spotify = require('spotify');
//You'll use Request to grab data from the [OMDB API]
//(http://www.omdbapi.com)
var request = require('request');
//https://github.com/SBoudrias/Inquirer.js/tree/master/examples
var inquirer = require('inquirer');
//include the FS package for reading and writing packages
//fs = file streaming
//https://nodejs.org/api/fs.html
var fs = require('fs');

//this gets twitterKeys from keys.js
var keysForTwit = require('./keys.js');

inquirer.prompt([
	{
		type: 'input',
		name: 'userName',
		message: 'Hello! What is your name?'
	},
	{
		type: 'list',
		name: 'whatToDo',
		message: 'Welcome! What would you like to do?',
		choices: [
			'my-tweets',
			'spotify-this-song',
			'movie-this',
			'do-what-it-says'
		]
	}
]).then(function(answers){
	if(answers.whatToDo==='my-tweets'){
		console.log('your last 20 tweets');
	}else if(answers.whatToDo === 'spotify-this-song'){
		inquirer.prompt([
			{
				type: 'input',
				name: 'whichSong',
				message: 'Thanks, ' + answers.userName + '! Enter a song you would like to search:'
			}
		]).then(function(song){
			var green = false;
			if(song.whichSong === ''){
				// * "The Sign" by Ace of Base
				song.whichSong = "The Sign";
				green = true;
			}
			spotify.search({ type: 'track', query: song.whichSong }, function(err, data) {
				if (err) {
					console.log('Error occurred: ' + err);
					return;
				}
				if(green){
					for(var i = 0; i<data.tracks.items.length; i++){
						if(data.tracks.items[i].album.artists[0].name==='Ace of Base'){
							console.log('Artist(s): ' + data.tracks.items[i].album.artists[0].name);
							console.log('Song name: ' + data.tracks.items[i].name);
							console.log('Spotify preview link: ' + data.tracks.items[i].preview_url);
							console.log('Album name: ' + data.tracks.items[i].album.name);
							return;
						}
					}
				}else{
					console.log('Artist(s): ' + data.tracks.items[0].album.artists[0].name);
					console.log('Song name: ' + data.tracks.items[0].name);
					console.log('Spotify preview link: ' + data.tracks.items[0].preview_url);
					console.log('Album name: ' + data.tracks.items[0].album.name);
				}
			});
		});
	}else if (answers.whatToDo === 'movie-this'){
		inquirer.prompt([
			{
				type: 'input',
				name: 'whichMovie',
				message: 'Thank you, ' + answers.userName + '! Enter a movie you would like to search:'
			}
		]).then(function(response){
			////(http://www.omdbapi.com)
			var queryUrl = "http://www.omdbapi.com/?t=" + response.whichMovie + "&y=&plot=full&r=json&tomatoes=true";
			if(response.whichMovie===''){
				queryUrl = 'http://www.omdbapi.com/?t=mr%20nobody&y=&plot=full&r=json&tomatoes=true';
			}
			request(queryUrl, function(error, redShrimp, algae){
			//if the request is successful, statusCodes may include...
			if(!error && redShrimp.statusCode ===200){
				console.log('Title: ' + JSON.parse(algae).Title);
				console.log('Year & Release Date: ' + JSON.parse(algae).Year + ' | ' + JSON.parse(algae).Released);
				console.log('imdbRating and Votes: ' + JSON.parse(algae).imdbRating + " | " + JSON.parse(algae).imdbVotes);
				console.log('In Which Country(ies) Produced: ' + JSON.parse(algae).Country);
				console.log('Language: ' + JSON.parse(algae).Language);
				console.log('Actors: ' + JSON.parse(algae).Actors);
				console.log('Plot: ' + JSON.parse(algae).Plot);
				console.log('Rating by Rotten Tomatoes: ' + JSON.parse(algae).tomatoRating);
				console.log('Rotten Tomatoes URL: ' + JSON.parse(algae).tomatoURL);
			}
			});
		});
	}else if(answers.whatToDo === 'do-what-it-says'){
		console.log("thanks for playing. finish this in a moment please.");
		// See link here: http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
		//console.log(JSON.stringify(data, null, 2));
	}

});


//roast(sizzle, spaghetti);

function roast(un, deux){
	switch(un){
		case 'my-tweets':
			//https://support.twitter.com/articles/160385
			//This will show your last 20 tweets and when they were created at
			//in your terminal/bash window.
			break;
		case 'spotify-this-song':
			console.log('spotifylicious');
			//This will show the following information about the song (deux)
			//in your terminal/bash window
			spotify.search({ type: 'track', query: deux }, function(err, data) {
				if (err) {
					console.log('Error occurred: ' + err);
					return;
				}
				console.log(data.album.name+ '\n'+data[0].album.name);
				// Do something with 'data' 
			});
	//     * Artist(s)
	//     * The song's name
	//     * A preview link of the song from Spotify
	//     * The album that the song is from

	// * if no song is provided then your program will default to
	//     * "The Sign" by Ace of Base
			break;
		case 'movie-this':
			//This will output the following information to your
			//terminal/bash window:
			//     * Title of the movie.
			//     * Year the movie came out.
			//     * OMDB Rating of the movie.
			//     * Country where the movie was produced.
			//     * Language of the movie.
			//     * Plot of the movie.
			//     * Actors in the movie.
			//     * Rotten Tomatoes Rating.
			//     * Rotten Tomatoes URL
			//https://www.omdbapi.com/
			//send all data requests to:
			//var pasta = 'http://www.omdbapi.com/?';
			var queryUrl = "http://www.omdbapi.com/?t=" + deux + "&y=&plot=short&r=json";
			//request(queryUrl, function(error, response, body) {
			request(queryUrl, function(error, redShrimp, algae){
				//if the request is successful, statusCodes may include...
				if(!error && redShrimp.statusCode ===200){
					console.log('Title: ' + JSON.parse(algae).Title);
				}
			});

			// See link here: http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
			//console.log(JSON.stringify(data, null, 2));

// 	example) JSON.parse(body).Plot
// request(queryUrl, function(error, response, body){}

// 	so that's the parameter i used for request, and seems like when
//you use JSON.parse(body), seemed to be reading as object.


	// * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
	//    * If you haven't watched "Mr. Nobody," then you should: http://www.IMDB.com/title/tt0485947/
	//     * It's on Netflix!
			break;
		case 'do-what-it-says':
			logCommand(un, deux);
			//dash();
			//Using the fs Node package, LIRI will take the text inside
			//of random.txt and then use it to call one of LIRI's commands.
	// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
	// Feel free to change the text in that document to test out the feature for other commands.
	// BONUS

	// In addition to logging the data to your terminal/bash window, output the data to a .txt file called log.txt.
	// Make sure you append each command you run to the log.txt file.
	// Do not overwrite your file each time you run a command.
			break;
		default:
			console.log('what the heck. I cannot understand :(');
}

}

function logCommand(order, task){
	fs.appendFile('log.txt', order + ': ' + task + ';\n', function(err){
		if(err){
			console.log(err);
		}
	});
}

function dash(){
	//read the random.txt file, read utf8 format
	fs.readFile('random.txt','utf8', function(error, data){
		if(error){
			return console.log(error);
		}
		var dataArray = data.split(';');
		var doWhat = '';
		var ofWhat = '';
		for(var i = 0; i<dataArray.length; i++){
			doWhat = dataArray[0];
			ofWhat = dataArray[1];
		}
		roast(doWhat, ofWhat);
	});
}

//homework 8:
//1. create the git repository
//2. make some tweets on your twitter account
//3. in git bash, navigate to the homework 8 repository liri-node-app
//4. create a .gitignore file:
//--in git bash, type touch .gitignore
//--open the .gitignore file
//--type this into the file:
// keys.js
// node_modules
//5. create package.json:
// -Why create a package.json?
// --So when you push your repository to github, others can download
//the repository, and the package.json will describe the dependencies
//required. So others can simply type 'npm install' which will
//automatically install all dependencies required.
// How to create a package.json:
// --(in git bash, first get in the appropriate repository. Then type):
//npm init
// ---name: whatever you want
// ---version: whatever you want
// ---description: describe what this application does
// ---entry point: you can type the particular .js file name, or
//leave the default (which will be the "first" file in the repository)
// ---test command: whatever you want
// ---git repository: as appropriate
// ---keywords: whatever you want
// --- author: your name or whatever you want
// ---license: default is ISC or you can type MIT
// ---confirm: yes
//6. add the necessary dependencies to the package.json file
// -How to add "dependencies" (particular npm packages / npm libraries):
// --in git bash, type: npm install libraryName (eg inquirer, or
//geocoder, etc) --save
// --(this will save the particular package both in your own
//automatically generated node_modules folder AND in
//the package.json file)

// * [Twitter](https://www.npmjs.com/package/twitter)
// * [Spotify](https://www.npmjs.com/package/spotify)
// * [Request](https://www.npmjs.com/package/request)
//     * You'll use Request to grab data from the [OMDB API]
//(http://www.omdbapi.com).

//7. obtain your twitter API keys
// * Step One: Visit https://apps.twitter.com/app/new
// * Step Two: Fill out the form with dummy data. 
//Name: eight-8-dev; Description: give and take.
//Type `http://google.com` in the Website input. Don't fill out the
//Callback URL input. Then submit the form.
// * Step Three: On the next screen, click the Keys and Access Tokens
//tab to get your consume key and secret. 
//     * Copy and paste them where the `<input here>` tags are inside
//your keys.js file.
// * Step Four: At the bottom of the page, click the `Create my access
//token` button to get your access token key and secret. 
//     * Copy the access token key and secret displayed at the bottom
//of the next screen. Paste them where the `<input here>` tags are
//inside your keys.js file.
