export interface QueryOptions {
    sourceid?: string;
    startrow?: number;
    rowlimit?: number;
    selectedproperties?: string[];
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
    items: any[];
    refiners?: Refiner[];
}
