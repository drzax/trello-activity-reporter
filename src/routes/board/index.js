import { h, Component } from 'preact';
import style from './style.scss';
import { get } from '../../lib/trello';
import List from '../../components/list';
import ReactMarkdown from 'react-markdown';
import { Card, CardTitle, CardMedia, CardText } from 'react-toolbox/lib/card';
import { Chip } from 'react-toolbox/lib/chip';
import Label from '../../components/Label';
import moment from 'moment';
import pluralize from 'pluralize';
import {
	cardsWithActionSince,
	cardsWithoutActionSince,
	actionsForCard
} from '../../lib/utils';

export default class Board extends Component {
	state = {
		since:
			localStorage.getItem('reportBoardChangesSince') ||
			moment()
				.subtract(1, 'month')
				.format('YYYY-MM-DD')
	};

	handleDateChange = e => {
		let since = moment(e.target.value).format('YYYY-MM-DD');
		localStorage.setItem('reportBoardChangesSince', since);
		this.setState({ since });
	};

	componentWillMount() {
		get(`/boards/${this.props.id}`, {
			actions: 'all',
			actions_entities: 'true',
			actions_limit: 1000,
			actions_since: this.state.since,
			action_memberCreator_fields: 'fullName',
			cards: 'all',
			card_attachments: 'cover',
			card_modifiedSince: `${this.state.since}T17:02:24.030Z`,
			lists: 'open'
		})
			.then(res => res.json())
			.then(board => this.setState({ board }));

		get(`/boards/${this.props.id}`, {
			cards: 'open',
			card_members: true
		})
			.then(res => res.json())
			.then(({ cards }) => {
				this.setState({
					cardsWithoutActions: cardsWithoutActionSince(cards, this.state.since)
				});
			});
	}

	render(_, { today, since, board, cardsWithoutActions }) {
		if (!board || !cardsWithoutActions) return <p>Loading...</p>;

		const { actions, lists, cards } = board;

		const closeActions = actions.filter(
			action => action.data.old && action.data.old.closed === false
		);

		const cardsWithActions = cardsWithActionSince(cards, since);
		console.log('cardsWithoutActions', cardsWithoutActions);

		const [
			openCardsWithActions,
			closedCardsWithActions
		] = cardsWithActions.reduce(
			(acc, card) =>
				card.closed ? [acc[0], [...acc[1], card]] : [[...acc[0], card], acc[1]],
			[[], []]
		);

		console.log('openCardsWithActions', openCardsWithActions);
		console.log('closedCardsWithActions', closedCardsWithActions);

		return (
			<div class={style.board}>
				<header>
					<p class="overline">Activity report for</p>
					<h1>{board.name}</h1>
					<p>
						There are currently <strong>{cards.length} open tasks</strong>.
					</p>
					<p>
						Since <strong>{moment(since).format('MMMM D')}</strong> there{' '}
						{pluralize('has', closeActions.length + actions.length)} been{' '}
						<strong>
							{closeActions.length} {pluralize('task', closeActions.length)}{' '}
							finalised
						</strong>{' '}
						and{' '}
						<strong>
							{actions.length} {pluralize('update', actions.length)}
						</strong>{' '}
						recorded.
					</p>
				</header>
				<p class={style.since}>
					Show activity since:{' '}
					<input
						class={style.date}
						id="report-since"
						max={moment().format('YYYY-MM-DD')}
						value={since}
						type="date"
						onChange={this.handleDateChange}
					/>
				</p>

				<h2>Finalised Tasks ({closeActions.length})</h2>

				<Tasks cards={closedCardsWithActions} lists={lists} actions={actions} />

				<h2>Open Tasks ({cards.length})</h2>
				<Tasks cards={openCardsWithActions} lists={lists} actions={actions} />

				<p>Insert open tasks without any progress here</p>
			</div>
		);
	}
}

function Tasks({ cards, lists, actions }) {
	return (
		<div
			class={style.cardsWithActions}
			style={{
				display: 'grid',
				gridAutoFlow: 'dense',
				gridColumnGap: '1rem'
			}}
		>
			{cards.map(card => (
				<Task
					card={card}
					list={lists.find(list => list.id === card.idList)}
					actions={actionsForCard(actions, card)}
				/>
			))}
		</div>
	);
}

function Task({ card, actions, list }) {
	return (
		<div
			style={{
				display: 'contents'
			}}
		>
			<h3 style={{ gridColumn: '1/3' }}>{card.name}</h3>
			<Summary card={card} list={list} />
			<Actions card={card} actions={actions} />
		</div>
	);
}

function Action({ meta, text }) {
	return (
		<li>
			<ReactMarkdown source={text} />
			<p class={style.actionMeta}>{meta}</p>
		</li>
	);
}

function Actions({ card, actions }) {
	return (
		<ul class={style.actionsList} style={{ gridColumn: '1/2' }}>
			{actions
				.slice()
				.reverse()
				.map(action => {
					let meta, text;
					const formattedDate = moment(action.date).format('D MMMM, YYYY');
					switch (action.type) {
						case 'updateCard':
						case 'addAttachmentToCard':
							text = action.entities
								.filter(e => !!e.text)
								.map(e => {
									switch (e.type) {
										case 'card':
											return 'this task';
										case 'list':
											return `**${e.text}**`;
										case 'attachment':
											return `[${e.text}](${e.url})`;
										default:
											return e.text;
									}
								})
								.join(' ');
							meta = `${formattedDate}`;
							break;
						case 'createCard':
							text = `Task created by **${action.memberCreator.fullName}**`;
							meta = `${formattedDate}`;
							break;
						case 'commentCard':
							meta = `${action.memberCreator.fullName} | ${formattedDate}`;
							text = action.data.text;
					}
					return <Action meta={meta} text={text} />;
				})}
		</ul>
	);
}

function Summary({ card, list }) {
	const attachment = card.idAttachmentCover
		? card.attachments.find(a => a.id === card.idAttachmentCover)
		: null;

	return (
		<div
			style={{
				gridColumn: '2/3',
				marginBottom: '1rem',
				borderRadius: '2px',
				boxShadow: '0px 2px 4px #ccc'
			}}
			class={style.summary}
		>
			<header style={{ margin: '20px' }}>
				<p class="overline" style={{ marginTop: 0 }}>
					Summary
				</p>
			</header>
			{attachment ? (
				<img
					src={attachment.previews[0].url}
					sizes="350w"
					srcset={attachment.previews
						.map(p => `${p.url} ${p.width}w`)
						.join(',')}
					style={{ width: 350, height: 'auto' }}
				/>
			) : null}
			<div
				style={{
					margin: '20px',
					color: card.desc.length ? 'inherit' : '#ccc'
				}}
			>
				<ReactMarkdown
					source={card.desc.length ? card.desc : '*No detail available.*'}
				/>
			</div>
			<section style={{ margin: '20px' }}>
				<p class="overline" style={{ marginTop: 0 }}>
					Status
				</p>
				<Label text={list.name} />
				{card.labels.map(label => (
					<Label text={label.name} key={label.id} color={label.color} />
				))}
			</section>
		</div>
	);
}
