import Context from "../context/Context";
import { QueryOptions, SearchResultResponse } from "./ISearch";
export default class Search {
    private _dao;
    constructor(ctx: Context);
    readonly defaultQueryOptions: QueryOptions;
    query(queryText: string, queryOptions?: QueryOptions): Promise<SearchResultResponse>;
    people(queryText: string, queryOptions?: QueryOptions): Promise<SearchResultResponse>;
    sites(queryText?: string, urlScope?: string, queryOptions?: QueryOptions): Promise<SearchResultResponse>;
}
