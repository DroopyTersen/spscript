export declare type CSRLocation = "View" | "NewForm" | "DisplayForm" | "EditForm";
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
declare var CSR: CSRUtils;
export default CSR;
