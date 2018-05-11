export type CustomActionScope = "Web" | "Site";

export interface CustomAction {
    Name?:string,
    /** Defaults to match Name */
    Title?:string,
    /** Defaults to match Name */
    Description?:string,
    /** Defaults to match Name */
    Group?:string,
    /** Defaults to to 100 */
    Sequence?:number,
    Scope?:any,
    /** Defaults to to 'ScriptLink' */
    Location?:string,
    ScriptBlock?:string
}

export var metadata = {
	__metadata: {
		"type": "SP.UserCustomAction"
	}
};

export var scopes = {
    "Web": {
        id: 3,
        name: "Web",
        url: "/web/usercustomactions"
    },
    "Site": {
        id: 2,
        name: "Site",
        url: "/site/usercustomactions"
    }
};