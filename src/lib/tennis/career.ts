/**
 * A career, rather than a high score.
 *
 * The match in the footer is played inside a draw: you enter the tournament
 * the site is currently wearing, at the round your ranking earns you, and
 * every match won is one round further in. Rounds pay ranking points, which
 * decide where you enter next time, and prize money, which is what the skill
 * tree is bought with — the same two currencies a real season runs on, and
 * the reason a player's team gets paid at all.
 *
 * The tree itself is the six things a coach would actually work on, and the
 * numbers on it are the ones the sport measures: serve and return ratings,
 * forehand spin in rpm, the choice between one hand and two, movement, and
 * the ATP's own "under pressure" category — break points saved, break points
 * converted, tie-breaks won.
 *
 * All of it lives in localStorage, next to the player's name. Nothing leaves
 * the browser, and `resetCareer` throws the lot away.
 */
import type { Hand } from './court';

export type BackhandStyle = 'two' | 'one';

/**
 * Which game is being played.
 *
 * `casual` is a match and nothing else: no draw, no ranking, no money and no
 * tree, which is what somebody who has come to hit a few balls in a footer
 * actually wants. `career` is everything below. The mode is the visitor's to
 * choose and it is the only thing standing between them and a point.
 */
export type Mode = 'casual' | 'career';
export type BranchId = 'serve' | 'return' | 'forehand' | 'backhand' | 'fitness' | 'pressure';

/** Copy that belongs to the data, in both languages the site speaks. */
interface Copy {
	en: string;
	de: string;
}

// ── The draw ──────────────────────────────────────────────────────────

/**
 * What each round is worth. A Grand Slam's ladder, in shape if not to the
 * euro: the points are the real ones, and the money climbs the way a major's
 * does — roughly doubling at the business end, with the champion taking
 * getting on for twice the finalist.
 */
export const ROUNDS = [
	{ id: 'q', points: 0, prize: 30_000, name: { en: 'Qualifying', de: 'Qualifikation' } },
	{ id: 'r1', points: 10, prize: 110_000, name: { en: 'First round', de: 'Erste Runde' } },
	{ id: 'r2', points: 50, prize: 160_000, name: { en: 'Second round', de: 'Zweite Runde' } },
	{ id: 'r3', points: 100, prize: 240_000, name: { en: 'Third round', de: 'Dritte Runde' } },
	{ id: 'r16', points: 200, prize: 380_000, name: { en: 'Round of 16', de: 'Achtelfinale' } },
	{ id: 'qf', points: 400, prize: 620_000, name: { en: 'Quarter-final', de: 'Viertelfinale' } },
	{ id: 'sf', points: 800, prize: 1_100_000, name: { en: 'Semi-final', de: 'Halbfinale' } },
	{ id: 'f', points: 1300, prize: 1_800_000, name: { en: 'Final', de: 'Finale' } },
	{ id: 'w', points: 2000, prize: 3_200_000, name: { en: 'Champion', de: 'Sieger' } },
] as const;

/** The last round anyone actually plays: winning it is the title. */
export const FINAL = ROUNDS.length - 2;
export const CHAMPION = ROUNDS.length - 1;

/**
 * Points to a world ranking. Deliberately a table and not a formula — the
 * real list is a table too, and what matters is that the first few hundred
 * points move you hundreds of places and the last few move you one.
 */
const LADDER: [points: number, rank: number][] = [
	[10, 1120],
	[50, 780],
	[120, 520],
	[250, 360],
	[450, 250],
	[800, 165],
	[1300, 115],
	[2000, 78],
	[3000, 52],
	[4500, 33],
	[6500, 20],
	[9000, 11],
	[12500, 6],
	[17000, 3],
	[22000, 1],
];

/** The world ranking `points` is worth, or null while still unranked. */
export function rankFor(points: number): number | null {
	let rank: number | null = null;
	for (const [needed, place] of LADDER) {
		if (points >= needed) rank = place;
	}
	return rank;
}

/** Inside the top 100 you are in the main draw; outside it, you qualify. */
export const entryRound = (points: number) => {
	const rank = rankFor(points);
	return rank !== null && rank <= 100 ? 1 : 0;
};

/** Top 32 are seeded, and the board says so. */
export const seedFor = (points: number) => {
	const rank = rankFor(points);
	return rank !== null && rank <= 32 ? rank : null;
};

/**
 * Who is on the other side of the net this round. One player — the site's
 * owner — but a draw gets harder the further into it you go, and this is how
 * much harder: by the final he covers the court almost as fast as you can,
 * serves like it, and has no wing left worth attacking.
 */
export interface Opponent {
	/** Px per second the racket can chase at. */
	speed: number;
	/** How quickly he gets back to the middle between shots. */
	recovery: number;
	/** Multiplier on the pace he puts back. */
	pace: number;
	/** Multiplier on his serve speed. */
	serve: number;
	/** How far into the box he dares to aim. */
	nerve: number;
	/** How much weaker the backhand is than the forehand, 0 to 1. */
	weakness: number;
}

export function opponentFor(round: number): Opponent {
	const t = Math.min(round, FINAL) / FINAL;
	return {
		speed: 372 + t * 236,
		recovery: 0.5 + t * 0.34,
		pace: 0.98 + t * 0.14,
		serve: 0.84 + t * 0.3,
		nerve: 0.42 + t * 0.46,
		weakness: 0.26 - t * 0.19,
	};
}

/**
 * The machine in a casual match.
 *
 * Nobody arrives at a footer easter egg wanting a fight. He covers less of
 * the court than any round of the draw does, gets back to the middle slowly,
 * serves softly and puts it near the middle of the box, and has a backhand
 * worth going after — which is also how somebody finds out that going after
 * it is the game. Losing the first one and winning the second is about
 * right; being beaten three times is not.
 */
export const CASUAL_OPPONENT: Opponent = {
	// Slow on his feet on purpose — it is what lets a rally end at this pace,
	// and what makes moving him the way to win. Everything else about him is
	// sharp enough to take the first game off somebody who has not worked out
	// yet which half of their racket is which.
	speed: 200,
	recovery: 0.44,
	pace: 1,
	serve: 0.9,
	nerve: 0.58,
	weakness: 0.24,
};

/**
 * How quickly the ball moves, and how hard a rally leans on it.
 *
 * The career is played at the pace the sport is: the ball ends up quicker
 * than a racket can cross the court, which is what finishes a long point. A
 * casual match is the same game at about two thirds of that, with a ceiling
 * low enough that the visitor is never beaten by sheer speed — only by not
 * watching the ball, which is a fair way to lose and an obvious one to fix.
 */
export interface Tempo {
	/** Multiplier on the serve's flight — and so on the number on the board. */
	serve: number;
	/** Multiplier on the pace a rally is actually played at. */
	rally: number;
	/** Multiplier on the quickest a rally ever gets. */
	ceiling: number;
	/** How much pace a long rally adds with each shot. */
	press: number;
	/**
	 * How far off the middle of the court a shot off the edge of the racket
	 * ends up. A slow game cannot be won by hitting through anybody, so a
	 * casual match is won by moving them instead: the angles open up, the
	 * corners become reachable, and wrong-footing the machine is what ends
	 * the point rather than out-hitting it.
	 */
	angle: number;
}

// The serve and the rally are separated because they are doing different
// jobs. A serve wants to look like a serve — it is the one number on the
// board, and 140 km/h reads better than 60 — while the rally after it is
// what the visitor actually has to play, and that wants to be slow enough
// to enjoy. Career plays both at full pace.
const CASUAL_TEMPO: Tempo = { serve: 0.72, rally: 0.45, ceiling: 0.5, press: 0.004, angle: 1.45 };
const CAREER_TEMPO: Tempo = { serve: 1, rally: 1, ceiling: 1, press: 0.004, angle: 1 };

export const tempoIn = (career: Career): Tempo =>
	career.mode === 'casual' ? CASUAL_TEMPO : CAREER_TEMPO;

/**
 * How long a match is, and how a game is closed out.
 *
 * A casual match is short on purpose: somebody who has just found this should
 * be able to lose one, work out what the two halves of the racket are for,
 * and win the next — all inside a few minutes. No-ad scoring is what does
 * most of that work, and it is a real format rather than a shortcut: at
 * forty-all the next point takes the game, the way it does in doubles and at
 * the Next Gen finals. A career keeps the full thing.
 */
export interface Rules {
	/** Games needed to win the match. */
	games: number;
	/** Whether forty-all is settled by the next point instead of by two clear. */
	noAd: boolean;
}

export const rulesIn = (career: Career): Rules =>
	career.mode === 'casual' ? { games: 3, noAd: true } : { games: 4, noAd: false };

// ── What a career is ──────────────────────────────────────────────────

export interface Career {
	/** Which of the two games is being played. */
	mode: Mode;
	/** Ranking points. Earned, never spent. */
	points: number;
	/** Prize money in hand, which is what the tree is bought with. */
	prize: number;
	/** Career prize money, for the board. */
	earned: number;
	/** The round about to be played. */
	round: number;
	/** Whether this tournament's entry money is already banked. */
	entered: boolean;
	/** Titles won. */
	titles: number;
	/** The furthest round ever reached. */
	best: number;
	/** Matches won, all told. */
	won: number;
	hand: Hand;
	/** Chosen once, and then it is your backhand for good. */
	backhand: BackhandStyle | null;
	/**
	 * The backhand a casual match is played with. Kept apart from the career's
	 * because it is not a commitment: with nothing riding on it, there is no
	 * reason not to let somebody try the other one.
	 */
	casualBackhand: BackhandStyle;
	unlocked: string[];
}

export function freshCareer(): Career {
	return {
		mode: 'casual',
		points: 0,
		prize: 0,
		earned: 0,
		round: 0,
		entered: false,
		titles: 0,
		best: 0,
		won: 0,
		hand: 'right',
		backhand: null,
		casualBackhand: 'two',
		unlocked: [],
	};
}

// ── The tree ──────────────────────────────────────────────────────────

/**
 * Every number the match reads off the tree. Nodes hand back the values they
 * set outright rather than adding to them, because a branch is climbed in
 * order: tier three replaces what tier two put there.
 */
export interface Ratings {
	serveSpeed: number;
	/** Extra room inside the service box before a serve is called out. */
	serveMargin: number;
	/** How much a second serve kicks off the court, 0 to 1. */
	secondServe: number;
	/** Pace on the first shot after your own serve. */
	servePlusOne: number;
	/** Px further into the court the return is taken. */
	returnStep: number;
	/** How much control a blocked return keeps. */
	returnBlock: number;
	/** Seconds of extra racket speed bought by a sliced return. */
	returnRush: number;
	returnPlusOne: number;
	forehandPace: number;
	/** Forehand topspin, in rpm. Tour average sits between 2,700 and 3,000. */
	forehandSpin: number;
	/** How far the forehand reaches into the backhand half, 0 to 1. */
	runAround: number;
	backhandPace: number;
	backhandAngle: number;
	backhandSlice: number;
	/** How well a ball above the shoulder is handled, 0 to 1. */
	backhandHigh: number;
	/** Px of racket added on the backhand side. */
	backhandReach: number;
	speed: number;
	stamina: number;
	recovery: number;
	/** Racket speed added while a break point is being faced. */
	pressureGuard: number;
	/** Pace added while a break point is being played for. */
	pressureBite: number;
	/** 0 break points only, 1 tie-breaks too, 2 match points as well. */
	pressureScope: number;
}

/** Where everyone starts: below the tour's average on every count. */
export const BASE: Ratings = {
	serveSpeed: 1,
	serveMargin: 0,
	secondServe: 0,
	servePlusOne: 1,
	returnStep: 0,
	returnBlock: 0,
	returnRush: 0,
	returnPlusOne: 1,
	forehandPace: 1,
	forehandSpin: 2400,
	runAround: 0,
	backhandPace: 1,
	backhandAngle: 1,
	backhandSlice: 1,
	backhandHigh: 0,
	backhandReach: 0,
	speed: 1,
	stamina: 100,
	recovery: 1,
	pressureGuard: 0,
	pressureBite: 0,
	pressureScope: 0,
};

/**
 * What a player is worth with no career behind them.
 *
 * A casual match has nothing to unlock, so these cannot come off a tree. They
 * are simply the numbers of somebody who can play: a serve with some margin
 * on it, a forehand around the tour's average spin, legs that last a match.
 * They sit about where a career reaches halfway up the draw, so a casual
 * match is a fair fight rather than a rehearsal for one.
 */
export function casualRatings(style: BackhandStyle): Ratings {
	return {
		...BASE,
		serveSpeed: 1.06,
		serveMargin: 0.14,
		secondServe: 0.55,
		servePlusOne: 1.06,
		returnStep: 8,
		returnBlock: 0.35,
		returnPlusOne: 1.06,
		forehandPace: 1.06,
		forehandSpin: 2850,
		runAround: 0.1,
		backhandPace: 1.05,
		backhandAngle: 1.08,
		backhandSlice: style === 'one' ? 1.3 : 1.05,
		backhandHigh: style === 'two' ? 0.65 : 0.2,
		backhandReach: style === 'one' ? 9 : 0,
		speed: 1.1,
		stamina: 130,
		recovery: 1.5,
		pressureGuard: 0.08,
		pressureBite: 0.08,
		pressureScope: 1,
	};
}

export interface SkillNode {
	id: string;
	branch: BranchId;
	/** 1 to 4. A tier can only be bought once the one below it is held. */
	tier: number;
	cost: number;
	name: Copy;
	note: Copy;
	/** Only offered to a player who plays this backhand. */
	style?: BackhandStyle;
	effect: Partial<Ratings>;
}

export const BRANCHES: { id: BranchId; name: Copy; note: Copy }[] = [
	{
		id: 'serve',
		name: { en: 'Serve', de: 'Aufschlag' },
		note: { en: 'The only ball nobody can take from you', de: 'Der einzige Ball, den dir keiner nimmt' },
	},
	{
		id: 'return',
		name: { en: 'Return', de: 'Return' },
		note: { en: 'The second half of the first four shots', de: 'Die zweite Hälfte der ersten vier Schläge' },
	},
	{
		id: 'forehand',
		name: { en: 'Forehand', de: 'Vorhand' },
		note: { en: 'Measured the way the tour measures it: in rpm', de: 'Gemessen, wie die Tour misst: in U/min' },
	},
	{
		id: 'backhand',
		name: { en: 'Backhand', de: 'Rückhand' },
		note: { en: 'One hand or two — pick once', de: 'Ein- oder beidhändig — einmalige Wahl' },
	},
	{
		id: 'fitness',
		name: { en: 'Movement & fitness', de: 'Bewegung & Fitness' },
		note: { en: 'Everything that happens before the shot', de: 'Alles, was vor dem Schlag passiert' },
	},
	{
		id: 'pressure',
		name: { en: 'Under pressure', de: 'Unter Druck' },
		note: { en: 'The ATP keeps a leaderboard for this', de: 'Dafür führt die ATP eine eigene Wertung' },
	},
];

const COST = [0, 80_000, 240_000, 560_000, 1_100_000];

export const SKILLS: SkillNode[] = [
	// ── Serve ──────────────────────────────────────────────────────────
	{
		id: 'serve-speed',
		branch: 'serve',
		tier: 1,
		cost: COST[1]!,
		name: { en: 'First-serve speed', de: 'Erster Aufschlag' },
		note: { en: 'Eight per cent more on the first ball.', de: 'Acht Prozent mehr auf dem ersten Ball.' },
		effect: { serveSpeed: 1.08 },
	},
	{
		id: 'serve-zones',
		branch: 'serve',
		tier: 2,
		cost: COST[2]!,
		name: { en: 'Ace zones', de: 'Ass-Zonen' },
		note: {
			en: 'More of the box to aim at before the line judge has a word.',
			de: 'Mehr Feld zum Zielen, bevor der Linienrichter etwas sagt.',
		},
		effect: { serveSpeed: 1.1, serveMargin: 0.18 },
	},
	{
		id: 'serve-kick',
		branch: 'serve',
		tier: 3,
		cost: COST[3]!,
		name: { en: 'Kick second serve', de: 'Kick-Aufschlag' },
		note: {
			en: 'The safest ball in tennis: slower over the net, and it jumps off the court.',
			de: 'Der sicherste Ball im Tennis: langsamer über das Netz, und er springt hoch ab.',
		},
		effect: { serveSpeed: 1.12, serveMargin: 0.24, secondServe: 0.8 },
	},
	{
		id: 'serve-plus-one',
		branch: 'serve',
		tier: 4,
		cost: COST[4]!,
		name: { en: 'Serve +1', de: 'Aufschlag +1' },
		note: {
			en: 'Seven points in ten end inside four shots. This is the second of them.',
			de: 'Sieben von zehn Punkten enden in vier Schlägen. Das hier ist der zweite davon.',
		},
		effect: { servePlusOne: 1.2 },
	},

	// ── Return ─────────────────────────────────────────────────────────
	{
		id: 'return-step',
		branch: 'return',
		tier: 1,
		cost: COST[1]!,
		name: { en: 'Return position', de: 'Return-Position' },
		note: { en: 'Stand in. Take the time away from him.', de: 'Reinstellen. Ihm die Zeit nehmen.' },
		effect: { returnStep: 9 },
	},
	{
		id: 'return-block',
		branch: 'return',
		tier: 2,
		cost: COST[2]!,
		name: { en: 'Block return', de: 'Block-Return' },
		note: {
			en: 'A short swing that puts the fastest serve back in the court.',
			de: 'Ein kurzer Schwung, der auch den schnellsten Aufschlag zurückbringt.',
		},
		effect: { returnStep: 13, returnBlock: 0.5 },
	},
	{
		id: 'return-rush',
		branch: 'return',
		tier: 3,
		cost: COST[3]!,
		name: { en: 'Chip and charge', de: 'Chip and Charge' },
		note: {
			en: 'Slice the return and follow it — the next two seconds at a dead run.',
			de: 'Den Return slicen und nachlaufen — die nächsten zwei Sekunden im vollen Lauf.',
		},
		effect: { returnStep: 16, returnBlock: 0.6, returnRush: 1.7 },
	},
	{
		id: 'return-plus-one',
		branch: 'return',
		tier: 4,
		cost: COST[4]!,
		name: { en: 'Return +1', de: 'Return +1' },
		note: {
			en: 'Win the short points on his serve and the match follows.',
			de: 'Gewinn die kurzen Punkte bei seinem Aufschlag — das Match kommt hinterher.',
		},
		effect: { returnPlusOne: 1.2 },
	},

	// ── Forehand ───────────────────────────────────────────────────────
	{
		id: 'fh-2700',
		branch: 'forehand',
		tier: 1,
		cost: COST[1]!,
		name: { en: '2,700 rpm', de: '2.700 U/min' },
		note: {
			en: 'Tour average. A ball with something on it, at last.',
			de: 'Tour-Durchschnitt. Endlich ein Ball mit etwas drauf.',
		},
		effect: { forehandSpin: 2700, forehandPace: 1.05 },
	},
	{
		id: 'fh-3000',
		branch: 'forehand',
		tier: 2,
		cost: COST[2]!,
		name: { en: '3,000 rpm', de: '3.000 U/min' },
		note: {
			en: 'The top of the tour’s range: heavier through the air, and it drops in.',
			de: 'Das obere Ende der Tour: schwerer durch die Luft, und er fällt rein.',
		},
		effect: { forehandSpin: 3000, forehandPace: 1.08 },
	},
	{
		id: 'fh-3200',
		branch: 'forehand',
		tier: 3,
		cost: COST[3]!,
		name: { en: '3,200 rpm', de: '3.200 U/min' },
		note: {
			en: 'Nadal’s average, peaks aside. The ball climbs off the court at the far end.',
			de: 'Nadals Schnitt, Spitzen ausgenommen. Am anderen Ende klettert der Ball vom Platz.',
		},
		effect: { forehandSpin: 3200, forehandPace: 1.11 },
	},
	{
		id: 'fh-inside-out',
		branch: 'forehand',
		tier: 4,
		cost: COST[4]!,
		name: { en: 'Inside-out forehand', de: 'Inside-Out-Vorhand' },
		note: {
			en: 'Run around the backhand and hit the best shot you own instead.',
			de: 'Um die Rückhand herumlaufen und stattdessen den besten Schlag spielen, den du hast.',
		},
		effect: { runAround: 0.32 },
	},

	// ── Backhand: two hands ────────────────────────────────────────────
	{
		id: 'bh-two-stability',
		branch: 'backhand',
		tier: 1,
		cost: COST[1]!,
		style: 'two',
		name: { en: 'Stability', de: 'Stabilität' },
		note: {
			en: 'The second hand is what keeps the racket face where you put it.',
			de: 'Die zweite Hand hält das Schlägerblatt da, wo du es hinstellst.',
		},
		effect: { backhandPace: 1.06, backhandHigh: 0.55 },
	},
	{
		id: 'bh-two-line',
		branch: 'backhand',
		tier: 2,
		cost: COST[2]!,
		style: 'two',
		name: { en: 'Down the line', de: 'Longline' },
		note: {
			en: 'The angle two hands can still open up late.',
			de: 'Der Winkel, den zwei Hände auch spät noch aufmachen.',
		},
		effect: { backhandPace: 1.08, backhandAngle: 1.16, backhandHigh: 0.6 },
	},
	{
		id: 'bh-two-return',
		branch: 'backhand',
		tier: 3,
		cost: COST[3]!,
		style: 'two',
		name: { en: 'Backhand return', de: 'Rückhand-Return' },
		note: {
			en: 'A kick serve at shoulder height is in the strike zone, not above it.',
			de: 'Ein Kick-Aufschlag auf Schulterhöhe liegt im Schlagfenster, nicht darüber.',
		},
		effect: { backhandPace: 1.1, backhandAngle: 1.18, backhandHigh: 0.88 },
	},
	{
		id: 'bh-two-drive',
		branch: 'backhand',
		tier: 4,
		cost: COST[4]!,
		style: 'two',
		name: { en: 'The two-hander', de: 'Die beidhändige Rückhand' },
		note: {
			en: 'No weak wing left on the court for him to find.',
			de: 'Keine schwache Seite mehr, die er finden könnte.',
		},
		effect: { backhandPace: 1.16, backhandAngle: 1.2, backhandHigh: 0.92 },
	},

	// ── Backhand: one hand ─────────────────────────────────────────────
	{
		id: 'bh-one-reach',
		branch: 'backhand',
		tier: 1,
		cost: COST[1]!,
		style: 'one',
		name: { en: 'Reach', de: 'Reichweite' },
		note: {
			en: 'One hand off the grip is half an arm further into the corner.',
			de: 'Eine Hand weniger am Griff ist ein halber Arm weiter in die Ecke.',
		},
		effect: { backhandReach: 9, backhandHigh: 0.1 },
	},
	{
		id: 'bh-one-slice',
		branch: 'backhand',
		tier: 2,
		cost: COST[2]!,
		style: 'one',
		name: { en: 'Disguised slice', de: 'Getarnter Slice' },
		note: {
			en: 'The same swing as the drive, right up until it isn’t.',
			de: 'Derselbe Schwung wie der Drive — bis er es nicht mehr ist.',
		},
		effect: { backhandReach: 11, backhandSlice: 1.25, backhandHigh: 0.14 },
	},
	{
		id: 'bh-one-carve',
		branch: 'backhand',
		tier: 3,
		cost: COST[3]!,
		style: 'one',
		name: { en: 'Carve', de: 'Carve' },
		note: {
			en: 'A slice that passes under the net cord and never comes back up.',
			de: 'Ein Slice, der unter der Netzkante durchgeht und nie wieder hochkommt.',
		},
		effect: { backhandReach: 13, backhandSlice: 1.45, backhandAngle: 1.1, backhandHigh: 0.18 },
	},
	{
		id: 'bh-one-hander',
		branch: 'backhand',
		tier: 4,
		cost: COST[4]!,
		style: 'one',
		name: { en: 'The one-hander', de: 'Die einhändige Rückhand' },
		note: {
			en: 'Every angle on the court — except the one above your shoulder.',
			de: 'Jeder Winkel auf dem Platz — außer dem über deiner Schulter.',
		},
		effect: { backhandReach: 15, backhandPace: 1.16, backhandAngle: 1.24, backhandSlice: 1.5, backhandHigh: 0.22 },
	},

	// ── Movement & fitness ─────────────────────────────────────────────
	{
		id: 'split-step',
		branch: 'fitness',
		tier: 1,
		cost: COST[1]!,
		name: { en: 'Split-step', de: 'Splitstep' },
		note: {
			en: 'The little hop that starts every first step there is.',
			de: 'Der kleine Hüpfer, mit dem jeder erste Schritt anfängt.',
		},
		effect: { speed: 1.08 },
	},
	{
		id: 'recovery',
		branch: 'fitness',
		tier: 2,
		cost: COST[2]!,
		name: { en: 'Recovery', de: 'Erholung' },
		note: {
			en: 'Ninety seconds at the changeover, spent properly.',
			de: 'Neunzig Sekunden beim Seitenwechsel, richtig genutzt.',
		},
		effect: { speed: 1.1, recovery: 1.6 },
	},
	{
		id: 'coverage',
		branch: 'fitness',
		tier: 3,
		cost: COST[3]!,
		name: { en: 'Court coverage', de: 'Platzabdeckung' },
		note: {
			en: 'Ground you did not use to get to, got to.',
			de: 'Bälle, die du früher nicht erreicht hast, erreicht.',
		},
		effect: { speed: 1.18, recovery: 1.7 },
	},
	{
		id: 'five-setter',
		branch: 'fitness',
		tier: 4,
		cost: COST[4]!,
		name: { en: 'Five-setter', de: 'Fünf-Satz-Match' },
		note: { en: 'Still moving in the fifth.', de: 'Im fünften Satz noch auf den Beinen.' },
		effect: { speed: 1.2, stamina: 155, recovery: 2 },
	},

	// ── Under pressure ─────────────────────────────────────────────────
	{
		id: 'bp-saved',
		branch: 'pressure',
		tier: 1,
		cost: COST[1]!,
		name: { en: 'Break points saved', de: 'Abgewehrte Breakbälle' },
		note: {
			en: 'Of everything the tour counts, this is the one that decides matches.',
			de: 'Von allem, was die Tour zählt, entscheidet das hier die Matches.',
		},
		effect: { pressureGuard: 0.16 },
	},
	{
		id: 'bp-converted',
		branch: 'pressure',
		tier: 2,
		cost: COST[2]!,
		name: { en: 'Break points converted', de: 'Verwandelte Breakbälle' },
		note: { en: 'And this is the other half of it.', de: 'Und das ist die andere Hälfte davon.' },
		effect: { pressureGuard: 0.16, pressureBite: 0.16 },
	},
	{
		id: 'tiebreak-nerve',
		branch: 'pressure',
		tier: 3,
		cost: COST[3]!,
		name: { en: 'Tie-break nerve', de: 'Tiebreak-Nerven' },
		note: {
			en: 'A set decided by four or five points, and you want all of them.',
			de: 'Ein Satz, der an vier oder fünf Punkten hängt — und du willst sie alle.',
		},
		effect: { pressureGuard: 0.18, pressureBite: 0.18, pressureScope: 1 },
	},
	{
		id: 'deciding-set',
		branch: 'pressure',
		tier: 4,
		cost: COST[4]!,
		name: { en: 'Deciding set', de: 'Entscheidungssatz' },
		note: { en: 'Match point, on either racket.', de: 'Matchball — auf beiden Schlägern.' },
		effect: { pressureGuard: 0.24, pressureBite: 0.24, pressureScope: 2 },
	},
];

/** The nodes a given backhand is offered, in the order they are climbed. */
export function nodesIn(branch: BranchId, style: BackhandStyle | null) {
	return SKILLS.filter(
		(node) => node.branch === branch && (!node.style || node.style === style)
	).sort((a, b) => a.tier - b.tier);
}

/** Whether the tier below this one is already held. */
export function available(node: SkillNode, career: Career) {
	if (career.unlocked.includes(node.id)) return false;
	if (node.branch === 'backhand' && career.backhand === null) return false;
	if (node.tier === 1) return true;
	const below = nodesIn(node.branch, career.backhand).find((one) => one.tier === node.tier - 1);
	return below ? career.unlocked.includes(below.id) : false;
}

/** Who is on the other side of the net, which the mode decides as well. */
export const opponentIn = (career: Career) =>
	career.mode === 'casual' ? CASUAL_OPPONENT : opponentFor(career.round);

/** Everything the match needs to know about who it is being played by. */
export function ratingsFor(career: Career): Ratings {
	if (career.mode === 'casual') return casualRatings(career.casualBackhand);

	const ratings = { ...BASE };

	// The wing you learned is worth something before a single session is
	// paid for: two hands hold up above the shoulder, one hand reaches.
	if (career.backhand === 'two') ratings.backhandHigh = 0.4;
	if (career.backhand === 'one') {
		ratings.backhandReach = 5;
		ratings.backhandSlice = 1.12;
	}

	for (const node of SKILLS) {
		if (!career.unlocked.includes(node.id)) continue;
		Object.assign(ratings, node.effect);
	}
	return ratings;
}

// ── Keeping it ────────────────────────────────────────────────────────

const KEY = 'tennis-career';

/**
 * localStorage is the visitor's to edit, so nothing read back out of it is
 * trusted: every field is checked and anything unrecognised falls back to
 * what a fresh career has. A half-written save costs a career, not a crash.
 */
export function loadCareer(): Career {
	const fresh = freshCareer();
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return fresh;
		const saved = JSON.parse(raw) as Partial<Career>;
		const ids = new Set(SKILLS.map((node) => node.id));
		const number = (value: unknown, fallback: number) =>
			typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;

		// Somebody who was playing this before it had two modes has a career
		// going, and should not be dropped back into a casual match over it.
		const started =
			number(saved.points, 0) > 0 || (Array.isArray(saved.unlocked) && saved.unlocked.length > 0);

		return {
			mode: saved.mode === 'career' || (saved.mode === undefined && started) ? 'career' : 'casual',
			points: number(saved.points, 0),
			prize: number(saved.prize, 0),
			earned: number(saved.earned, 0),
			round: Math.min(Math.round(number(saved.round, 0)), FINAL),
			entered: saved.entered === true,
			titles: Math.round(number(saved.titles, 0)),
			best: Math.min(Math.round(number(saved.best, 0)), CHAMPION),
			won: Math.round(number(saved.won, 0)),
			hand: saved.hand === 'left' ? 'left' : 'right',
			backhand: saved.backhand === 'one' || saved.backhand === 'two' ? saved.backhand : null,
			casualBackhand: saved.casualBackhand === 'one' ? 'one' : 'two',
			unlocked: Array.isArray(saved.unlocked)
				? saved.unlocked.filter((id): id is string => typeof id === 'string' && ids.has(id))
				: [],
		};
	} catch {
		return fresh;
	}
}

export function saveCareer(career: Career) {
	try {
		localStorage.setItem(KEY, JSON.stringify(career));
	} catch {
		// Private mode: the career lasts as long as the tab does.
	}
}

export function clearCareer() {
	try {
		localStorage.removeItem(KEY);
	} catch {
		// Nothing to clear, then.
	}
}

// ── Money and places ──────────────────────────────────────────────────

/** Prize money, short enough for a scoreboard. */
export function formatPrize(value: number, locale: string) {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: 'EUR',
		notation: 'compact',
		maximumFractionDigits: value >= 1_000_000 ? 2 : 0,
	}).format(value);
}

/** A ranking as it is written down: "No. 12", or nothing at all yet. */
export function formatRank(points: number, lang: 'en' | 'de') {
	const rank = rankFor(points);
	if (rank === null) return lang === 'de' ? 'Ohne Platzierung' : 'Unranked';
	return lang === 'de' ? `Nr. ${rank}` : `No. ${rank}`;
}
