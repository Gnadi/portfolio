/**
 * The five stadiums the match can be played in, and — more to the point —
 * the five surfaces.
 *
 * The ITF classifies every surface it certifies on a Court Pace Rating from
 * 1 (slow) to 5 (fast): a ball cannon fires at a fixed angle onto a sample
 * and infrared gates measure how much horizontal speed survives the bounce.
 * Clay comes out at category 1, grass at category 5, and the hard courts sit
 * in the bands between them. The site already wears a tournament; from here
 * it plays like one too.
 */

export type VenueId = 'usopen' | 'ao' | 'rg' | 'wimbledon' | 'atp';

export interface Venue {
	/** The stadium on the back wall. */
	venue: string;
	/** The bowl's corner radius: a square arena or an oval one. */
	corner: number;
	/** Where the upper tier stops, as a fraction of the way in. */
	tier: number;
	/** Which ring carries the tournament's own colour in the seats. */
	accentBand: 'lower' | 'upper' | 'none';
	/** The surface, as the umpire would name it. */
	surface: { en: string; de: string };
	/** The ITF Court Pace Rating band, 1 slow to 5 fast. */
	category: 1 | 2 | 3 | 4 | 5;
	pace: {
		/**
		 * What a shot does to the speed of the ball. A rally on grass gets
		 * quicker with every exchange; one on clay barely does, which is why
		 * the points there go on so much longer.
		 */
		rally: number;
		/** Serves come off a fast court harder — and off clay, they don't. */
		serve: number;
		/**
		 * How much a topspin ball kicks up off the bounce. High on clay, where
		 * the surface grips and the ball climbs; almost nothing on grass,
		 * where it skids through instead.
		 */
		kick: number;
		/**
		 * How much of its pace a slice keeps. The mirror of the above: a sliced
		 * ball stays low and skids on grass, and sits up to be hit on clay.
		 */
		skid: number;
	};
}

export const VENUES: Record<VenueId, Venue> = {
	usopen: {
		venue: 'Arthur Ashe Stadium',
		corner: 16, // a big square bowl
		tier: 0.46,
		accentBand: 'lower', // the blue ring under the upper tier
		surface: { en: 'Hard court', de: 'Hartplatz' },
		category: 3,
		pace: { rally: 1.05, serve: 1, kick: 0.6, skid: 0.62 },
	},
	ao: {
		venue: 'Rod Laver Arena',
		corner: 46, // rounded, almost oval
		tier: 0.44,
		accentBand: 'upper',
		surface: { en: 'Hard court', de: 'Hartplatz' },
		category: 4,
		// The Melbourne cushioned acrylic plays quick and bounces high, which
		// is the one combination that suits a two-hander above everything.
		pace: { rally: 1.066, serve: 1.05, kick: 0.74, skid: 0.5 },
	},
	rg: {
		venue: 'Court Philippe-Chatrier',
		corner: 8, // the rectangle in the Bois de Boulogne
		tier: 0.4,
		accentBand: 'none',
		surface: { en: 'Clay', de: 'Sand' },
		category: 1,
		pace: { rally: 1.021, serve: 0.92, kick: 1, skid: 0.34 },
	},
	wimbledon: {
		venue: 'Centre Court',
		corner: 30,
		tier: 0.42,
		accentBand: 'lower', // the club's purple in the seats
		surface: { en: 'Grass', de: 'Rasen' },
		category: 5,
		pace: { rally: 1.09, serve: 1.12, kick: 0.26, skid: 1 },
	},
	atp: {
		// The finals have moved before — London's O2, now Turin — so this
		// is the one venue name here with a shelf life.
		venue: 'Inalpi Arena, Turin',
		corner: 40, // an indoor arena bowl, not a stadium
		tier: 0.5,
		accentBand: 'lower',
		surface: { en: 'Indoor hard', de: 'Halle, hart' },
		category: 4,
		// Indoors there is no wind and no damp to take the pace off: the
		// bounce is true and the serve is worth more than anywhere else.
		pace: { rally: 1.072, serve: 1.08, kick: 0.5, skid: 0.66 },
	},
};

/** How the board names the pace band, without spelling out the ITF's table. */
export const paceLabel: Record<Venue['category'], { en: string; de: string }> = {
	1: { en: 'Slow', de: 'Langsam' },
	2: { en: 'Medium-slow', de: 'Eher langsam' },
	3: { en: 'Medium', de: 'Mittel' },
	4: { en: 'Medium-fast', de: 'Eher schnell' },
	5: { en: 'Fast', de: 'Schnell' },
};
