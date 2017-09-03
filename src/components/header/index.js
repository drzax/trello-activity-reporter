import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

export default class Header extends Component {
	render() {
		let { boardName } = this.props;
		let board = boardName ? `: ${boardName}` : '';

		return (
			<header class={style.header}>
				<h1>Activity Reporter{board}</h1>
				<nav>
					<Link activeClassName={style.active} href="/">
						Boards
					</Link>
				</nav>
			</header>
		);
	}
}
