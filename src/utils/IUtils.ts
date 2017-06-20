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
        fromObj(obj: any, quoteValues?: boolean): string
    }
    isBrowser(): boolean,
    headers: HeaderUtils,
    /** Wait for script dependencies to load. You can pass in namespaced paths like 'SP.Taxonomy'*/
    waitForLibraries(namespaces: string[]): Promise<any>
    /** Wait for a script dependency. You can pass in namespaced paths like 'SP.Taxonomy'*/
    waitForLibrary(namespace: string): Promise<any>
    /** Safely check a nested namespaces exists on the Global */
    validateNamespace(namespace: string): boolean
    /** Wait/Ensure for an element to exist on a page */
    waitForElement(selector:string, timeout?:number) : Promise<any>
    /** Load a javascript file onto your page */
    loadScript(url: string): Promise<any>,
    /** Simultaneously load javascript files onto your page */
    loadScripts(urls: string[]): Promise<any>
    /** Load a CSS stylesheet onto your page */
    loadCSS(url: string): void
    /** Turn an HTML5 File object into an array buffer */
    getArrayBuffer(file:File)
    /** Launch a SharePoint modal */
    openModal(url:string, modalOptions?:any)
}