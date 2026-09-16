/**
 * The court, in canvas units, and the physics the match is played with.
 *
 * Everything here is a number the drawing and the rally both depend on, so
 * it lives apart from either: the stadium in TennisGame.astro paints these
 * dimensions, and the point played on top of it reads the same ones.
 */

/** Canvas units. The stands fill the frame; the court sits inside them. */
export const W = 960;
export const H = 620;
export const COURT_W = 660;
export const COURT_H = Math.round(COURT_W / 2.1667); // 23.77m × 10.97m
export const COURT_X = Math.round((W - COURT_W) / 2);
export const COURT_Y = Math.round((H - COURT_H) / 2);
export const APRON_X = 86; // run-off between the court and the front row
export const APRON_Y = 62;
export const ALLEY = COURT_H * 0.125;
export const SERVICE = COURT_W * 0.269;

/** The net, and the two service boxes either side of it. */
export const NET_X = COURT_X + COURT_W / 2;
export const COURT_MID = COURT_Y + COURT_H / 2;

export const PADDLE_W = 11;
export const PADDLE_H = 84;
export const PADDLE_INSET = 20;
export const BALL_R = 8;

export const BASE_SPEED = 430; // px per second
export const MAX_SPEED = 1080;
export const PLAYER_SPEED = 640;

/**
 * A serve leaves the racket far faster than a rally ball, and the number on
 * the board is read back out of this: `SERVE_SPEED` at full charge is the
 * 220 km/h a first serve is worth on a quick court.
 */
export const SERVE_MIN = 620;
export const SERVE_MAX = 1180;
export const SERVE_KMH = 220 / SERVE_MAX;

/** How long the racket can be wound up for before it is going out. */
export const CHARGE_SECONDS = 0.9;
/** A second serve is not swung at flat out — nobody's is. */
export const SECOND_SERVE_CHARGE = 0.55;

export type Side = 'player' | 'cpu';
export type Wing = 'forehand' | 'backhand';
export type Shot = 'topspin' | 'flat' | 'slice';
export type Hand = 'right' | 'left';

export const other = (side: Side): Side => (side === 'player' ? 'cpu' : 'player');

export function clamp(value: number, min: number, max: number) {
	return Math.max(min, Math.min(max, value));
}

/**
 * Whether this player's forehand covers the lower half of the racket.
 *
 * Seen from above, a right-hander at the near end of the court has the ball
 * on their racket side when it is below the middle of them, and a left-hander
 * the other way round. The player at the far end faces the other way, so the
 * halves swap again: two right-handers rallying crosscourt forehand to
 * forehand really are hitting from opposite sides of the screen, which is the
 * diagonal the shot is played down in the first place.
 */
export const forehandBelow = (side: Side, hand: Hand) =>
	side === 'player' ? hand === 'right' : hand === 'left';

/**
 * Which wing a ball met at `offset` — the contact point on the racket, from
 * -1 at the top edge to +1 at the bottom — lands on.
 *
 * `runAround` moves the line between the two wings into the backhand half:
 * a player who has learned to run around the backhand takes balls with the
 * forehand that would otherwise have been backhands. That shot — the
 * inside-out forehand — is the most-hit ball in the men's game for exactly
 * this reason, and here it is the same trade: better contact, worse position.
 */
export function wingFor(side: Side, hand: Hand, offset: number, runAround = 0): Wing {
	return forehandBelow(side, hand)
		? offset > -runAround
			? 'forehand'
			: 'backhand'
		: offset < runAround
			? 'forehand'
			: 'backhand';
}
