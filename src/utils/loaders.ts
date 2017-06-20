export var loadCSS = function(url:string) {
	var link = document.createElement("link");
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("type", "text/css");
	link.setAttribute("href", url);
	document.querySelector("head").appendChild(link);    
};

export var loadScript = function(url) {
	return new Promise((resolve, reject) => {
		var scriptTag : any = window.document.createElement("script");
		var firstScriptTag = document.getElementsByTagName('script')[0];
		scriptTag.async = true;
		firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);

		scriptTag.onload = scriptTag.onreadystatechange = function(arg, isAbort) {
			// if its been aborted, readyState is gone, or readyState is in a 'done' status
			if(isAbort || !scriptTag.readyState || /loaded|complete/.test(scriptTag.readyState)) {
				//clean up
				scriptTag.onload = scriptTag.onreadystatechange = null;
				scriptTag = undefined;

				// resolve/reject the promise
				if (!isAbort) resolve();
				else reject;
			}
		}
		scriptTag.src = url;
	});   
}

export var loadScripts = function(urls) {
    return Promise.all(urls.map(loadScript));
}