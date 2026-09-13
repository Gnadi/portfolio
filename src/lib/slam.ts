/**
 * Grand Slam colour themes.
 *
 * The site ships four palettes — one per major — and by default wears the one
 * whose tournament is either on right now or up next. The choice is stored
 * per visitor and applied as `data-slam` on <html>; the palettes themselves
 * live in src/styles/global.css.
 *
 * Unlike the light/dark theme this is *not* mirrored into the shared
 * gnadlinger.me cookie: the CV and the blog do not have these palettes, so
 * there is nothing on the other side to keep in step.
 */
export type SlamId = 'ao' | 'rg' | 'wimbledon' | 'usopen';

/** `auto` follows the calendar; anything else pins one tournament. */
export type SlamPreference = 'auto' | SlamId;

export const SLAM_STORAGE_KEY = 'slam';
export const SLAM_ATTRIBUTE = 'data-slam';

export const DEFAULT_SLAM: SlamId = 'usopen';

interface Slam {
	id: SlamId;
	/** Tournament name. A proper noun, so it is not translated. */
	name: string;
	/** Shown on the picker button, where a full name does not fit. */
	short: string;
	/** Dot in the picker, and the `theme-color` the browser paints chrome with. */
	swatch: string;
	/**
	 * The window the palette is worn in, as `[month, day]`. The real dates move
	 * by a week or so every year, so these are deliberately generous: what
	 * matters is that the four windows stay in calendar order and never
	 * overlap, because the gaps between them are what "up next" is read from.
	 */
	from: [number, number];
	to: [number, number];
}

/** In calendar order — `slamFor` relies on it. */
export const slams: readonly Slam[] = [
	{
		id: 'ao',
		name: 'Australian Open',
		short: 'AO',
		swatch: '#00719f',
		from: [1, 6],
		to: [2, 2],
	},
	{
		id: 'rg',
		name: 'Roland-Garros',
		short: 'RG',
		swatch: '#b34a24',
		from: [5, 18],
		to: [6, 9],
	},
	{
		id: 'wimbledon',
		name: 'Wimbledon',
		short: 'WIM',
		swatch: '#006633',
		from: [6, 22],
		to: [7, 15],
	},
	{
		id: 'usopen',
		name: 'US Open',
		short: 'USO',
		swatch: '#0057b8',
		from: [8, 18],
		to: [9, 15],
	},
] as const;

export const slamUi = {
	en: {
		label: 'Grand Slam theme',
		auto: 'Auto',
		autoHint: 'Current or next tournament',
	},
	de: {
		label: 'Grand-Slam-Design',
		auto: 'Automatisch',
		autoHint: 'Aktuelles oder nächstes Turnier',
	},
} as const;

/** `[month, day]` as a comparable number, e.g. June 9th → 609. */
const asMonthDay = ([month, day]: [number, number]) => month * 100 + day;

/**
 * The tournament being played on `date`, or the next one to come. After the
 * US Open that wraps around to the Australian Open, so there is always an
 * answer.
 */
export function slamFor(date: Date): SlamId {
	const today = (date.getMonth() + 1) * 100 + date.getDate();

	for (const slam of slams) {
		if (today >= asMonthDay(slam.from) && today <= asMonthDay(slam.to)) return slam.id;
	}
	for (const slam of slams) {
		if (today < asMonthDay(slam.from)) return slam.id;
	}
	return slams[0]!.id;
}

export function resolveSlam(preference: SlamPreference, date = new Date()): SlamId {
	return preference === 'auto' ? slamFor(date) : preference;
}

export function applySlam(slam: SlamId) {
	document.documentElement.setAttribute(SLAM_ATTRIBUTE, slam);
	const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
	const swatch = slams.find((entry) => entry.id === slam)?.swatch;
	if (meta && swatch) meta.content = swatch;
}

export function readStoredSlam(): SlamPreference {
	try {
		const stored = localStorage.getItem(SLAM_STORAGE_KEY);
		if (stored === 'auto') return 'auto';
		return slams.some((slam) => slam.id === stored) ? (stored as SlamId) : 'auto';
	} catch {
		return 'auto';
	}
}

export function storeSlam(preference: SlamPreference) {
	try {
		localStorage.setItem(SLAM_STORAGE_KEY, preference);
	} catch {
		// Private mode and friends. The palette still applies for this page
		// view; it just will not be remembered.
	}
}

/** The data the inline script below needs, without the presentation copy. */
const season = slams.map(({ id, swatch, from, to }) => ({
	id,
	swatch,
	from: asMonthDay(from),
	to: asMonthDay(to),
}));

/**
 * Picks the palette before first paint, so the page never flashes through the
 * default one. Inlined into the head as a raw string, ahead of any bundle —
 * the calendar is read on the visitor's clock, which a static build cannot do
 * for them.
 */
export const slamInitScript = `(function () {
  var STORAGE = ${JSON.stringify(SLAM_STORAGE_KEY)};
  var ATTRIBUTE = ${JSON.stringify(SLAM_ATTRIBUTE)};
  var SEASON = ${JSON.stringify(season)};

  function stored() {
    try {
      var value = localStorage.getItem(STORAGE);
      if (value === "auto") return "auto";
      for (var i = 0; i < SEASON.length; i++) if (SEASON[i].id === value) return value;
      return "auto";
    } catch (error) {
      return "auto";
    }
  }

  function scheduled() {
    var now = new Date();
    var today = (now.getMonth() + 1) * 100 + now.getDate();
    for (var i = 0; i < SEASON.length; i++) {
      if (today >= SEASON[i].from && today <= SEASON[i].to) return SEASON[i].id;
    }
    for (var j = 0; j < SEASON.length; j++) {
      if (today < SEASON[j].from) return SEASON[j].id;
    }
    return SEASON[0].id;
  }

  function apply() {
    var preference = stored();
    var slam = preference === "auto" ? scheduled() : preference;
    document.documentElement.setAttribute(ATTRIBUTE, slam);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      for (var i = 0; i < SEASON.length; i++) {
        if (SEASON[i].id === slam) meta.setAttribute("content", SEASON[i].swatch);
      }
    }
  }

  apply();

  // A tab left open across midnight — or across a final — should not keep
  // yesterday's palette once it comes back to the front.
  addEventListener("pageshow", function (event) {
    if (event.persisted) apply();
  });
  document.addEventListener("astro:after-swap", apply);
})();`;
