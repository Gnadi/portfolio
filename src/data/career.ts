/**
 * The career timeline, in both site languages.
 *
 * This used to live twice — once in `pages/career.astro` and once in
 * `pages/de/career.astro`, as two 440-line files that differed only in their
 * strings. Keeping the facts in one place is what stops the two copies from
 * drifting apart, which is how the English and German descriptions of the
 * MBS/EBICS work ended up describing two different projects.
 *
 * The shape follows `RESUME_DATA` on the CV: a value is either a plain string
 * (identical in both languages, e.g. a product name) or a `{ en, de }` pair.
 */

export type Translated = { en: string; de: string };
export type Text = string | Translated;

export type SiteLang = 'en' | 'de';

export type CareerType =
	| 'job'
	| 'project'
	| 'side-project'
	| 'hackathon'
	| 'certification'
	| 'leave';

/**
 * A role held inside one entry. The tenure at Raiffeisen Software covers two
 * distinct phases with different teams and different work, but it is one
 * employment — so it stays one timeline entry with the phases listed inside,
 * rather than two entries that would read as a change of employer.
 */
export interface CareerPhase {
	title: Text;
	/** ISO date. */
	startDate: string;
	/** ISO date, or the `ongoing` marker. */
	endDate: string;
	description: Text;
}

export interface CareerEntry {
	type: CareerType;
	title: Text;
	/** The employer for jobs, the role held for project entries. */
	organization: Text;
	/** ISO date. */
	startDate: string;
	/** ISO date, or the `ongoing` marker for entries with no end yet. */
	endDate: string;
	/** The entry's own text. Omitted when `phases` carries it instead. */
	description?: Text;
	/** Roles held within this one entry, newest first. */
	phases?: CareerPhase[];
}

/** Entries that have not ended carry this instead of a date. */
export const ONGOING = 'ongoing';

/** Resolves a `Text` for one language. */
export function translate(value: Text, lang: SiteLang): string {
	return typeof value === 'string' ? value : value[lang];
}

export const CAREER: CareerEntry[] = [
	{
		type: 'job',
		// The employer is what this entry is about; the roles are the phases.
		title: 'Raiffeisen Software GmbH',
		organization: 'Raiffeisen Software GmbH',
		startDate: '2018-07-01',
		endDate: ONGOING,
		// Wording taken verbatim from RESUME_DATA on the CV, so the two sites
		// describe the same two phases in the same words.
		phases: [
			{
				title: 'Payments & Backend Engineer',
				startDate: '2023-01-01',
				endDate: ONGOING,
				description: {
					en: 'Developing backend systems for corporate payment and financial services in a regulated banking environment.',
					de: 'Entwicklung von Backend-Systemen für Zahlungsverkehr und Finanzdienstleistungen im Firmenkundengeschäft — in einem regulierten Bankenumfeld.',
				},
			},
			{
				title: 'Full Stack Developer & Product Owner',
				startDate: '2018-07-01',
				endDate: '2022-12-31',
				description: {
					en: 'Built digital banking products across private and corporate banking, progressing from hands-on full-stack development into product ownership.',
					de: 'Entwicklung digitaler Banking-Produkte im Privat- und Firmenkundengeschäft — vom Full-Stack-Development bis in die Product Ownership.',
				},
			},
		],
	},
	{
		type: 'project',
		title: {
			en: 'MeinELBA Sales and Test Automation',
			de: 'MeinELBA Vertrieb und Testautomatisierung',
		},
		organization: 'Developer',
		startDate: '2018-07-02',
		endDate: '2019-07-01',
		description: {
			en: 'Development of web-based sales functions in MeinELBA Sales and implementation of test automation.',
			de: 'Entwicklung der webbasierten Vertriebsfunktionen in MeinELBA Vertrieb und die Implementierung der Testautomatisierung.',
		},
	},
	{
		type: 'project',
		title: {
			en: 'Infinity Notifications, Bank Messages and Advisor Display',
			de: 'Infinity Benachrichtigungen, Banknachrichten und Berateranzeige',
		},
		organization: 'Developer',
		startDate: '2019-07-01',
		endDate: '2020-07-01',
		description: {
			en: 'Development of notifications, bank messages, and advisor display in Infinity business banking.',
			de: 'Entwicklung von Benachrichtigungen, Banknachrichten und Berateranzeige im Businessbanking Infinity.',
		},
	},
	{
		type: 'project',
		title: {
			en: 'MeinELBA Accessibility',
			de: 'MeinELBA Barrierefreiheit',
		},
		organization: 'Developer',
		startDate: '2020-07-01',
		endDate: '2020-09-01',
		description: {
			en: 'Development of accessibility for MeinELBA in cooperation with the Austrian Association for the Blind.',
			de: 'Entwicklung von Barrierefreiheit für MeinELBA in Zusammenarbeit mit dem österreichischen Blindenverband.',
		},
	},
	{
		type: 'project',
		title: {
			en: 'Infinity Connection Raiffeisen Salzburg | Financial Status 2.0',
			de: 'Infinity Anbindung Raiffeisen Salzburg | Finanzstatus 2.0',
		},
		organization: 'Requirements Engineer',
		startDate: '2020-09-01',
		endDate: '2020-12-01',
		description: {
			en: 'Connection of Raiffeisen Verband Salzburg to Infinity and implementation of new functions in the financial status.',
			de: 'Raiffeisen Verband Salzburg Anbindung an Infinity und Umsetzung von neuen Funktionen im Finanzstatus.',
		},
	},
	{
		type: 'project',
		title: 'MeinELBA 2.0',
		organization: 'Developer',
		startDate: '2021-01-01',
		endDate: '2021-12-31',
		description: {
			en: 'Replacement of meinELBA 1.0 and development of meinELBA 2.0 with Angular and a new style guide.',
			de: 'Ablöse von meinELBA 1.0 und Entwicklung von meinELBA 2.0 mit Angular und neuem Styleguide.',
		},
	},
	{
		type: 'project',
		title: 'Infinity Mailbox',
		organization: 'Product Owner',
		startDate: '2022-01-01',
		endDate: '2022-12-31',
		description: {
			en: 'Development of Infinity Mailbox with connection to the banking application of the respective bank advisor.',
			de: 'Entwicklung von Infinity Mailbox mit Anbindung an die Bankapplikation des jeweiligen Bankberaters.',
		},
	},
	{
		type: 'project',
		title: {
			en: 'Infinity Appointment Scheduling',
			de: 'Infinity Terminvereinbarung',
		},
		organization: 'Product Owner',
		startDate: '2023-01-01',
		endDate: '2023-09-01',
		description: {
			en: 'With Infinity Appointment Scheduling, customers can book appointments directly in the calendar released by the bank advisor.',
			de: 'Mit Infinity Terminvereinbarung haben Kunden die Möglichkeit, Termine direkt im vom Bankberater freigegebenen Kalender zu buchen.',
		},
	},
	{
		type: 'project',
		title: {
			en: 'Infinity Foreign Bank Guarantee',
			de: 'Infinity Bankgarantie Ausland',
		},
		organization: 'Developer',
		startDate: '2023-09-01',
		endDate: '2023-12-31',
		description: {
			en: 'With Foreign Bank Guarantee, customers can record and download bank guarantees directly in Infinity.',
			de: 'Mit Bankgarantie Ausland können Kunden Bankgarantien direkt in Infinity erfassen und herunterladen.',
		},
	},
	{
		type: 'project',
		title: {
			en: 'Infinity Payment Transactions MBS Replacement by EBICS',
			de: 'Infinity Zahlungsverkehr MBS Ablöse durch EBICS',
		},
		organization: 'Developer',
		startDate: '2024-01-01',
		endDate: ONGOING,
		description: {
			en: 'Introduction of the EBICS payment standard alongside the running MBS operation, on the way to replacing it.',
			de: 'Einführung des EBICS-Zahlungsverkehrsstandards im Parallelbetrieb zum laufenden MBS — auf dem Weg zur Ablöse.',
		},
	},
	{
		type: 'project',
		title: {
			en: 'Infinity International Payment Transactions',
			de: 'Infinity Internationaler Zahlungsverkehr',
		},
		organization: 'Developer',
		startDate: '2024-01-01',
		endDate: '2024-09-01',
		description: {
			en: 'With international payment transactions, it is possible to commission orders from other banks directly in Infinity.',
			de: 'Mit dem internationalen Zahlungsverkehr ist es möglich, Aufträge bei anderen Banken direkt in Infinity zu beauftragen.',
		},
	},
	{
		type: 'project',
		title: {
			en: 'Infinity German Market',
			de: 'Infinity Deutscher Markt',
		},
		organization: 'Developer',
		startDate: '2024-09-01',
		endDate: '2025-02-01',
		description: {
			en: 'With this project, it is also possible to use German bank accounts in Infinity.',
			de: 'Mit dem Projekt ist es auch möglich, deutsche Bankverbindungen in Infinity zu nutzen.',
		},
	},
	{
		type: 'project',
		title: {
			en: 'Infinity Payee Verification',
			de: 'Infinity Empfängerverifikation',
		},
		organization: 'Developer',
		startDate: '2025-02-01',
		endDate: '2025-12-01',
		description: {
			en: 'Implementation of mandatory payee verification for transfers.',
			de: 'Umsetzung der verpflichtenden Empfängerverifikation bei Überweisungen.',
		},
	},
	{
		type: 'project',
		title: {
			en: 'Bulgaria Euro Adoption',
			de: 'Bulgarien Euro Umstellung',
		},
		organization: 'Developer',
		startDate: '2025-12-02',
		endDate: '2026-01-01',
		description: {
			en: 'Migration of bank accounts from Bulgaria to Euro.',
			de: 'Migration der Bankverbindungen aus Bulgarien auf Euro.',
		},
	},
	{
		type: 'certification',
		title: {
			en: 'Engineer Certification',
			de: 'Ingenieur Zertifizierung',
		},
		organization: {
			en: 'WKO Upper Austria',
			de: 'WKO Oberösterreich',
		},
		startDate: '2026-01-01',
		endDate: '2026-01-01',
		description: {
			en: 'Successfully completed the Engineer Certification.',
			de: 'Erfolgreicher Abschluss der Ingenieur-Zertifizierung.',
		},
	},
	{
		type: 'leave',
		title: {
			en: 'Parental Leave',
			de: 'Karenz',
		},
		organization: 'Raiffeisen Software GmbH',
		startDate: '2026-02-01',
		endDate: '2026-08-01',
		description: {
			en: 'Parental leave to care for my child.',
			de: 'Karenzzeit zur Betreuung meines Kindes.',
		},
	},
	{
		type: 'hackathon',
		title: 'Raiffeisen Arena Hackathon',
		organization: 'Developer',
		startDate: '2023-11-10',
		endDate: '2023-11-12',
		description: {
			en: '2nd Place. Development of an app for the Raiffeisen Arena.',
			de: '2. Platz. Entwicklung einer App für die Raiffeisen Arena.',
		},
	},
	{
		type: 'hackathon',
		title: 'Samsung Icarus VR Hackathon',
		organization: 'Developer',
		startDate: '2022-11-11',
		endDate: '2022-11-12',
		description: {
			en: '3rd Place. Development of a VR game for the Icarus fitness device using Samsung VR Gear glasses.',
			de: '3. Platz. Entwicklung eines VR Spiels für das Fitnessgerät Icarus mit der Samsung VR Gear Brille.',
		},
	},
	{
		type: 'hackathon',
		title: 'Climathon',
		organization: 'Developer',
		startDate: '2021-11-11',
		endDate: '2021-11-12',
		description: {
			en: '4th Place. Development of an app for an ÖBB bonus program where saved CO2 can be exchanged for vouchers.',
			de: '4. Platz. Entwicklung einer App für ein Bonusprogramm der ÖBB, bei der gespartes CO2 in Gutscheine getauscht werden kann.',
		},
	},
];

/** Copy that belongs to the timeline itself rather than to one entry. */
export const careerUi = {
	pageTitle: {
		en: 'Career | Gnadlinger',
		de: 'Werdegang | Gnadlinger',
	},
	pageDescription: {
		en: 'The career of Johannes Gnadlinger — Backend Engineer at Raiffeisen Software GmbH since 2018, working on corporate payment systems and private banking platforms.',
		de: 'Der Werdegang von Johannes Gnadlinger — Backend Engineer bei der Raiffeisen Software GmbH seit 2018, mit Fokus auf Corporate Payment Systems und Private-Banking-Plattformen.',
	},
	heroTitle: { en: 'Career', de: 'Werdegang' },
	heroTagline: {
		en: 'My professional journey, projects, and achievements.',
		de: 'Mein beruflicher Weg, meine Projekte und Erfolge.',
	},
	filterLabel: { en: 'Filter by type', de: 'Nach Typ filtern' },
	filterAll: { en: 'All', de: 'Alle' },
	breadcrumb: { en: 'Career', de: 'Werdegang' },
	ongoing: { en: 'Present', de: 'heute' },
} as const satisfies Record<string, Translated>;

/** Visible label per entry type. */
export const typeLabels = {
	job: { en: 'Job', de: 'Anstellung' },
	project: { en: 'Project', de: 'Projekt' },
	'side-project': { en: 'Side Project', de: 'Nebenprojekt' },
	hackathon: { en: 'Hackathon', de: 'Hackathon' },
	certification: { en: 'Certification', de: 'Zertifizierung' },
	leave: { en: 'Parental Leave', de: 'Karenz' },
} as const satisfies Record<CareerType, Translated>;

/** Icon per entry type, matching the names in `IconPaths.ts`. */
export const typeIcons = {
	job: 'briefcase',
	project: 'code',
	'side-project': 'pencil-line',
	hackathon: 'trophy',
	certification: 'medal',
	leave: 'heart',
} as const satisfies Record<CareerType, string>;

/** The order the filter dropdown offers the types in. */
export const typeOrder: CareerType[] = [
	'job',
	'project',
	'certification',
	'leave',
	'hackathon',
	'side-project',
];

export const isOngoing = (entry: CareerEntry) => entry.endDate === ONGOING;

/** `2024` from an ISO date, or the localised "Present" for ongoing entries. */
export function yearLabel(value: string, lang: SiteLang): string {
	return value === ONGOING ? careerUi.ongoing[lang] : value.slice(0, 4);
}

/**
 * The entry as one line of prose, for the structured data. Phased entries have
 * no description of their own, so their phases supply it — the ItemList still
 * carries one item per card, which is what the page shows.
 */
export function entrySummary(entry: CareerEntry, lang: SiteLang): string {
	if (entry.phases?.length) {
		return entry.phases
			.map((phase) => {
				const range = `${yearLabel(phase.startDate, lang)}–${yearLabel(phase.endDate, lang)}`;
				return `${translate(phase.title, lang)} (${range}): ${translate(phase.description, lang)}`;
			})
			.join(' ');
	}
	return entry.description ? translate(entry.description, lang) : '';
}

/** Ongoing entries first, everything else newest start date first. */
export function sortedCareer(): CareerEntry[] {
	return [...CAREER].sort((a, b) => {
		if (isOngoing(a) !== isOngoing(b)) return isOngoing(a) ? -1 : 1;
		return new Date(b.startDate).valueOf() - new Date(a.startDate).valueOf();
	});
}
