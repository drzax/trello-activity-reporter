import { h, Component } from 'preact';
import style from './style';
import { get } from '../../lib/trello';
import ReactMarkdown from 'react-markdown';

export default class Card extends Component {
	state = {
		actions: []
	};

	getActions(cardId, since) {
		return get(`/cards/${cardId}/actions`, {
			limit: 1000,
			since
		})
			.then(res => res.json())
			.then(cards => cards || []);
	}

	componentWillMount() {
		this.getActions(this.props.card.id, this.props.since).then(actions =>
			this.setState({ actions })
		);
	}

	componentWillReceiveProps(nextProps) {
		this.getActions(nextProps.card.id, nextProps.since).then(actions =>
			this.setState({ actions })
		);
	}

	render({ card }, { actions }) {
		return (
			<div class={style.profile}>
				<h3>{card.name}</h3>

				<ul class="card">
					{actions.map(action => {
						switch (action.type) {
							case 'createCard':
								return;
							case 'updateCard':
								return <UpdateCard action={action} />;
							default:
								return <Action action={action} />;
						}
					})}
				</ul>
			</div>
		);
	}
}

const UpdateCard = ({ action }) => {
	console.log('action', action);
	if (action.data.old.hasOwnProperty('desc')) {
		// console.log('action', action);
		return (
			<li>
				<ReactMarkdown source={action.data.card.desc} />
			</li>
		);
	}
};

const Action = ({ action }) => (
	<li>
		<ReactMarkdown source={action.data.text} />
	</li>
);
