import { h, Component } from 'preact';
import style from './style';
import { get } from '../../lib/trello';

export default class Board extends Component {
	
	async handleSubmit(e) {
		
		e.preventDefault();
		
		let since = document.getElementById('report-since').value;
		let res = await get(`/boards/${boardId}/lists`, {
			cards: 'open',
			card_fields: 'all',
			filter: 'open',
			fields: 'name'
		});
		let json = await res.json();
		let results = json || [];
		console.log('results', results.map((l) => {
			l.cards = l.cards.map((c) => {
				c.actions = get(`/cards/${c.id}/actions`, { since, limit: 1000 });
			});
			return l;
		}));
		this.setState({ results });
	}
	
	render(props, { results=[] }) {
		
		return (
			<div class={style.home}>
				<form class={style.form} onSubmit={this.handleSubmit}>
					<input id="report-since" type="date" />
					<button>Generate</button>
				</form>
			</div>
			
		);
	}
}

// 
// const Board = ({ board }) => (
// 	<div class="board">
// 		<h1>{board.name}</h1>
// 	</div>
// );