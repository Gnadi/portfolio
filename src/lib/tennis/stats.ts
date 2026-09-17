/**
 * The stat sheet a match leaves behind.
 *
 * These are the lines a broadcast puts up at the changeover and the ATP
 * publishes afterwards — first serve in, points won behind each serve, break
 * points, winners against unforced errors — kept per side and counted as the
 * point is played rather than worked out at the end.
 */
import type { Side } from './court';

export interface SideStats {
	points: number;
	aces: number;
	doubleFaults: number;
	/** Service points played, and how many of them started with a first serve in. */
	serves: number;
	firstIn: number;
	firstWon: number;
	secondPlayed: number;
	secondWon: number;
	/** Break points this player served through, and how many held. */
	faced: number;
	saved: number;
	winners: number;
	errors: number;
	/** The quickest serve that landed, in km/h. */
	fastest: number;
}

export interface MatchStats {
	player: SideStats;
	cpu: SideStats;
	/** Shots in the longest point of the match. */
	longest: number;
}

const blank = (): SideStats => ({
	points: 0,
	aces: 0,
	doubleFaults: 0,
	serves: 0,
	firstIn: 0,
	firstWon: 0,
	secondPlayed: 0,
	secondWon: 0,
	faced: 0,
	saved: 0,
	winners: 0,
	errors: 0,
	fastest: 0,
});

export const freshStats = (): MatchStats => ({ player: blank(), cpu: blank(), longest: 0 });

/** A percentage as a scoreboard writes it, with the raw pair behind it. */
function ratio(made: number, of: number) {
	if (!of) return '—';
	return `${Math.round((made / of) * 100)}% (${made}/${of})`;
}

export interface StatRow {
	label: { en: string; de: string };
	player: string;
	cpu: string;
	/** The two figures behind the text, for marking whichever side leads. */
	share: [number, number];
	/** Whether leading this row means more of it, or less. */
	better?: 'more' | 'fewer';
}

/**
 * The sheet, in the order a match summary reads: what the serve did, what the
 * return did, and then what the rallies cost.
 */
export function summarise(stats: MatchStats): StatRow[] {
	const pair = (read: (side: SideStats) => number): [number, number] => [
		read(stats.player),
		read(stats.cpu),
	];
	const plain = (read: (side: SideStats) => number) => {
		const [a, b] = pair(read);
		return { player: String(a), cpu: String(b), share: [a, b] as [number, number] };
	};
	const percent = (made: (s: SideStats) => number, of: (s: SideStats) => number) => {
		const share = ([s.player, s.cpu] as SideStats[]).map((side) =>
			of(side) ? made(side) / of(side) : 0
		) as [number, number];
		return {
			player: ratio(made(stats.player), of(stats.player)),
			cpu: ratio(made(stats.cpu), of(stats.cpu)),
			share,
		};
	};
	const s = stats;

	return [
		{ label: { en: 'Aces', de: 'Asse' }, ...plain((side) => side.aces) },
		{
			label: { en: 'Double faults', de: 'Doppelfehler' },
			...plain((side) => side.doubleFaults),
			better: 'fewer',
		},
		{
			label: { en: 'First serve in', de: 'Erster Aufschlag drin' },
			...percent(
				(side) => side.firstIn,
				(side) => side.serves
			),
		},
		{
			label: { en: 'First-serve points won', de: 'Punkte nach erstem Aufschlag' },
			...percent(
				(side) => side.firstWon,
				(side) => side.firstIn
			),
		},
		{
			label: { en: 'Second-serve points won', de: 'Punkte nach zweitem Aufschlag' },
			...percent(
				(side) => side.secondWon,
				(side) => side.secondPlayed
			),
		},
		{
			label: { en: 'Break points saved', de: 'Breakbälle abgewehrt' },
			...percent(
				(side) => side.saved,
				(side) => side.faced
			),
		},
		{
			label: { en: 'Break points converted', de: 'Breakbälle verwandelt' },
			player: ratio(s.cpu.faced - s.cpu.saved, s.cpu.faced),
			cpu: ratio(s.player.faced - s.player.saved, s.player.faced),
			share: [
				s.cpu.faced ? (s.cpu.faced - s.cpu.saved) / s.cpu.faced : 0,
				s.player.faced ? (s.player.faced - s.player.saved) / s.player.faced : 0,
			],
		},
		{ label: { en: 'Winners', de: 'Winner' }, ...plain((side) => side.winners) },
		{
			label: { en: 'Unforced errors', de: 'Unerzwungene Fehler' },
			...plain((side) => side.errors),
			better: 'fewer',
		},
		{
			label: { en: 'Fastest serve', de: 'Schnellster Aufschlag' },
			player: s.player.fastest ? `${s.player.fastest} km/h` : '—',
			cpu: s.cpu.fastest ? `${s.cpu.fastest} km/h` : '—',
			share: [s.player.fastest, s.cpu.fastest],
		},
		{ label: { en: 'Total points won', de: 'Punkte insgesamt' }, ...plain((side) => side.points) },
	];
}

/**
 * The one line the winner's card has room for: three numbers that say how the
 * match was won, picked in the order a commentator would reach for them.
 */
export function cardLine(stats: MatchStats, side: Side, lang: 'en' | 'de') {
	const me = stats[side];
	const parts: string[] = [];

	if (me.aces) parts.push(lang === 'de' ? `${me.aces} Asse` : `${me.aces} aces`);
	if (me.serves) {
		const percent = Math.round((me.firstIn / me.serves) * 100);
		parts.push(
			lang === 'de' ? `${percent}% erster Aufschlag` : `${percent}% first serve`
		);
	}
	if (me.winners) parts.push(lang === 'de' ? `${me.winners} Winner` : `${me.winners} winners`);
	if (stats.longest > 3) {
		parts.push(
			lang === 'de'
				? `längster Ballwechsel ${stats.longest} Schläge`
				: `longest rally ${stats.longest} shots`
		);
	}

	return parts.slice(0, 3).join(' · ');
}
