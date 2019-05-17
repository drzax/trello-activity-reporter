import { isBefore, isAfter } from 'date-fns';

export const cardsWithoutActionSince = (cards, since) =>
	cards.filter(card =>
		isBefore(new Date(card.dateLastActivity), new Date(since))
	);

export const cardsWithActionSince = (cards, since) =>
	cards.filter(card =>
		isAfter(new Date(card.dateLastActivity), new Date(since))
	);

export const actionsForCard = (actions, card) =>
	actions.filter(a => a.data.card && a.data.card.id === card.id);

export const getListById = (lists, id) => lists.find(list => list.id === id);
