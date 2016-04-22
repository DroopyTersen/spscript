var queryString = require('./queryString');
var utils = require('./utils')
var Search = function(dao) {
	this._dao = dao;
};

Search.QueryOptions = function() {
	this.sourceid = null;
	this.startrow = null;
	this.rowlimit = 30;
	this.selectedproperties = null;
	this.refiners = null;
	this.refinementfilters = null;
	this.hiddenconstraints = null;
	this.sortlist = null;
};

var convertRowsToObjects = function(itemRows) {
	var items = [];

	for (var i = 0; i < itemRows.length; i++) {
		var row = itemRows[i],
			item = {};
		for (var j = 0; j < row.Cells.results.length; j++) {
			item[row.Cells.results[j].Key] = row.Cells.results[j].Value;
		}

		items.push(item);
	}

	return items;
};

//sealed class used to format results
var SearchResults = function(queryResponse) {
	this.elapsedTime = queryResponse.ElapsedTime;
	this.suggestion = queryResponse.SpellingSuggestion;
	this.resultsCount = queryResponse.PrimaryQueryResult.RelevantResults.RowCount;
	this.totalResults = queryResponse.PrimaryQueryResult.RelevantResults.TotalRows;
	this.totalResultsIncludingDuplicates = queryResponse.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates;
	this.items = convertRowsToObjects(queryResponse.PrimaryQueryResult.RelevantResults.Table.Rows.results);
	this.refiners = queryResponse.PrimaryQueryResult.RefinementResults ? MapRefiners(queryResponse.PrimaryQueryResult.RefinementResults.Refiners.results) : null;
};

var MapRefiners = function(refinerResults) {
	var refiners = [];

	for (var i = 0; i < refinerResults.length; i++) {
		var entry = {};
		entry.RefinerName = refinerResults[i].Name;
		entry.RefinerOptions = refinerResults[i].Entries.results;

		refiners.push(entry);
	}

	return refiners;
};

Search.prototype.query = function(queryText, queryOptions) {
	var self = this;
	var optionsQueryString = queryOptions != null ? "&" + queryString.objectToQueryString(queryOptions, true) : "";

	var url = "/search/query?querytext='" + queryText + "'" + optionsQueryString;
	return self._dao.get(url).then(utils.validateODataV2).then(function(resp) {
		if (resp.query) {
			return new SearchResults(resp.query);
		}
		throw new Error("Invalid response back from search service");
	});
};

Search.prototype.people = function(queryText, queryOptions) {
	var options = queryOptions || {};
	options.sourceid = 'b09a7990-05ea-4af9-81ef-edfab16c4e31';
	return this.query(queryText, options);
};


module.exports = Search;