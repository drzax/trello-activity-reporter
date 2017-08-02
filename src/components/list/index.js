import { h, Component } from 'preact';
import style from './style';
import { get } from '../../lib/trello';
import Card from '../card';

export default class List extends Component {
	
	// gets called when this route is navigated to
	async componentDidMount() {
		
		console.log('this.props', this.props);
		
		let res = await get(`/lists/${this.props.list.id}`, {
			cards: 'open'
		});
		
		let json = await res.json();
		this.setState({ list: json || {} });
	}

	render({ id }, { list=null }) {
		
		return list ? (
			
			<div class={style.profile}>
			
				<h2>{list.name}</h2>
				
				<div class="list">
					{ list.cards.map( card => (
						<Card card={card} />
					)) }
				</div>
				
			</div>
		) : '';
	}
}

