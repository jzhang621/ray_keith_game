function roundFromGameId(gameId) {
	// determine the round from the gameID.
	// assumes the round number is encoded in the third to last character in the gameID
	// e.g. 0041700151 -> round 1
	return parseInt(gameId.charAt(gameId.length - 3));
}
 

$( document ).ready(function() {
	var url = "https://stats.nba.com/stats/leaguegamelog?Counter=1000000&DateFrom=&DateTo=&Direction=ASC&LeagueID=00&PlayerOrTeam=P&Season=2018-19&SeasonType=Playoffs&Sorter=DATE&callback=?"

	var jimmy_players = [
		
		"Giannis Antetokounmpo",
		"Russell Westbrook",
		"Paul George",
		"James Harden",
		"Klay Thompson",
		"Kyrie Irving",
		"Khris Middleton",	
		"Ben Simmons",
		"Draymond Green",
		"Al Horford"
	];
	var ray_players = [
		"Kevin Durant",
		"Stephen Curry",
		"Kawhi Leonard",
		"Nikola Jokic",
		"DeMarcus Cousins",
		"Joel Embiid",
		"Eric Bledsoe",
		"Pascal Siakam",
		"Jimmy Butler",
		"Kyle Lowry",
	];
	class Player {
		constructor(name) {
			this._name = name;
			this._totalgames = 0;

			// maps rounds to data (pts, rebs, assists)
			this._data = {};
			for (let i = 1; i < 5; i++)  {
				this._data[i] = {
					points: 0,
					assists: 0,
					rebounds: 0,
					_totalStats: 0,
				}
			}
			this._totalStats = 0;
			this._average = 0;
		}

		inputBoxScore(boxline) {
			console.log("boxline: ", boxline);
			var points = boxline[28];
			var reb = boxline[22];
			var asts = boxline[23];

			var totalStats = points + reb + asts;	
			this._totalgames += 1;
			this._totalStats += totalStats;

			var round = roundFromGameId(boxline[6]);
			this._data[round].points += points;
			this._data[round].assists += asts;
			this._data[round].rebounds += reb;
			this._data[round]._totalStats += totalStats;
			this._average = Number(this._totalStats/this._totalgames).toFixed(1);
		}
	}

	var ray_players_class = {};
	var jimmy_players_class = {};

	for (var i = 0; i < ray_players.length; i++) { //create lists with player class
		ray_players_class[ray_players[i]] = new Player(ray_players[i]);
		jimmy_players_class[jimmy_players[i]] = new Player(jimmy_players[i]);
	}

	$.getJSON(url,  // url
	    function (data) {  // success callback
	        rowSet = data.resultSets[0].rowSet;
	        ray_total = new Array(8).fill(0);
	        ray_total[0] = "Ray Totals"
	        jimmy_total = new Array(8).fill(0);
	        jimmy_total[0] = "Keith Totals"

	        for (var i = 0; i < rowSet.length; i++) { //input boxscores into players
						if (ray_players.indexOf(rowSet[i][2]) > -1) {
							ray_players_class[rowSet[i][2]].inputBoxScore(rowSet[i]);
					}

					if (jimmy_players.indexOf(rowSet[i][2]) > -1) {
						jimmy_players_class[rowSet[i][2]].inputBoxScore(rowSet[i]);
					}
			}
				
			for (var i = 0; i < ray_players.length; i++) {

				ray_name = ray_players[i];
				jimmy_name = jimmy_players[i];
				
				// fill out totals headers
				ray_total[1] += ray_players_class[ray_name]._totalgames;
				jimmy_total[1] += jimmy_players_class[jimmy_name]._totalgames;

				ray_total[6] += ray_players_class[ray_name]._totalStats;
                jimmy_total[6] += jimmy_players_class[jimmy_name]._totalStats;

				// rounds 1 - 4
				for (let j = 2; j < 6; j++) {
					ray_total[j] += ray_players_class[ray_name]._data[j - 1]._totalStats;
					jimmy_total[j] += jimmy_players_class[jimmy_name]._data[j - 1]._totalStats;
				}

				ray_total[7] = Number(ray_total[6]/ray_total[1]).toFixed(1);
				jimmy_total[7] = Number(jimmy_total[6]/jimmy_total[1]).toFixed(1);

				// fill out data for each player
				rayRow = document.getElementById("ray_total").insertRow(2);
				rayRow.insertCell(0).innerHTML = ray_players_class[ray_name]._name;

				jimmyRow = document.getElementById("jimmy_total").insertRow(2);
				jimmyRow.insertCell(0).innerHTML = jimmy_players_class[jimmy_name]._name;

				let round = 1;
				for (let r = 1; r < 13; r += 3) {
					var rayRoundData = ray_players_class[ray_name]._data[round];
					var jimmyRoundData = jimmy_players_class[jimmy_name]._data[round];

					rayRow.insertCell(r).innerHTML = rayRoundData.points;
					jimmyRow.insertCell(r).innerHTML = jimmyRoundData.points;

					rayRow.insertCell(r + 1).innerHTML = rayRoundData.rebounds;
					jimmyRow.insertCell(r + 1).innerHTML = rayRoundData.rebounds;

					rayRow.insertCell(r + 2).innerHTML = rayRoundData.assists;
					jimmyRow.insertCell(r + 2).innerHTML = rayRoundData.assists;
					round += 1;
				}

				rayRow.insertCell(13).innerHTML = ray_players_class[ray_name]._totalgames;
				jimmyRow.insertCell(13).innerHTML = jimmy_players_class[jimmy_name]._totalgames;

				rayRow.insertCell(14).innerHTML = ray_players_class[ray_name]._totalStats;
				rayRow.insertCell(15).innerHTML = ray_players_class[ray_name]._average;
				jimmyRow.insertCell(14).innerHTML = jimmy_players_class[jimmy_name]._totalStats;
				jimmyRow.insertCell(15).innerHTML = jimmy_players_class[jimmy_name]._average;
			}

			for (var i = 0; i < ray_total.length; i++) {
				jcell = document.getElementById("jtt").insertCell(i);
				rcell = document.getElementById("rtt").insertCell(i);
				jcell.innerHTML = jimmy_total[i];
				rcell.innerHTML = ray_total[i];
			}
	    });
});

function scrolly(name) {
    var elmnt = document.getElementById(name);
    elmnt.scrollIntoView();
}
