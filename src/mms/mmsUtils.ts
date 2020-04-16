import { createContext } from "..";
import Context from "../context/Context";

export interface MMSTerm {
  id: string;
  sortOrder: number;
  description: string;
  name: string;
  path: string;
  termSetName: string;
  properties: {
    [key: string]: string;
  };
  children: MMSTerm[];
}

export interface MMSTermTree extends MMSTerm {
  flatTerms: MMSTerm[];
  getTermByName(termName: string): MMSTerm;
  getTermById(termGuid: string): MMSTerm;
  getTermByPath(path: string): MMSTerm;
}

export const toTermTree = function (flatTerms: MMSTerm[]) {
  try {
    let tree = _toTermTree(flatTerms);

    let termTree: MMSTermTree = {
      flatTerms,
      ...tree,
      getTermById(termGuid: string) {
        return findInTree(tree, (term) => term.id === termGuid);
      },
      getTermByName(termName: string) {
        // console.log("getTermByName -> tree", tree);
        return findInTree(tree, (term) => term.name === termName);
      },
      getTermByPath(path: string) {
        let targetPath = normalizeSlashes(path.toLowerCase());
        // console.log("GETBYPATH", path, this.children);
        return findInTree(tree, (term) => term.path.toLowerCase() === targetPath);
      },
    };
    return termTree;
  } catch (err) {
    console.log("ERROR!!!! parsing term groupd", err);
    return null;
  }
};

export const getTermSet = async (
  termGroupName: string,
  termSetName: string,
  ctx: Context
): Promise<MMSTerm[]> => {
  // Create a flat array of parent termsets, and then each result of terms
  let flatTerms = await _getTermsetTerms(termGroupName, termSetName, ctx);
  // console.log("TCL: flatTerms", flatTerms);

  return sortByPath(flatTerms);
};

const _toTermTree = function (flatTerms: MMSTerm[]): MMSTerm {
  let sortedTerms = sortByPath(flatTerms);
  // console.log("TCL: groupByPath -> sortedTerms", sortedTerms);

  // Requires a presort by path
  // Assumes the path parts match the 'name' property
  let result = sortedTerms.reduce((results, term) => {
    let pathParts = term.path.split("/");
    let scope = results;
    // console.log("_toTermTree -> pathParts", pathParts);
    pathParts.forEach((key) => {
      let match = scope.find((t) => t.name === key);
      if (!match) {
        scope.push(term);
        scope = term.children;
      } else {
        // console.log("_toTermTree -> match", key, match);
        scope = match.children;
      }
    });
    return results;
  }, []);
  // console.log("TCL: result", result);
  return result.length === 1 ? result[0] : result;
};

const sortByPath = (terms: MMSTerm[]) => {
  return terms.sort((a, b) => {
    if (a.path === b.path) return 0;
    return a.path < b.path ? -1 : 1;
  });
};
const findInTree = function (term: MMSTerm, findFn: (term: MMSTerm) => boolean) {
  if (findFn(term)) return term;
  // console.log("term.name", term);
  // console.log("term.children.length", term.children.length);
  for (let i = 0; i < term.children.length; i++) {
    let childMatch = findInTree(term.children[i], findFn);
    if (childMatch) return childMatch;
  }
  return null;
};

const processTerm = function (term: TermData, termSetName: string): MMSTerm {
  return {
    id: cleanGuid(term.Id),
    sortOrder: term.CustomSortOrder || 9999,
    children: [],
    description: term.Description,
    name: term.Name.replace(/\//g, "|"),
    path: (termSetName + ";" + term.PathOfTerm).replace(/\//g, "|").split(";").join("/"),
    properties: {
      ...term.CustomProperties,
      ...term.LocalCustomProperties,
    },
    termSetName,
  };
};

function cleanGuid(guid: string): string {
  return guid ? guid.replace("/Guid(", "").replace("/", "").replace(")", "") : "";
}

const normalizeSlashes = function (str: string) {
  try {
    if (!str) return "";
    if (str[0] === "/") {
      str = str.substring(1);
    }
    if (str[str.length - 1] === "/") {
      str = str.substring(0, str.length - 1);
    }

    return str;
  } catch (err) {
    return "";
  }
};

const _getTermsetTerms = async (
  termGroup: string,
  termset: string,
  ctx: Context
): Promise<MMSTerm[]> => {
  let digest = await ctx.auth.getRequestDigest();
  var url = `${ctx.webUrl}/_vti_bin/client.svc/ProcessQuery?`;
  let headers = {
    ...ctx.headers,
    "content-type": "text/xml",
    "x-requestdigest": digest,
  };
  let data = await fetch(url, {
    method: "POST",
    body: getRequestXml(termGroup, termset),
    headers,
  }).then((resp) => resp.json());
  // console.log("_getTermsetTerms data", data);

  let tc: TermCollectionData = data.find((d) => d._ObjectType_ === "SP.Taxonomy.TermCollection");
  if (tc && tc._Child_Items_) {
    return [
      createTermFromTermsetName(termset),
      ...tc._Child_Items_.map((t) => processTerm(t, termset)),
    ];
  }
  return [];
};

const createTermFromTermsetName = (termset: string): MMSTerm => {
  return {
    id: "root",
    sortOrder: 1,
    children: [],
    description: termset,
    name: termset,
    path: termset,
    properties: {},
    termSetName: termset,
  };
};
interface TermCollectionData {
  _Child_Items_: TermData[];
}
interface TermData {
  Id: string;
  CustomSortOrder: number;
  Description: string;
  Name: string;
  PathOfTerm: string;
  LocalCustomProperties: any;
  CustomProperties: any;
}

const getRequestXml = (termGroup: string, termset: string) => {
  return `<Request xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009" SchemaVersion="15.0.0.0" LibraryVersion="16.0.0.0" ApplicationName="PnPjs">
  <Actions>
      <Query Id="1" ObjectPathId="6">
          <Query SelectAllProperties="true">
              <Properties />
          </Query >
          <ChildItemQuery SelectAllProperties="false">
              <Properties>
                  <Property Name="Id" SelectAll="true" />
                  <Property Name="CustomSortOrder" SelectAll="true" />
                  <Property Name="Description" SelectAll="true" />
                  <Property Name="Name" SelectAll="true" />
                  <Property Name="PathOfTerm" SelectAll="true" />
                  <Property Name="LocalCustomProperties" SelectAll="true" />
                  <Property Name="CustomProperties" SelectAll="true" />
              </Properties>
          </ChildItemQuery >
      </Query >
  </Actions>
  <ObjectPaths>
      <StaticMethod Id="0" Name="GetTaxonomySession" TypeId="{981cbc68-9edc-4f8d-872f-71146fcbb84f}" />
      
      <Method Id="1" ParentId="0" Name="GetDefaultSiteCollectionTermStore"></Method>
      <Property Id="2" ParentId="1" Name="Groups" />
      <Method Id="3" ParentId="2" Name="GetByName">
          <Parameters>
              <Parameter Type="String">${termGroup}</Parameter>
          </Parameters>
      </Method>
      <Property Id="4" ParentId="3" Name="TermSets" />
      <Method Id="5" ParentId="4" Name="GetByName">
          <Parameters>
              <Parameter Type="String">${termset}</Parameter>
          </Parameters>
      </Method>
      <Method Id="6" ParentId="5" Name="GetAllTerms"></Method>
  </ObjectPaths>
</Request>`;
};
