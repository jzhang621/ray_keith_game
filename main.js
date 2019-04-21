function roundFromGameId(gameId) {
	// determine the round from the gameID.
	// assumes the round number is encoded in the third to last character in the gameID
	// e.g. 0041700151 -> round 1
	return parseInt(gameId.charAt(gameId.length - 3));
}
 

$( document ).ready(function() {
	var url = "https://stats.nba.com/stats/leaguegamelog?Counter=1000000&DateFrom=&DateTo=&Direction=ASC&LeagueID=00&PlayerOrTeam=P&Season=2018-19&SeasonType=Playoffs&Sorter=DATE&callback=?"

	var ray_players = [
		"Stephen Curry",
		"Giannis Antetokounmpo",
		"James Harden",
		"Paul George",
		"Kyrie Irving",
		"Joel Embiid",
		"Kyle Lowry",
		"Russell Westbrook",
		"Jamal Murray",
		"JJ Redick"];
	var jimmy_players = [
		"Kevin Durant",
		"Kawhi Leonard",
		"Klay Thompson",
		"Pascal Siakam",
		"Khris Middleton",
		"DeMarcus Cousins",
		"Nikola Jokic",
		"Eric Bledsoe",
		"Jimmy Butler",
		"Serge Ibaka"
	];
	class Player {
		constructor(name) {
			this._name = name;
			this._totalgames = 0;
			this._round1points = 0;
			this._round2points = 0;
			this._round3points = 0;
			this._round4points = 0;
			this._totalpoints = 0;
			this._average = 0;
		}

		inputBoxScore(boxline) {
			console.log("boxline: ", boxline);
			var points = boxline[28];
			var reb = boxline[22];
			var asts = boxline[23];
			this._totalgames += 1;
			this._totalpoints += points;

			var round = roundFromGameId(boxline[6]);
			switch(round) {
				case 1:
					this._round1points += points;
					break;
				case 2:
					this._round2points += points;
					break;
				case 3:
					this._round3points += points;
					break;
				case 4:
					this._round4points += points;
					break;
			}

			this._average = Number(this._totalpoints/this._totalgames).toFixed(1);
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
	        jimmy_total[0] = "Jimmy Totals"

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

				ray_total[1] += ray_players_class[ray_name]._totalgames;
				jimmy_total[1] += jimmy_players_class[jimmy_name]._totalgames;

				ray_total[2] += ray_players_class[ray_name]._round1points;
				jimmy_total[2] += jimmy_players_class[jimmy_name]._round1points;

				ray_total[3] += ray_players_class[ray_name]._round2points;
				jimmy_total[3] += jimmy_players_class[jimmy_name]._round2points;

				ray_total[4] += ray_players_class[ray_name]._round3points;
				jimmy_total[4] += jimmy_players_class[jimmy_name]._round3points;

				ray_total[5] += ray_players_class[ray_name]._round4points;
				jimmy_total[5] += jimmy_players_class[jimmy_name]._round4points;

				ray_total[6] += ray_players_class[ray_name]._totalpoints;
				jimmy_total[6] += jimmy_players_class[jimmy_name]._totalpoints;

				row = document.getElementById("ray_total").insertRow(1); //rodger
				row.insertCell(0).innerHTML = ray_players_class[ray_name]._name;
				row.insertCell(1).innerHTML = ray_players_class[ray_name]._totalgames;
				row.insertCell(2).innerHTML = ray_players_class[ray_name]._round1points;
				row.insertCell(3).innerHTML = ray_players_class[ray_name]._round2points;
				row.insertCell(4).innerHTML = ray_players_class[ray_name]._round3points;
				row.insertCell(5).innerHTML = ray_players_class[ray_name]._round4points;
				row.insertCell(6).innerHTML = ray_players_class[ray_name]._totalpoints;
				row.insertCell(7).innerHTML = ray_players_class[ray_name]._average;

				row = document.getElementById("jimmy_total").insertRow(1); //jimmy
				row.insertCell(0).innerHTML = jimmy_players_class[jimmy_name]._name;
				row.insertCell(1).innerHTML = jimmy_players_class[jimmy_name]._totalgames;
				row.insertCell(2).innerHTML = jimmy_players_class[jimmy_name]._round1points;
				row.insertCell(3).innerHTML = jimmy_players_class[jimmy_name]._round2points;
				row.insertCell(4).innerHTML = jimmy_players_class[jimmy_name]._round3points;
				row.insertCell(5).innerHTML = jimmy_players_class[jimmy_name]._round4points;
				row.insertCell(6).innerHTML = jimmy_players_class[jimmy_name]._totalpoints;
				row.insertCell(7).innerHTML = jimmy_players_class[jimmy_name]._average;
			}

			ray_total[7] = Number(ray_total[6]/ray_total[1]).toFixed(1);
			jimmy_total[7] = Number(jimmy_total[6]/jimmy_total[1]).toFixed(1);

			for (var i = 0; i < ray_total.length; i++) {
				if (i != 0) {
					jrow = document.getElementById("jtl");
					rrow = document.getElementById("rtl");
					jrow.insertCell(i).innerHTML = jimmy_total[i];
					rrow.insertCell(i).innerHTML = ray_total[i];
				}

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
