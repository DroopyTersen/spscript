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
    private getUserObj;
    /** Sets a profile property on the current user */
    setProperty(key: string, value: any): Promise<any>;
    /** Sets a profile property on the specified email */
    setProperty(key: string, value: any, email: string): Promise<any>;
    /** Sets a profile property on the specified User object (needs AccountName or LoginName property) */
    setProperty(key: string, value: any, userObj: any): Promise<any>;
}
