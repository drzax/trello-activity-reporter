import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Home from '../routes/home';
import Board from '../routes/board';
import { authorize, setKey } from '../lib/trello';

setKey('ac39b3228640dbb060b760e17b59b4ed');

// import Home from 'async!./home';
// import Profile from 'async!./profile';

export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	handleAuth(e) {
		e.preventDefault();

		authorize().then(
			token => {
				this.setState({ token });
			},
			err => {
				this.setState({ err });
			}
		);
	}

	constructor() {
		super();
		this.handleAuth = this.handleAuth.bind(this);
	}

	componentWillMount() {
		this.setState({
			token: window.localStorage.trelloToken
		});
	}

	render(props, state) {
		if (!this.state.token) {
			return (
				<div id="app">
					<a href="#" onClick={this.handleAuth}>{`Login with Trello`}</a>
				</div>
			);
		}
		return (
			<div id="app">
				<Header />
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Board path="/board/:id" />
				</Router>
			</div>
		);
	}
}
