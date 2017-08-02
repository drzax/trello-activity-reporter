import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Header from './header';
import Home from '../routes/home';
import Board from '../routes/board';
import { authorize } from '../lib/trello';

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
	
	// constructor(...args) {
	// 	super(...args);
	// 	authorize('ac39b3228640dbb060b760e17b59b4ed')
	// 		.then(token => this.setState({ token }), err => this.setState({ err }));
	// }
	
	componentDidMount() {
		authorize('ac39b3228640dbb060b760e17b59b4ed')
			.then(token => {
				this.setState({ token });
			}, err => {
				this.setState({ err });
			});
	}
	
	render(props, state) {
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
