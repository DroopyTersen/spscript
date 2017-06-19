"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const searchMappers_1 = require("./searchMappers");
class Search {
    constructor(ctx) {
        this._dao = ctx;
    }
    ;
    get defaultQueryOptions() {
        return {
            sourceid: null,
            startrow: null,
            rowlimit: 100,
            selectedproperties: null,
            refiners: null,
            refinementfilters: null,
            hiddencontstraints: null,
            sortlist: null
        };
    }
    ;
    query(queryText, queryOptions) {
        console.log(utils_1.default);
        var optionsQueryString = queryOptions ? "&" + utils_1.default.qs.fromObj(queryOptions, true) : "";
        var url = `/search/query?querytext='${queryText}'${optionsQueryString}`;
        return this._dao.get(url)
            .then(utils_1.default.validateODataV2)
            .then(resp => {
            if (resp.query)
                return searchMappers_1.mapResponse(resp.query);
            throw new Error("Invalid response back from search service");
        });
    }
    ;
    people(queryText, queryOptions = {}) {
        queryOptions.sourceid = 'b09a7990-05ea-4af9-81ef-edfab16c4e31';
        return this.query(queryText, queryOptions);
    }
    ;
    sites(queryText = "", urlScope = "", queryOptions = {}) {
        urlScope = urlScope ? `Path:${urlScope}*` : "";
        var query = (`${queryText} contentclass:STS_Web ${urlScope}`).trim();
        queryOptions.rowlimit = queryOptions.rowlimit || 499;
        return this.query(query, queryOptions);
    }
    ;
}
exports.default = Search;
//# sourceMappingURL=Search.js.map