import Context from "./Context";
import { qs, parseOData } from "./utils";

export interface QueryOptions {
  sourceid?: string;
  startrow?: number;
  rowlimit?: number;
  selectproperties?: string;
  refiners?: string;
  refinementfilters?: string;
  hiddencontstraints?: any;
  sortlist?: any;
}

export interface Refiner {
  RefinerName: string;
  RefinerOptions: any[];
}

export interface SearchResultResponse {
  elapsedTime: string;
  suggestion: any;
  resultsCount: number;
  totalResults: number;
  totalResultsIncludingDuplicates: number;
  /** The actual search results that you care about */
  items: any[];
  refiners?: Refiner[];
}

export default class Search {
  private _dao: Context;

  constructor(ctx: Context) {
    this._dao = ctx;
  }

  /** get default/empty QueryOptions */
  get defaultQueryOptions(): QueryOptions {
    return {
      sourceid: null,
      startrow: null,
      rowlimit: 100,
      selectproperties: null,
      refiners: null,
      refinementfilters: null,
      hiddencontstraints: null,
      sortlist: null,
    };
  }

  /** Query the SP Search Service */
  query(queryTemplate: string, queryOptions: QueryOptions = {}): Promise<SearchResultResponse> {
    var optionsQueryString = qs.fromObj(queryOptions, true);
    console.log("Search -> optionsQueryString", optionsQueryString);
    var url = `/search/query?queryTemplate='${queryTemplate}'&${optionsQueryString}`;
    return this._dao
      .get(url)
      .then(parseOData)
      .then((resp) => {
        return mapResponse(resp);
      });
  }

  /** Query for only People results */
  people(queryText: string, queryOptions: QueryOptions = {}): Promise<SearchResultResponse> {
    queryOptions.sourceid = "b09a7990-05ea-4af9-81ef-edfab16c4e31";
    return this.query(queryText, queryOptions);
  }

  /** Query for only sites (STS_Web). Optionally pass in a url scope. */
  sites(
    queryText: string = "",
    urlScope: string = "",
    queryOptions: QueryOptions = {}
  ): Promise<SearchResultResponse> {
    urlScope = urlScope ? `Path:${urlScope}*` : "";
    var query = `${queryText} contentclass:STS_Web ${urlScope}`.trim();
    queryOptions.rowlimit = queryOptions.rowlimit || 499;
    return this.query(query, queryOptions);
  }
}

const mapResponse = function (rawResponse: any): SearchResultResponse {
  return {
    elapsedTime: rawResponse.ElapsedTime,
    suggestion: rawResponse.SpellingSuggestion,
    resultsCount: rawResponse.PrimaryQueryResult.RelevantResults.RowCount,
    totalResults: rawResponse.PrimaryQueryResult.RelevantResults.TotalRows,
    totalResultsIncludingDuplicates:
      rawResponse.PrimaryQueryResult.RelevantResults.TotalRowsIncludingDuplicates,
    items: mapItems(rawResponse.PrimaryQueryResult.RelevantResults.Table.Rows),
    refiners: mapRefiners(rawResponse.PrimaryQueryResult.RefinementResults),
  };
};

const mapRefiners = function (refinementResults) {
  var refiners = [];

  if (refinementResults && refinementResults.Refiners && refinementResults.Refiners) {
    refiners = refinementResults.Refiners.map((r) => {
      return {
        RefinerName: r.Name,
        RefinerOptions: r.Entries,
      };
    });
  }
  return refiners;
};

const mapItems = function (itemRows: any[]): any[] {
  var items = [];

  for (var i = 0; i < itemRows.length; i++) {
    var row = itemRows[i],
      item = {};
    for (var j = 0; j < row.Cells.length; j++) {
      item[row.Cells[j].Key] = row.Cells[j].Value;
    }

    items.push(item);
  }

  return items;
};
