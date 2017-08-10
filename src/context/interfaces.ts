export interface RequestOptions {
	url?: string;
	method?: string;
	headers?: any;
	data?: string;
	async?: boolean;
}

export interface ContextOptions {
	clientSecret?: string;
	clientId?: string;
	requester?: (options: RequestOptions) => Promise<any>;
}
