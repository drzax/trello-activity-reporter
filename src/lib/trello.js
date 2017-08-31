const authEndpoint = 'https://trello.com';
const apiEndpoint = 'https://api.trello.com';
const version = '1';
const w = window;
let key;

export { authorize, get, setKey };

function setKey(k) {
	key = k;
}

function authorize(k) {
	if (k) setKey(k);

	return new Promise((resolve, reject) => {
		if (window.localStorage.trelloToken) {
			return resolve(window.localStorage.trelloToken);
		}

		let authUrl = `${authEndpoint}/${version}/authorize?response_type=token&key=${key}&return_url=${encodeURIComponent(
			w.location.href
		)}&callback_method=postMessage&scope=read%2Cwrite&expiration=never&name=Torbreck%20Reports`;
		let name = 'trello';
		let config = `width=420,height=470,left=${w.screenX +
			(w.innerWidth - 420) / 2},top=${w.screenY + (w.innerHeight - 470) / 2}`;
		let popup = w.open(authUrl, name, config);
		let listener = msg => {
			// Check this message is from trello
			if (msg.origin === authEndpoint && msg.source === popup) {
				w.removeEventListener('message', listener);
				msg.source.close();
				if (msg.data && /[0-9a-f]{64}/.test(msg.data)) {
					w.localStorage.trelloToken = msg.data;
					return resolve(msg.data);
				}

				reject(new Error('Unexpected message from Trello'));
			}
		};

		w.addEventListener('message', listener);
	});
}

function get(path, params = {}) {
	const token = window.localStorage.trelloToken;
	params.token = token;
	params.key = key;
	const url = `${apiEndpoint}/${version}${path}?${toQueryString(params)}`;
	return fetch(url, { method: 'GET' });
}

function toQueryString(obj) {
	return Object.keys(obj)
		.map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
		.join('&');
}
