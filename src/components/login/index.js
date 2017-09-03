import { h, Component } from 'preact';
import { authorize, setKey } from '../../lib/trello';

const style = require('./style.css');

setKey('ac39b3228640dbb060b760e17b59b4ed');

// import Home from 'async!./home';
// import Profile from 'async!./profile';

export default class Login extends Component {
	state = {
		title: 'Activity Reporter',
		intro: `Activity reporter provides an easy way to generate printable reports of activity on a Trello board since a specified date.`
	};

	handleAuth(e) {
		e.preventDefault();

		authorize().then(
			token => {
				this.props.handleToken(token);
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

	render(props, state) {
		let error = this.state.err ? (
			<p className={style.error}>{`Login unsuccessful. Please try again.`}</p>
		) : (
			''
		);

		return (
			<div className={style.login}>
				<h1 className={style.title}>{state.title}</h1>
				<div className={style.card}>
					<p>{state.intro}</p>
					<button
						className={style.button}
						href="#"
						onClick={this.handleAuth}
					>{`Login with Trello`}</button>
					{error}
				</div>
			</div>
		);
	}
}
