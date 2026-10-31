/**
 * The site's motion layer. One module, loaded on every page from BaseLayout.
 *
 * Everything here is enhancement: the pages are complete static HTML, and the
 * hidden "before" states in src/styles/motion.css only apply while the
 * `js-motion` class is on <html> — which a tiny inline script sets, and only
 * when the visitor has not asked for reduced motion. No class, no motion, no
 * Lenis, no cursor: the page simply is what the markup says.
 *
 * What lives here:
 *   - Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and the
 *     scroll position never disagree
 *   - the hero's kinetic-type intro and portrait reveal
 *   - scroll-triggered reveals, masked word-by-word headings, scrubbed
 *     timeline line, velocity-reactive marquee, scroll progress bar
 *   - pointer effects on fine-pointer devices only: trailing cursor, magnetic
 *     buttons, 3D tilt with a light that follows the pointer
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const root = document.documentElement;
const motionOn = root.classList.contains('js-motion');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Split an element's text into masked words (and optionally letters). The
 *  original text goes into aria-label so screen readers read it once, whole. */
function split(el: HTMLElement, chars = false): HTMLElement[] {
	const text = el.textContent ?? '';
	el.setAttribute('aria-label', text.replace(/\s+/g, ' ').trim());
	el.textContent = '';
	const inner: HTMLElement[] = [];
	text.trim().split(/\s+/).forEach((word, i, all) => {
		const outer = document.createElement('span');
		outer.className = 'sw';
		outer.setAttribute('aria-hidden', 'true');
		const make = (s: string) => {
			const span = document.createElement('span');
			span.className = 'si';
			span.textContent = s;
			inner.push(span);
			return span;
		};
		if (chars) {
			for (const ch of Array.from(word)) outer.appendChild(make(ch));
		} else {
			outer.appendChild(make(word));
		}
		el.appendChild(outer);
		if (i < all.length - 1) el.appendChild(document.createTextNode(' '));
	});
	return inner;
}

function init() {
	gsap.registerPlugin(ScrollTrigger);

	/* ── Smooth scroll ─────────────────────────────────────────── */
	const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, anchors: true });
	lenis.on('scroll', ScrollTrigger.update);
	gsap.ticker.add((t) => lenis.raf(t * 1000));
	gsap.ticker.lagSmoothing(0);

	// A modal <dialog> (the game, the screenshot lightbox) owns the wheel.
	new MutationObserver(() => {
		document.querySelector('dialog[open]') ? lenis.stop() : lenis.start();
	}).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });

	/* ── Scroll progress ───────────────────────────────────────── */
	const bar = document.querySelector<HTMLElement>('[data-progress]');
	if (bar) {
		gsap.to(bar, {
			scaleX: 1,
			ease: 'none',
			scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
		});
	}

	/* ── Hero intro ────────────────────────────────────────────── */
	const title = document.querySelector<HTMLElement>('[data-hero-title]');
	const intro = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 });
	if (title) {
		const letters = split(title, true);
		intro.from(letters, {
			yPercent: 120,
			rotate: 8,
			duration: 1.25,
			stagger: { each: 0.018, from: 'start' },
		}, 0);
	}
	const heroBits = gsap.utils.toArray<HTMLElement>('[data-hero-bit]');
	if (heroBits.length) {
		intro.fromTo(heroBits, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12 }, 0.45);
	}
	const portrait = document.querySelector<HTMLElement>('[data-portrait]');
	if (portrait) {
		const img = portrait.querySelector('img');
		intro.fromTo(portrait, { clipPath: 'inset(100% 0% 0% 0% round 14px)' }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', duration: 1.5, ease: 'expo.inOut' }, 0.2);
		if (img) intro.fromTo(img, { scale: 1.35 }, { scale: 1.08, duration: 1.8, ease: 'expo.out' }, 0.2);
		// Scroll parallax: the photo drifts against the page.
		if (img) {
			gsap.to(img, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: portrait, start: 'top bottom', end: 'bottom top', scrub: true } });
		}
	}
	// Whatever else (career/work hero) — the same bits animate in.
	const settle = () => root.classList.add('motion-ready');
	intro.eventCallback('onComplete', settle);
	setTimeout(settle, 4000);

	/* ── Generic reveals ───────────────────────────────────────── */
	ScrollTrigger.batch('[data-reveal]', {
		start: 'top 90%',
		once: true,
		onEnter: (els) =>
			gsap.to(els, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
	});

	/* Headings: masked word-by-word rise. */
	gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
		const words = split(el);
		gsap.from(words, {
			yPercent: 115,
			duration: 1.1,
			ease: 'expo.out',
			stagger: 0.06,
			scrollTrigger: { trigger: el, start: 'top 88%', once: true },
		});
	});

	/* Timeline: the line draws as you read, markers pop as the line reaches them. */
	const timeline = document.querySelector<HTMLElement>('.timeline');
	if (timeline) {
		const line = document.createElement('div');
		line.className = 'timeline-progress';
		line.setAttribute('aria-hidden', 'true');
		timeline.prepend(line);
		gsap.fromTo(line, { scaleY: 0 }, {
			scaleY: 1, ease: 'none', transformOrigin: 'top',
			scrollTrigger: { trigger: timeline, start: 'top 60%', end: 'bottom 60%', scrub: 0.4 },
		});
		timeline.querySelectorAll<HTMLElement>('.timeline-item').forEach((item) => {
			const marker = item.querySelector('.timeline-marker');
			const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 85%', once: true } });
			tl.from(item, { autoAlpha: 0, x: 40, duration: 0.9, ease: 'expo.out' });
			if (marker) tl.from(marker, { scale: 0.2, duration: 0.8, ease: 'back.out(2.4)' }, 0.1);
		});
	}

	/* Contact call-to-action: the logo turns with the scroll. */
	document.querySelectorAll<HTMLElement>('aside img').forEach((img) => {
		gsap.fromTo(img, { rotate: -8, scale: 0.9 }, {
			rotate: 8, scale: 1, ease: 'none',
			scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true },
		});
	});

	/* ── Marquee: speed and skew follow the scroll velocity ───── */
	document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((m) => {
		const track = m.querySelector<HTMLElement>('[data-marquee-track]');
		if (!track) return;
		const tween = gsap.to(track, { xPercent: -50, ease: 'none', duration: 38, repeat: -1 });
		const skew = gsap.quickTo(m, 'skewX', { duration: 0.5, ease: 'power3.out' });
		lenis.on('scroll', ({ velocity }: { velocity: number }) => {
			const v = gsap.utils.clamp(-40, 40, velocity);
			gsap.to(tween, { timeScale: 1 + Math.abs(v) * 0.5, duration: 0.3, overwrite: true });
			gsap.to(tween, { timeScale: 1, duration: 1.4, delay: 0.3 });
			skew(-v * 0.18);
		});
		ScrollTrigger.create({ trigger: m, onToggle: (s) => (s.isActive ? tween.resume() : tween.pause()) });
	});

	/* ── Pointer effects (fine pointers only) ──────────────────── */
	if (finePointer) {
		pointerEffects();
	}

	// Back/forward cache and late-loading images move things around.
	addEventListener('pageshow', (e) => e.persisted && ScrollTrigger.refresh());
	addEventListener('load', () => ScrollTrigger.refresh());
}

function pointerEffects() {
	root.classList.add('has-cursor');

	/* Trailing cursor: a dot that is the pointer, a ring that follows. */
	const ring = document.createElement('div');
	ring.className = 'cursor-ring';
	const dot = document.createElement('div');
	dot.className = 'cursor-dot';
	const label = document.createElement('span');
	ring.appendChild(label);
	ring.setAttribute('aria-hidden', 'true');
	dot.setAttribute('aria-hidden', 'true');
	document.body.append(ring, dot);

	const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
	const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
	const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' });
	const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' });
	addEventListener('pointermove', (e) => {
		root.classList.add('cursor-on');
		rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY);
		const target = e.target as Element | null;
		const labelled = target?.closest<HTMLElement>('[data-cursor]');
		const interactive = target?.closest('a, button, summary, select, label, [role="button"]');
		label.textContent = labelled?.dataset.cursor ?? '';
		ring.classList.toggle('is-label', !!labelled);
		ring.classList.toggle('is-link', !!interactive && !labelled);
	}, { passive: true });
	document.addEventListener('pointerleave', () => root.classList.remove('cursor-on'));
	addEventListener('pointerdown', () => ring.classList.add('is-down'));
	addEventListener('pointerup', () => ring.classList.remove('is-down'));

	/* Magnetic: the element leans towards the pointer, then springs back. */
	document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
		const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.5)' });
		const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.5)' });
		el.addEventListener('pointermove', (e) => {
			const r = el.getBoundingClientRect();
			x((e.clientX - (r.left + r.width / 2)) * 0.3);
			y((e.clientY - (r.top + r.height / 2)) * 0.4);
		});
		el.addEventListener('pointerleave', () => { x(0); y(0); });
	});

	/* Tilt: 3D lean with a light that follows the pointer. The lean is driven
	   through CSS variables so it composes with the cards' own transforms. */
	document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
		const max = Number(el.dataset.tilt) || 6;
		el.addEventListener('pointermove', (e) => {
			const r = el.getBoundingClientRect();
			const px = (e.clientX - r.left) / r.width;
			const py = (e.clientY - r.top) / r.height;
			gsap.to(el, {
				'--rx': `${(0.5 - py) * max * 2}deg`,
				'--ry': `${(px - 0.5) * max * 2}deg`,
				'--mx': `${px * 100}%`,
				'--my': `${py * 100}%`,
				duration: 0.4, ease: 'power3.out', overwrite: 'auto',
			});
		});
		el.addEventListener('pointerleave', () => {
			gsap.to(el, { '--rx': '0deg', '--ry': '0deg', duration: 0.9, ease: 'elastic.out(1, 0.6)', overwrite: 'auto' });
		});
	});
}

if (motionOn) {
	init();
}
