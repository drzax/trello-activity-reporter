import { h, Component } from 'preact';
import style from './style';
import { get } from '../../lib/trello';
import Card from '../card';

export default class List extends Component {
	state = {
		cards: []
	};

	componentWillMount() {
		get(`/lists/${this.props.list.id}`, {
			cards: 'open'
		})
			.then(res => res.json())
			.then(list => list.cards || [])
			.then(cards => this.setState({ cards }));
	}

	render({ since, list }, { cards }) {
		return (
			<div class={style.list}>
				<h2>{list.name}</h2>

				<div class="list">
					{cards.map(card => <Card card={card} since={since} />)}
				</div>
			</div>
		);
	}
}
