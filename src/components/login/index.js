import { h, Component } from 'preact';
import { authorize, setKey } from '../../lib/trello';
import { Dialog } from 'react-toolbox/lib/dialog';

setKey('ac39b3228640dbb060b760e17b59b4ed');

// import Home from 'async!./home';
// import Profile from 'async!./profile';

export default class Login extends Component {
	state = {
		title: 'Activity Reporter',
		intro: `Activity Reporter provides an easy way to generate printable reports of activity on a Trello board.`
	};

	handleAuth(e) {
		e.preventDefault();

		authorize().then(
			token => {
				this.props.handleToken(token);
			},
			err => {
				this.setState({ err, intro: 'Login unsuccessful. Please try again.' });
			}
		);
	}

	constructor() {
		super();
		this.handleAuth = this.handleAuth.bind(this);
	}

	render(props, { err, title, intro }) {
		return (
			<Dialog
				active
				actions={[{ label: 'Login with Trello', onClick: this.handleAuth }]}
				title={title}
			>
				{intro}
			</Dialog>
		);
	}
}
