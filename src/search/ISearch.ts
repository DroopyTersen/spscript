export interface QueryOptions {
  sourceid?: string;
  startrow?: number;
  rowlimit?: number;
  selectproperties?: string[];
  refiners?: string[];
  refinementfilters?: string[];
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
