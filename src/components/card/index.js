import { h, Component } from 'preact';
import style from './style';
import { get } from '../../lib/trello';

export default class Card extends Component {
	
	// gets called when this route is navigated to
	async componentDidMount() {
		
		// console.log('this.props', this.props);
		
		let res = await get(`/cards/${this.props.card.id}`, {
			actions: 'all'
		});
		
		let json = await res.json();
		this.setState({ card: json || {} });
	}

	render(props, { card=null }) {
		
		return card ? (
			
			<div class={style.profile}>
			
				<h3>{props.card.name}</h3>
				
				<ul class="card">
					{ card.actions.map( action => {
						switch (action.type) {
							case 'createCard':
								return;
							case 'updateCard':
								return <UpdateCard action={action} />;
							default:
								return <Action action={action} />;
						}
					}) }
				</ul>
				
			</div>
		) : '';
	}
}

const UpdateCard = ({ action }) => {
	
	if (action.data.old.hasOwnProperty('desc')) {
		console.log('action', action);
		return <li>Boom: {action.data.card.desc}</li>;
	}
};

const Action = ({ action }) => (
	<li>{action.data.text}</li>
);
