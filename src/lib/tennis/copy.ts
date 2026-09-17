/**
 * Everything the game says, in both languages the site speaks.
 *
 * It lives here rather than in the component's frontmatter because most of it
 * is needed by the script — the scoreboard, the skill tree and the stat sheet
 * are all built in the browser — and handing thirty strings across on data
 * attributes was more markup than copy. Both languages ship; between them
 * they are a couple of kilobytes.
 *
 * `%s` and friends are filled in where they are used: %s a score or a name,
 * %o the opponent, %p the player, %r a round.
 */
import { FULL_NAME, SITE_ORIGIN } from '../schema';

/** Scoreboards show surnames, so this one does too. */
const surname = FULL_NAME.split(' ').pop() ?? 'Player';
const host = SITE_ORIGIN.replace('https://', '');

export const copy = {
	en: {
		// ── The way in ────────────────────────────────────────────────
		play: 'Play a point',
		title: 'Tennis',
		close: 'Close',
		opponent: surname,
		you: 'You',
		yourName: 'Your name',
		entry: 'Who is playing ' + surname + '?',
		start: 'Play',
		change: 'Change name',

		// ── The point ─────────────────────────────────────────────────
		serve: 'Hold to wind up · let go to serve',
		serveTap: 'Hold anywhere to wind up · let go to serve',
		secondServe: 'Second serve',
		fault: 'Fault',
		doubleFault: 'Double fault',
		ace: 'Ace',
		deuce: 'Deuce',
		decidingPoint: 'Deciding point',
		/* Called out beside the racket as it is hit, so the two wings and the
		   three swings are learned by seeing them named. */
		wings: { forehand: 'Forehand', backhand: 'Backhand' },
		shots: { topspin: 'Topspin', slice: 'Slice', flat: 'Block' },
		breakPoint: 'Break point',
		matchPoint: 'Match point',
		tiebreak: 'Tie-break',
		hint: 'Move with the mouse, a finger or ↑ ↓ · the half of the racket you meet the ball on is your forehand or your backhand · swing through it for topspin, pull off it for slice',
		hintTiebreak: 'Slide to move · top half and bottom half are your two wings · first to seven, two clear',

		// ── The board ─────────────────────────────────────────────────
		round: 'Round',
		seed: 'No. %s seed',
		qualifier: 'Qualifier',
		unseeded: 'Unseeded',
		fitness: 'Fitness',
		pace: 'Court pace',
		careerButton: 'Career',

		// ── The end of it ─────────────────────────────────────────────
		win: 'Game, set and match, %s.',
		winTiebreak: 'Tie-break, %s.',
		through: 'Next: %s',
		knockedOut: 'Knocked out: %s',
		champion: 'Champion',
		titleWon: 'Champion — title number %s',
		beat: 'beat %o %s',
		earned: '+%p ranking points · %m',
		nextMatch: 'Next match',
		newDraw: 'Into a new draw',
		playAgain: 'Play again',
		statsTitle: 'Match statistics',
		statsYou: 'You',
		saveImage: 'Save image',
		share: 'Share',
		sendLinkedIn: 'Send it to ' + surname,
		copied: 'Result copied — paste it into your message on LinkedIn.',
		copiedText: 'Result copied to the clipboard.',
		shareText: 'I beat ' + FULL_NAME + ' %s at tennis on ' + host,
		cardAlt: '%p beat %o %s at tennis on ' + host,

		// ── The career ────────────────────────────────────────────────
		careerTitle: 'Career',
		mode: 'Playing',
		casualMode: 'Just a match',
		careerMode: 'Career',
		modeNote:
			'A match on its own and nothing to keep track of — or a draw to climb, where rounds pay ranking points and prize money, and the money buys your game.',
		ranking: 'Ranking',
		prizeMoney: 'Prize money',
		titles: 'Titles',
		matchesWon: 'Matches won',
		best: 'Best run',
		plays: 'Plays',
		rightHanded: 'Right-handed',
		leftHanded: 'Left-handed',
		handNote:
			'A left-hander’s forehand crosses to a right-hander’s backhand. It is the oldest advantage in the game, and it swaps which half of your racket is which.',
		backhandChoice: 'Your backhand',
		backhandNote: 'Chosen once. After that it is your backhand for good.',
		backhandFree: 'Either one, and change it whenever you like.',
		twoHanded: 'Two-handed',
		twoHandedNote: 'Stability and power, and a ball at shoulder height is in the strike zone.',
		oneHanded: 'One-handed',
		oneHandedNote: 'Reach, and a slice nobody reads — but anything above the shoulder has to be carved.',
		train: 'Train',
		trained: 'Trained',
		locked: 'Earn the one below it first',
		tooDear: 'Not enough prize money',
		resetCareer: 'Start again from nothing',
		resetConfirm:
			'This throws away your ranking, your prize money and everything you have trained. Start again?',
		careerNote:
			'Everything here is kept in this browser and nowhere else. Nothing is sent anywhere.',
		done: 'Back to the court',
	},

	de: {
		play: 'Einen Punkt spielen',
		title: 'Tennis',
		close: 'Schließen',
		opponent: surname,
		you: 'Du',
		yourName: 'Dein Name',
		entry: 'Wer spielt gegen ' + surname + '?',
		start: 'Spielen',
		change: 'Namen ändern',

		serve: 'Halten zum Ausholen · loslassen zum Aufschlag',
		serveTap: 'Irgendwo halten zum Ausholen · loslassen zum Aufschlag',
		secondServe: 'Zweiter Aufschlag',
		fault: 'Fehler',
		doubleFault: 'Doppelfehler',
		ace: 'Ass',
		deuce: 'Einstand',
		decidingPoint: 'Entscheidungspunkt',
		wings: { forehand: 'Vorhand', backhand: 'Rückhand' },
		shots: { topspin: 'Topspin', slice: 'Slice', flat: 'Block' },
		breakPoint: 'Breakball',
		matchPoint: 'Matchball',
		tiebreak: 'Tie-Break',
		hint: 'Bewegen mit Maus, Finger oder ↑ ↓ · die Schlägerhälfte, die den Ball trifft, ist Vorhand oder Rückhand · durchziehen gibt Topspin, zurückziehen gibt Slice',
		hintTiebreak: 'Zum Bewegen wischen · obere und untere Hälfte sind deine zwei Seiten · sieben Punkte, zwei Vorsprung',

		round: 'Runde',
		seed: 'Nr. %s gesetzt',
		qualifier: 'Qualifikant',
		unseeded: 'Ungesetzt',
		fitness: 'Fitness',
		pace: 'Platztempo',
		careerButton: 'Karriere',

		win: 'Spiel, Satz und Sieg, %s.',
		winTiebreak: 'Tie-Break, %s.',
		through: 'Als Nächstes: %s',
		knockedOut: 'Ausgeschieden: %s',
		champion: 'Sieger',
		titleWon: 'Sieger — Titel Nummer %s',
		beat: 'schlägt %o %s',
		earned: '+%p Weltranglistenpunkte · %m',
		nextMatch: 'Nächstes Match',
		newDraw: 'In ein neues Turnier',
		playAgain: 'Nochmal spielen',
		statsTitle: 'Match-Statistik',
		statsYou: 'Du',
		saveImage: 'Bild speichern',
		share: 'Teilen',
		sendLinkedIn: 'An ' + surname + ' schicken',
		copied: 'Ergebnis kopiert — füge es in deine Nachricht auf LinkedIn ein.',
		copiedText: 'Ergebnis in die Zwischenablage kopiert.',
		shareText: 'Ich habe ' + FULL_NAME + ' %s im Tennis geschlagen — auf ' + host,
		cardAlt: '%p schlägt %o %s im Tennis auf ' + host,

		careerTitle: 'Karriere',
		mode: 'Du spielst',
		casualMode: 'Nur ein Match',
		careerMode: 'Karriere',
		modeNote:
			'Ein Match für sich, ohne irgendetwas zu verwalten — oder ein Turnier zum Klettern, in dem Runden Weltranglistenpunkte und Preisgeld bringen und das Preisgeld dein Spiel kauft.',
		ranking: 'Weltrangliste',
		prizeMoney: 'Preisgeld',
		titles: 'Titel',
		matchesWon: 'Gewonnene Matches',
		best: 'Bestes Ergebnis',
		plays: 'Spielt',
		rightHanded: 'Rechtshändig',
		leftHanded: 'Linkshändig',
		handNote:
			'Die Vorhand eines Linkshänders geht auf die Rückhand eines Rechtshänders. Der älteste Vorteil im Tennis — und er vertauscht, welche Schlägerhälfte welche ist.',
		backhandChoice: 'Deine Rückhand',
		backhandNote: 'Einmalige Wahl. Danach bleibt es deine Rückhand.',
		backhandFree: 'Beides möglich, und jederzeit änderbar.',
		twoHanded: 'Beidhändig',
		twoHandedNote: 'Stabil und kräftig, und ein Ball auf Schulterhöhe liegt im Schlagfenster.',
		oneHanded: 'Einhändig',
		oneHandedNote:
			'Reichweite und ein Slice, den keiner liest — aber alles über der Schulter muss geschnitten werden.',
		train: 'Trainieren',
		trained: 'Trainiert',
		locked: 'Erst die Stufe darunter',
		tooDear: 'Zu wenig Preisgeld',
		resetCareer: 'Ganz von vorne anfangen',
		resetConfirm:
			'Das wirft deine Platzierung, dein Preisgeld und alles Trainierte weg. Neu anfangen?',
		careerNote: 'Alles hier bleibt in diesem Browser. Es wird nichts irgendwohin geschickt.',
		done: 'Zurück auf den Platz',
	},
} as const;

export type GameCopy = (typeof copy)['en'];
