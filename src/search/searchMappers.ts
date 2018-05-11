import { QueryOptions, Refiner, SearchResultResponse } from "./ISearch";

export var mapResponse = function(rawResponse:any) : SearchResultResponse {
    return {
        elapsedTime: rawResponse.ElapsedTime,
        suggestion: rawResponse.SpellingSuggestion,
        resultsCount: rawResponse.PrimaryQueryResult.RelevantResults.RowCount,
        totalResults: rawResponse.PrimaryQueryResult.RelevantResults.TotalRows,
        totalResultsIncludingDuplicates: rawResponse.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates,
        items: mapItems(rawResponse.PrimaryQueryResult.RelevantResults.Table.Rows.results),
        refiners: mapRefiners(rawResponse.PrimaryQueryResult.RefinementResults)
    }
};

export var mapRefiners = function(refinementResults) {
	var refiners = [];

	if (refinementResults && refinementResults.Refiners && refinementResults.Refiners.results) {
		refiners = refinementResults.Refiners.results.map(r => {
			return {
				RefinerName: r.Name,
				RefinerOptions: r.Entries.results
			};
		});
	}
	return refiners;
};

export var mapItems = function(itemRows:any[]): any[] {
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