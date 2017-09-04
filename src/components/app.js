import { h, Component } from 'preact';
import { Router } from 'preact-router';
import './app.scss';
import { Helmet } from 'react-helmet';
import { Layout, Panel } from 'react-toolbox/lib/layout';
import { AppBar } from 'react-toolbox/lib/app_bar';
import { Avatar } from 'react-toolbox/lib/avatar';
import { Button } from 'react-toolbox/lib/button';
import { get } from '../lib/trello';

// import Header from './header';
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
		get('/member/me')
			.then(res => res.json())
			.then(member =>
				this.setState({
					avatar: `https://trello-avatars.s3.amazonaws.com/${member.avatarHash}/170.png`
				})
			);
	}

	handleLogout() {
		this.setState({
			token: null
		});
		localStorage.removeItem('trelloToken');
	}

	constructor() {
		super();
		this.handleToken = this.handleToken.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
	}

	componentWillMount() {
		this.handleToken(window.localStorage.trelloToken);
	}

	render(props, { token, avatar }) {
		if (!token) return <Login handleToken={this.handleToken} />;

		return (
			<Layout>
				<Helmet
					link={[
						{
							href:
								'https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i',
							rel: 'stylesheet'
						},
						{
							href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
							rel: 'stylesheet'
						}
					]}
				/>
				<Panel>
					<AppBar title={'Activity Reporter'} fixed>
						<Button
							icon="exit_to_app"
							inverse
							label="Logout"
							onMouseUp={this.handleLogout}
						/>
						<Avatar icon="face" image={avatar} />
					</AppBar>
					<Router onChange={this.handleRoute}>
						<Home path="/" />
						<Board path="/board/:id" />
					</Router>
				</Panel>
			</Layout>
		);
	}
}
