import Context from "../context/Context";
import { CustomAction } from "./ICustomActions";
export default class CustomActions {
    private _dao;
    constructor(ctx: Context);
    private getScope;
    /** Returns both Site and Web custom actions. */
    get(): Promise<any>;
    /** Searches both Site and Web scoped custom actions for a name match */
    get(name: string): Promise<any>;
    /** Gets the API url of a specific Custom Action */
    private _getUrl;
    private _getUrlAndDigest;
    /** Update an existing Custom Action. You must pass a custom action with a 'Name' property */
    update(updates: CustomAction): Promise<any>;
    /** Remove an existing Custom Action. Searches both Site and Web scoped */
    remove(name: string): Promise<any>;
    /** Adds a new custom action. If the custom action name already exists, it will be deleted first */
    add(customAction: CustomAction): Promise<any>;
    private addScriptBlock;
    /** Injects a CSS file onto your site. Defaults to Site scoped */
    addCSSLink(name: string, url: string, opts?: CustomAction): Promise<any>;
    addScriptLink(name: string, url: string, opts?: CustomAction): Promise<any>;
}
