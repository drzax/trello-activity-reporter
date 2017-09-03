import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Login from './login';
import Home from '../routes/home';
import Board from '../routes/board';

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

	handleToken(token) {
		this.setState({ token });
	}

	constructor() {
		super();
		this.handleToken = this.handleToken.bind(this);
	}

	componentWillMount() {
		this.setState({
			token: window.localStorage.trelloToken
		});
	}

	render(props, state) {
		if (!state.token) return <Login handleToken={this.handleToken} />;

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
