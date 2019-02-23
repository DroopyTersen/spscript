export declare type CustomActionScope = "Web" | "Site";
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
export declare var metadata: {
    __metadata: {
        "type": string;
    };
};
export declare var scopes: {
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
