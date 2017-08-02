import { h, Component } from 'preact';
import style from './style';
// import Board from '../../components/board';
import { get } from '../../lib/trello';

const boardId = 'YWI5A1pW'; // Torbreck
// const boardId = 'dhNhDMER'; // ABC


export default class Home extends Component {
	
	async componentDidMount() {
		let res = await get(`/member/me/boards`);
		let json = await res.json();
		let results = json || [];
		this.setState({ results });
	}
	
	render({ }, { results=[] }) {
		return (
			<div>
				<h1>Boards</h1>
				<div class="list">
					{ results.map( result => (
						<Result result={result} />
					)) }
				</div>
			</div>
		);
	}
}

const Result = ({ result }) => (
	<div style={{
		padding: 10,
		margin: 10,
		background: 'white',
		boxShadow: '0 1px 5px rgba(0,0,0,0.5)'
	}}>
		<div>
			<a href={'/board/' + result.id}>
				{result.name}
			</a>
		</div>
		<p>{result.description}</p>
	</div>
);
