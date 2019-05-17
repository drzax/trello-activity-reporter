import styles from './index.scss';

export default function Label({ text, color = '#444' }) {
	return (
		<span style={{ backgroundColor: color }} class={styles.label}>
			{text}
		</span>
	);
}
