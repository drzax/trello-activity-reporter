import { h, Component } from 'preact';
import style from './style';
import { get } from '../../lib/trello';
import List from '../../components/list';
import moment from 'moment';

export default class Board extends Component {
	
	state = {
		today: moment().format('YYYY-MM-DD'),
		since: localStorage.getItem('reportBoardChangesSince') || moment().subtract(1, 'month').format('YYYY-MM-DD'),
		board: null
	}
	
	handleDateChange = (e) => {
		let since = moment(e.target.value).format('YYYY-MM-DD');
		localStorage.setItem('reportBoardChangesSince', since);
		this.setState({ since });
	}
	
	async componentWillMount() {
		
		let res = await get(`/boards/${this.props.id}`, {
			lists: 'open'
		});
		
		let json = await res.json();
		this.setState({ board: json || null });
	}

	render(_, { today, since, board }) {
		// console.log('date', date);
		return board ? (
			
			<div class={style.board}>
			
				<h1>{board.name}</h1>
				
				<p class={style.since}>Show activity since: <input class={style.date} id="report-since" max={today} value={since} type="date" onChange={this.handleDateChange} /></p>
				
				<div class="list">
					{ board.lists.map( list => (
						<List list={list} since={since} />
					)) }
				</div>
				
			</div>
		) : '';
	}
}
