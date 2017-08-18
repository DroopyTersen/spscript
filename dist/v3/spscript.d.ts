declare namespace spscript {
	import SPScript from "./SPScript";

	import SPScript from "./SPScript";

	import { Utils } from "./utils/IUtils";
	import Context from "./context/Context";
	import { CSRUtils } from "./csr";
	import { ContextOptions } from "./context/interfaces";
	export interface SPScript {
		/** Utility functions*/
		utils: Utils;
		/** Creates an SPScript data context. If no url is passed, it uses current web. */
		createContext(url?: string, options?: ContextOptions): Context;
		/** Helper functions for creating REST Api HTTP headers. */
		CSR: CSRUtils;
	}
	var spscript: SPScript;
	export default spscript;

	import { ContextOptions } from "./interfaces";
	import List from "../List/List";
	import Web from "../web/Web";
	import Search from "../search/Search";
	import CustomActions from "../customActions/CustomActions";
	import Profiles from "../profiles/Profiles";
	export default class Context {
		/** The url of the SPScript data context */
		webUrl: string;
		/** Methods to hit the SP Search Service */
		search: Search;
		/** Methods against the SP Web object */
		web: Web;
		/** Methods to get the SP Profile Service */
		profiles: Profiles;
		/** Work with Site/Web scoped Custom Actions */
		customActions: CustomActions;
		private request;
		private clientId;
		private clientSecret;
		private ensureToken;
		private accessToken;
		constructor(url: string, options?: ContextOptions);
		private executeRequest(url, opts);
		/** Make a 'GET' request to the '<site>/_api' relative url. */
		get(url: string, opts?: RequestInit): Promise<any>;
		/** Make a 'POST' request to the '<site>/_api' relative url. */
		post(url: string, body?: any, opts?: RequestInit): Promise<any>;
		/** Make a 'POST' request to the '<site>/_api' relative url. SPScript will handle authorizing the request for you.*/
		authorizedPost(url: string, body?: any, verb?: string): Promise<any>;
		_ensureRequestDigest(digest?: string): Promise<string>;
		/** Get a Request Digest token to authorize a request */
		getRequestDigest(): Promise<string>;
		/** Get an SPScript List instance */
		lists(name: string): List;
		private _packagePostBody(body, opts);
	}

	export interface ContextOptions {
		clientSecret?: string;
		clientId?: string;
	}

	var request: any;
	export default request;

	export var getAppOnlyToken: (
		url: string,
		clientId: string,
		clientSecret: string
	) => Promise<any>;

	export interface RequestOptions {
		url?: string;
		method?: string;
		headers?: any;
		data?: string;
		async?: boolean;
	}
	var xhr: any;
	export default xhr;

	export type CSRLocation = "View" | "NewForm" | "DisplayForm" | "EditForm";
	export interface FieldComponent {
		/** Internal Name of the field to override */
		name: string;
		/** Array of locations. "View" | "NewForm" | "DisplayForm" | "EditForm" */
		locations?: CSRLocation[];
		/** Function that should return an HTML string */
		render(ctx: any): any;
		/** Optional function used to set the field value */
		getValue?(): any;
		/** Function that is invoked when the field has been rendered. Useful for init'ing jQuery plugins */
		onReady?(): any;
		setValue?(value: any): any;
	}
	export interface CSRUtils {
		registerDisplayField(field: FieldComponent, opts?: any): any;
		registerFormField(field: FieldComponent, opts?: any): any;
	}
	var CSR: CSRUtils;
	export default CSR;

	import Context from "../context/Context";
	import { CustomAction } from "./ICustomActions";
	export default class CustomActions {
		private _dao;
		constructor(ctx: Context);
		private getScope(scopeId);
		/** Returns both Site and Web custom actions. */
		get(): Promise<any>;
		/** Searches both Site and Web scoped custom actions for a name match */
		get(name: string): Promise<any>;
		/** Gets the API url of a specific Custom Action */
		private _getUrl(name);
		private _getUrlAndDigest(name);
		/** Update an existing Custom Action. You must pass a custom action with a 'Name' property */
		update(updates: CustomAction): Promise<any>;
		/** Remove an existing Custom Action. Searches both Site and Web scoped */
		remove(name: string): Promise<any>;
		/** Adds a new custom action. If the custom action name already exists, it will be deleted first */
		add(customAction: CustomAction): Promise<any>;
		private addScriptBlock(name, block, opts?);
		/** Injects a CSS file onto your site. Defaults to Site scoped */
		addCSSLink(name: string, url: string, opts?: CustomAction): Promise<any>;
		addScriptLink(name: string, url: string, opts?: CustomAction): Promise<any>;
	}

	export type CustomActionScope = "Web" | "Site";
	export interface CustomAction {
		Name?: string;
		/** Defaults to match Name */
		Title?: string;
		/** Defaults to match Name */
		Description?: string;
		/** Defaults to match Name */
		Group?: string;
		/** Defaults to to 100 */
		Sequence?: number;
		Scope?: any;
		/** Defaults to to 'ScriptLink' */
		Location?: string;
		ScriptBlock?: string;
	}
	export var metadata: {
		__metadata: {
			"type": string;
		};
	};
	export var scopes: {
		"Web": {
			id: number;
			name: string;
			url: string;
		};
		"Site": {
			id: number;
			name: string;
			url: string;
		};
	};

	import Context from "../context/Context";
	import Securable from "../permissions/Securable";
	export default class List {
		/** The title of the list */
		listName: string;
		private baseUrl;
		private _dao;
		permissions: Securable;
		constructor(name: string, ctx: Context);
		/** Get items from the list. Will return all items if no OData is passed. */
		getItems(odata?: string): Promise<any>;
		/** Get a specific item by SharePoint ID */
		getItemById(id: number, odata?: string): Promise<any>;
		/** Gets the items returned by the specified View name */
		getItemsByView(viewName: string): Promise<any>;
		/** Gets you all items whose field(key) matches the value. Currently only text and number columns are supported. */
		findItems(key: string, value: any, odata?: string): Promise<any>;
		/** Get the item whose field(key) matches the value. If multiple matches are found, the first is returned. Currently only text and number columns are supported. */
		findItem(key: string, value: any, odata: any): Promise<any>;
		/** Get all the properties of the List */
		getInfo(): Promise<any>;
		/** Insert a List Item */
		addItem(item: any, digest?: string): Promise<any>;
		/** Takes a SharePoint Id, and updates that item ONLY with properties that are found in the passed in updates object. */
		updateItem(itemId: number, updates: any, digest?: string): Promise<any>;
		/** deletes the item with the specified SharePoint Id */
		deleteItem(itemId: number, digest?: string): Promise<any>;
	}

	export interface BasePermission {
		name: string;
		low: number;
		high: number;
	}
	export interface RoleMember {
		login: string;
		name: string;
		id: string;
	}
	export interface RoleDef {
		/** Role definition name */
		name: string;
		description: string;
		/** An array of base permission names */
		basePermissions: string[];
	}
	export interface RoleAssignment {
		/** User or Group */
		member: RoleMember;
		/** An array of role definitions */
		roles: RoleDef[];
	}
	export var basePermissions: BasePermission[];

	import Context from "../context/Context";
	import { RoleAssignment } from "./IPermissions";
	/** Allows you to check the permissions of a securable (list or site) */
	export default class Securable {
		private _dao;
		private baseUrl;
		constructor(baseUrl: string, ctx: Context);
		/** Gets all the role assignments on that securable  */
		getRoleAssignments(): Promise<RoleAssignment[]>;
		private checkPrivs(user);
		/** Gets all the role assignments on that securable. If you don't pass an email, it will use the current user. */
		check(email?: string): Promise<string[]>;
	}

	import Context from "../context/Context";
	export default class Profiles {
		private _dao;
		private baseUrl;
		constructor(ctx: Context);
		/** Gets the profile of the current user.  */
		current(): Promise<any>;
		/** Gets the current user's profile */
		get(): Promise<any>;
		/** Gets the profile of the passed in email name. */
		get(email: string): Promise<any>;
		/** Gets the profile of the passed in user object (AccountName or LoginName) must be set */
		get(user: any): Promise<any>;
		private getUserObj(user?);
		/** Sets a profile property on the current user */
		setProperty(key: string, value: any): Promise<any>;
		/** Sets a profile property on the specified email */
		setProperty(key: string, value: any, email: string): Promise<any>;
		/** Sets a profile property on the specified User object (needs AccountName or LoginName property) */
		setProperty(key: string, value: any, userObj: any): Promise<any>;
	}

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
		/** The actual search results that you care about */
		items: any[];
		refiners?: Refiner[];
	}

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
		sites(
			queryText?: string,
			urlScope?: string,
			queryOptions?: QueryOptions
		): Promise<SearchResultResponse>;
	}

	import { SearchResultResponse } from "./ISearch";
	export var mapResponse: (rawResponse: any) => SearchResultResponse;
	export var mapRefiners: (refinementResults: any) => any[];
	export var mapItems: (itemRows: any[]) => any[];

	export var validateNamespace: (namespace: any) => boolean;
	export var waitForLibraries: (namespaces: any) => Promise<{}>;
	export var waitForLibrary: (namespace: any) => Promise<{}>;
	export var waitForElement: (selector: any, timeout?: number) => Promise<{}>;

	export interface HeaderUtils {
		/** returns a Headers object with 'Accept', 'Content-Type' and optional 'X-RequestDigest' */
		getStandardHeaders(digest?: string): any;
		/** returns a Headers object with values configured for binary stream*/
		getFilestreamHeaders(digest: string): any;
		/** returns a Headers object with values configured ADDING an item */
		getAddHeaders(digest?: string): any;
		/** returns a Headers object with values configured UPDATING an item */
		getUpdateHeaders(digest?: string, etag?: string): any;
		/** returns a Headers object with values configured DELETING an item */
		getDeleteHeaders(digest?: string, etag?: string): any;
		getActionHeaders(verb: string, digest?: string): any;
	}
	var headerUtils: HeaderUtils;
	export default headerUtils;

	import { Utils } from "./IUtils";
	var utils: Utils;
	export default utils;

	import { HeaderUtils } from "./headers";
	export interface Utils {
		/** Wraps JSON.parse in a try/catch */
		parseJSON(jsonStr: any): any;
		/** Helps parse raw ODATA response to remove data.d/data.d.results namespace. */
		validateODataV2(data: any): any;
		/** Query String helpers */
		qs: {
			/** Turns a string in form of "key1=value1&key2=value2..." into an Object */
			toObj(string?): any;
			/** Turns a an Object into a string in form of "key1=value1&key2=value2..." */
			fromObj(obj: any, quoteValues?: boolean): string;
		};
		isBrowser(): boolean;
		headers: HeaderUtils;
		/** Wait for script dependencies to load. You can pass in namespaced paths like 'SP.Taxonomy'*/
		waitForLibraries(namespaces: string[]): Promise<any>;
		/** Wait for a script dependency. You can pass in namespaced paths like 'SP.Taxonomy'*/
		waitForLibrary(namespace: string): Promise<any>;
		/** Safely check a nested namespaces exists on the Global */
		validateNamespace(namespace: string): boolean;
		/** Wait/Ensure for an element to exist on a page */
		waitForElement(selector: string, timeout?: number): Promise<any>;
		/** Load a javascript file onto your page */
		loadScript(url: string): Promise<any>;
		/** Simultaneously load javascript files onto your page */
		loadScripts(urls: string[]): Promise<any>;
		/** Load a CSS stylesheet onto your page */
		loadCSS(url: string): void;
		/** Turn an HTML5 File object into an array buffer */
		getArrayBuffer(file: File): any;
		/** Launch a SharePoint modal */
		openModal(url: string, modalOptions?: any): any;
	}

	export var loadCSS: (url: string) => void;
	export var loadScript: (url: any) => Promise<{}>;
	export var loadScripts: (urls: any) => Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;

	export function fromObj(obj: any, quoteValues?: boolean): string;
	export function toObj(str?: string): any;

	import Context from "../context/Context";
	import Securable from "../permissions/Securable";
	export default class Web {
		private baseUrl;
		private _dao;
		permissions: Securable;
		constructor(ctx: Context);
		/** Retrieves basic information about the site */
		getInfo(): Promise<any>;
		/** Retrieves all of the subsites */
		getSubsites(): Promise<any[]>;
		/** Retrieves the current user */
		getUser(): Promise<any>;
		/** Retrieves a users object based on an email address */
		getUser(email: string): Promise<any>;
		ensureUser(login: string): Promise<any>;
		/** Retrieves a file by server relative url */
		getFile(url: string): Promise<any>;
		private _copyFile(sourceUrl, destinationUrl, digest);
		/** Copies a file from one server relative url to another */
		copyFile(sourceUrl: string, destinationUrl: string, digest?: string): Promise<any>;
	}
}
