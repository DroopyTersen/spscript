import Context from "../context/Context";
import { QueryOptions, SearchResultResponse } from "./ISearch";
export default class Search {
    private _dao;
    constructor(ctx: Context);
    /** get default/empty QueryOptions */
    readonly defaultQueryOptions: QueryOptions;
    /** Query the SP Search Service */
    query(queryText: string, queryOptions?: QueryOptions): Promise<SearchResultResponse>;
    /** Query for only People results */
    people(queryText: string, queryOptions?: QueryOptions): Promise<SearchResultResponse>;
    /** Query for only sites (STS_Web). Optionally pass in a url scope. */
    sites(queryText?: string, urlScope?: string, queryOptions?: QueryOptions): Promise<SearchResultResponse>;
}
