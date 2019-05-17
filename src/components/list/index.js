import { h } from 'preact';
import style from './style';
import Card from '../card';
import { cardsWithActionSince, cardsWithoutActionSince } from '../../lib/utils';

export default function List({ since, list, cards, actions }) {
	const noActions = cardsWithoutActionSince(cards, since);
	const withActions = cardsWithActionSince(cards, since);

	return (
		<div class={style.list}>
			<h2>{list.name}</h2>

			{withActions.length ? (
				<WithActions actions={actions} cards={withActions} />
			) : null}
			{noActions.length ? <NoActions cards={noActions} /> : null}
		</div>
	);
}

function WithActions({ cards, actions }) {
	return (
		<div class="list">
			{cards.map(card => (
				<Card
					card={card}
					actions={actions.filter(
						a => a.data.card && a.data.card.id === card.id
					)}
				/>
			))}
		</div>
	);
}

function NoActions({ cards }) {
	return (
		<div class={style.noUpdates}>
			<p>There have been no updates on the following items:</p>
			<ul>
				{cards.map(card => (
					<li>{card.name}</li>
				))}
			</ul>
		</div>
	);
}
