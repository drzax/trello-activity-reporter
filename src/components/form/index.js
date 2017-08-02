import { h, Component } from 'preact';
import style from './style';

export default class Form extends Component {
	render() {
		return (
			<form class={style.form}>
				<input type="date" />
				<button>Generate</button>
			</form>
		);
	}
}
