import { h, Component } from 'preact';
import style from './style';
import { get } from '../../lib/trello';
import { List, ListItem } from 'react-toolbox/lib/list';

export default class Home extends Component {
	componentDidMount() {
		get(`/member/me/boards`, {
			organization: true,
			filter: 'open',
			organization_fields: 'all'
		})
			.then(res => res.json())
			.then(boards => boards)
			.then(boards => this.setState({ boards }));
	}

	render({}, { boards = [] }) {
		return (
			<List selectable ripple>
				{boards.map(board => (
					<ListItem
						className={style.listItem}
						id={board.id}
						caption={board.name}
						legend={
							board.organization ? board.organization.displayName : 'Private'
						}
						to={`/board/${board.id}`}
					/>
				))}
			</List>
		);
	}
}

function loadBoard() {
	window.location = `/board/${this.id}`;
}
