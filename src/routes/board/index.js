import { h, Component } from 'preact';
import style from './style';
import { get } from '../../lib/trello';
import List from '../../components/list';
import moment from 'moment';

export default class Board extends Component {
	state = {
		time: moment(),
		date: moment().subtract(1, 'month'),
		count: 10
	};

	// gets called when this route is navigated to
	async componentDidMount() {
		// start a timer for the clock:
		this.timer = setInterval(this.updateTime, 1000);
		
		let res = await get(`/boards/${this.props.id}`, {
			lists: 'open'
		});
		
		let json = await res.json();
		this.setState({ board: json || {} });
	}

	// gets called just before navigating away from the route
	componentWillUnmount() {
		clearInterval(this.timer);
	}

	// update the current time
	updateTime = () => {
		this.setState({ time: moment() });
	};

	increment = () => {
		this.setState({ count: this.state.count+1 });
	};
	
	
	// Note: `user` comes from the URL, courtesy of our router
	render({ id }, { time, count, date, board=null }) {
		
		return board ? (
			
			<div class={style.profile}>
			
				<h1>{board.name}</h1>
				
				<form class={style.form} onSubmit={this.handleSubmit}>
					<input id="report-since" max={time.format('YYYY-MM-DD')} value={date.format('YYYY-MM-DD')} type="date" />
					<button>Generate</button>
				</form>
				
				<p>This is the user profile for a board with id { id }.</p>
				
				<div class="list">
					{ board.lists.map( list => (
						<List list={list} />
					)) }
				</div>
				
			</div>
		) : '';
	}
}
