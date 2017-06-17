export interface RequestOptions {
    url?: string;
    method?: string;
    headers?: any;
    data?: string;
    async?: boolean;
}
declare var request: (options: RequestOptions) => Promise<any>;
export default request;
