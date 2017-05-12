'use strict';

var queryString = require('./queryString');
var utils = require('./utils');

/**
 * Allows you to perform queries agains the SP Search Service. You shouldn't ever be new'ing this class up up yourself, instead you'll get it from your dao as shown in first example.
 * @class
 * @param {IBaseDao} dao - Data access object used to make requests.
 * @example <caption>You access this Search class using the 'search' property of the dao</caption>
 * var dao = new SPScript.RestDao(_spPageContextInfo.webAbsoluteUrl);
 * dao.search.query('andrew').then(function(result) { console.log(result.items) });
 */
var Search = function Search(dao) {
  this._dao = dao;
};

/**
 * Represents the response sent back from the Search Service after a query
 * @typedef {Object} QueryOptions
 * @property {string} sourceid - Special id that allows filter of types
 * @property {int} startrow - 
 * @property {int} rowlimit - How many items to bring back
 * @property {Array<string>} selectedproperties - An array of the property names to bring back
 * @property {Array<string>} refiners - An array of the refiners to bring back
 * @property {?} hiddenconstraints - 
 * @property {?} sortlist - 
 */
Search.QueryOptions = function () {
  this.sourceid = null;
  this.startrow = null;
  this.rowlimit = 30;
  this.selectedproperties = null;
  this.refiners = null;
  this.refinementfilters = null;
  this.hiddenconstraints = null;
  this.sortlist = null;
};

var convertRowsToObjects = function convertRowsToObjects(itemRows) {
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

/**
 * Represents the response sent back from the Search Service after a query
 * @typedef {Object} SearchResults
 * @property {string} elapsedTime - How long the query took
 * @property {object} suggestion - Spelling suggestion
 * @property {int} resultsCount - Number of results in this batch
 * @property {int} totalResults - Total number of results that could be returned
 * @property {int} totalResultsIncludingDuplicates - Total number of results that could be returned including duplicates
 * @property {Array} items - An array of search result items.  Properties will depend of the item type.
 * @property {?Array<Refiner>} refiners - An array of refiners. Can be null.
 */
var SearchResults = function SearchResults(queryResponse) {
  this.elapsedTime = queryResponse.ElapsedTime;
  this.suggestion = queryResponse.SpellingSuggestion;
  this.resultsCount = queryResponse.PrimaryQueryResult.RelevantResults.RowCount;
  this.totalResults = queryResponse.PrimaryQueryResult.RelevantResults.TotalRows;
  this.totalResultsIncludingDuplicates = queryResponse.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates;
  this.items = convertRowsToObjects(queryResponse.PrimaryQueryResult.RelevantResults.Table.Rows.results);
  this.refiners = mapRefiners(queryResponse.PrimaryQueryResult.RefinementResults);
};

/**
 * Represents the response sent back from the Search Service after a query
 * @typedef {Object} Refiner
 * @property {string} RefinerName - How long the query took
 * @property {Array} RefinerOptions - An array of valid refiner values
 */

var mapRefiners = function mapRefiners(refinementResults) {
  var refiners = [];

  if (refinementResults && refinementResults.Refiners && refinementResults.Refiners.results) {
    refiners = refinementResults.Refiners.results.map(function (r) {
      return {
        RefinerName: r.Name,
        RefinerOptions: r.Entries.results
      };
    });
  }
  return refiners;
};

/**
 * Performs a query using the search service
 * @param {string} queryText - The query text to send to the Search Service
 * @param {QueryOptions} [[queryOptions]] - Override the default query options
 * @returns {Promise<SearchResults>} - A Promise that resolves to a SearchResults object
 * @example
 * dao.search.query('audit').then(function(result) { console.log(result.items) });
 */
Search.prototype.query = function (queryText, queryOptions) {
  var optionsQueryString = queryOptions != null ? "&" + queryString.fromObj(queryOptions, true) : "";

  var url = "/search/query?querytext='" + queryText + "'" + optionsQueryString;
  return this._dao.get(url).then(utils.validateODataV2).then(function (resp) {
    if (resp.query) {
      return new SearchResults(resp.query);
    }
    throw new Error("Invalid response back from search service");
  });
};

/**
 * Performs a query using the search service
 * @param {string} queryText - The query text to send to the Search Service
 * @param {QueryOptions} [[queryOptions]] - Override the default query options
 * @returns {Promise<SearchResults>} - A Promise that resolves to a SearchResults object
 * @example
 * dao.search.people('andrew').then(function(result) { console.log(result.items) });
 */
Search.prototype.people = function (queryText, queryOptions) {
  var options = queryOptions || {};
  options.sourceid = 'b09a7990-05ea-4af9-81ef-edfab16c4e31';
  return this.query(queryText, options);
};

/**
 * Performs a query for just sites using the search service
 * @param {string} queryText - The query text to send to the Search Service
 * @param {string} [[scope]] - A url to scope the results to
 * @param {QueryOptions} [[queryOptions]] - Override the default query options
 * @returns {Promise<SearchResults>} - A Promise that resolves to a SearchResults object
 * @example
 * dao.search.sites('andrew').then(function(result) { console.log(result.items) });
 */
Search.prototype.sites = function (queryText, scope) {
  var queryOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  queryText = queryText || "";
  scope = scope ? 'Path:' + scope + '*' : "";
  var query = (queryText + ' contentclass:STS_Web ' + scope).trim();
  queryOptions.rowlimit = queryOptions.rowlimit || 499;
  return this.query(query, queryOptions);
};

module.exports = Search;
//# sourceMappingURL=search.js.map