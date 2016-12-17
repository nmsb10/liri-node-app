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
var keysWhatev = require('./keys.js');

//https://github.com/desmondmorris/node-twitter
var forTwitter = new Twitter(keysWhatev);

inquirer.prompt([
	{
		//use inquirer to ask user for their name. just for a nicer user experience
		type: 'input',
		name: 'userName',
		message: 'Hello! What is your name?'
	},
	{
		//offer the user the list of possible commands
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
//based on the user's selection of 'whatToDo' (which is answers.whatToDo), do this:
]).then(function(answers){
	if(answers.whatToDo==='my-tweets'){
		//can make a variable to replace the screen name object with a different user name
		forTwitter.get('statuses/user_timeline', {screen_name: 'happyfoxchi'}, function(error, tweets, response) {
			if(!error){
				var numberOfTweets = 0;
				//if tweets is more than 20, limit the number of tweets to display to 20
				if(tweets.length>20){
					numberOfTweets = 20;
				}else{
					numberOfTweets = tweets.length;
				}
				//loop through no more than 20 of the most recent tweets, display with their number
				for(var i = 0; i<numberOfTweets; i++){
					var boom = i + 1;
					console.log(boom + '. ' + tweets[i].text + ' ~ tweeted on: '+ tweets[i].created_at);
				}
				//add that the user requested to display tweets to log.txt
				logCommand(answers.userName,'my-tweets', 'tweets displayed');
			}
		});
	}else if(answers.whatToDo === 'spotify-this-song'){
		//ask the user which song they want to look up in spotify
		inquirer.prompt([
			{
				type: 'input',
				name: 'whichSong',
				message: 'Thanks, ' + answers.userName + '! Enter a song you would like to search:'
			}
		]).then(function(song){
			//first check if the user didn't enter a song to search
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
					//if user did not select a song, search through the results to display only the "Ace of Base" results
					for(var i = 0; i<data.tracks.items.length; i++){
						if(data.tracks.items[i].album.artists[0].name==='Ace of Base'){
							console.log('Artist(s): ' + data.tracks.items[i].album.artists[0].name);
							console.log('Song name: ' + data.tracks.items[i].name);
							console.log('Spotify preview link: ' + data.tracks.items[i].preview_url);
							console.log('Album name: ' + data.tracks.items[i].album.name);
							logCommand(answers.userName,'spotify-this-song',song.whichSong);
							return;
						}
					}
				//else if user entered a song name, display the required information after
				//doing such a good job unraveling that array of objects and more arrays and objects
				}else{
					console.log('Artist(s): ' + data.tracks.items[0].album.artists[0].name);
					console.log('Song name: ' + data.tracks.items[0].name);
					console.log('Spotify preview link: ' + data.tracks.items[0].preview_url);
					console.log('Album name: ' + data.tracks.items[0].album.name);
					logCommand(answers.userName,'spotify-this-song',song.whichSong);
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
			//(http://www.omdbapi.com)
			// See link here: http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
			//console.log(JSON.stringify(data, null, 2));
			//if user does not enter a movie title, use mr. nobody
			if(response.whichMovie===''){
				response.whichMovie = 'mr nobody';
			}
			logCommand(answers.userName, 'movie-this',response.whichMovie);
			var queryUrl = "http://www.omdbapi.com/?t=" + response.whichMovie + "&y=&plot=full&r=json&tomatoes=true";			
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
		//read the random.txt file, read utf8 format
		fs.readFile('random.txt','utf8', function(error, data){
			if(error){
				return console.log(error);
			}
			var dataArray = data.split(',');
			var doWhat = '';
			var ofWhat = '';
			for(var i = 0; i<dataArray.length; i++){
				doWhat = dataArray[0];
				ofWhat = dataArray[1];
			}
			roast(doWhat, ofWhat);
			logCommand(answers.userName,'do-what-it-says',doWhat + ': ' + ofWhat);
		});
	}
});

function logCommand(user, order, task){
	fs.appendFile('log.txt', user + ' requested to ' + order + ': ' + task + ';\n', function(err){
		if(err){
			console.log(err);
		}
	});
}

function roast(un, deux){
	switch(un){
		case 'my-tweets':
			//https://support.twitter.com/articles/160385
			//This will show your last 20 tweets and when they were created at
			//in your terminal/bash window.
			forTwitter.get('statuses/user_timeline', {screen_name: 'happyfoxchi'}, function(error, tweets, response) {
			if(!error){
				var numberOfTweets = 0;
				if(tweets.length>20){
					numberOfTweets = 20;
				}else{
					numberOfTweets = tweets.length;
				}
				for(var i = 0; i<numberOfTweets; i++){
					var boom = i + 1;
					console.log(boom + '. ' + tweets[i].text + ' ~ tweeted on: '+ tweets[i].created_at);
				}
			}
		});
			break;
		case 'spotify-this-song':
			var lime = false;
			if(deux === ''){
				// * "The Sign" by Ace of Base
				deux = "The Sign";
				lime = true;
			}
			spotify.search({ type: 'track', query: deux }, function(err, data) {
				if (err) {
					console.log('Error occurred: ' + err);
					return;
				}
				if(lime){
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
			break;
		case 'movie-this':
			if(deux.trim() === ''){
				deux = 'mr nobody';
			}
			var queryUrl = "http://www.omdbapi.com/?t=" + deux + "&y=&plot=full&r=json&tomatoes=true";			
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
			break;
		case 'do-what-it-says':
			console.log("eh. try again.");
			break;
		default:
			console.log('what the heck. I cannot understand :(');
	}
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
