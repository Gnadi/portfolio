/**
 * Raw WebGL2, no library: one full-screen triangle and a fragment shader.
 * See src/components/HeroCanvas.astro for what it is for.
 */

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;      // 0..1, y up
uniform float uMouseAmt;  // eases to 1 while the pointer is over the page
uniform vec3 uC1;
uniform vec3 uC2;
uniform float uDark;
uniform vec3 uClick;      // xy position, z = age in seconds (<0: none)
uniform float uScroll;
out vec4 o;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash(i), f), dot(hash(i + vec2(1, 0)), f - vec2(1, 0)), u.x),
             mix(dot(hash(i + vec2(0, 1)), f - vec2(0, 1)), dot(hash(i + vec2(1, 1)), f - vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float aspect = uRes.x / uRes.y;
  vec2 uv = frag / uRes;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);

  // The pointer pushes the field away from itself.
  vec2 d = p - m;
  float r = length(d);
  float push = exp(-r * r * 9.0) * uMouseAmt;
  p += normalize(d + 1e-4) * push * 0.16;

  // A click sends a ring through it.
  if (uClick.z >= 0.0) {
    vec2 c = (uClick.xy - 0.5) * vec2(aspect, 1.0);
    float rr = length(p - c);
    float ring = exp(-pow((rr - uClick.z * 0.75) * 7.0, 2.0)) * exp(-uClick.z * 1.7);
    p += normalize(p - c + 1e-4) * ring * 0.13;
  }

  float t = uTime * 0.06;
  vec2 q = p * 1.7 + vec2(0.0, uScroll * 0.35);
  // Domain warping gives the long, streaming shapes.
  vec2 w = vec2(fbm(q + vec2(t, 0.0)), fbm(q + vec2(5.2, 1.3) - t));
  float f = fbm(q + 2.2 * w + vec2(0.0, -t * 1.5));

  // Iso-lines of the field.
  float bands = f * 9.0;
  float fw = fwidth(bands) * 1.2;
  float line;
  float dist = abs(fract(bands) - 0.5);
  line = 1.0 - smoothstep(0.012, 0.012 + 0.045 + fw, dist);

  // Moving "packets" riding along the lines.
  float packet = smoothstep(0.82, 1.0, sin(bands * 3.1415 * 2.0 - uTime * 1.6 + w.x * 8.0) * 0.5 + 0.5);

  float glow = exp(-r * r * 5.0) * uMouseAmt;
  vec3 col = mix(uC1, uC2, clamp(f * 1.6 + 0.5 + glow * 0.4, 0.0, 1.0));
  float a = line * (0.34 + 0.55 * packet + 0.5 * glow);
  a *= mix(0.9, 1.0, uDark);
  // Calm behind the headline and the portrait, lively at the edges — and the
  // pointer always wins, so moving over the text still wakes the lines up.
  float textZone = exp(-pow(length((uv - vec2(0.3, 0.5)) * vec2(1.0, 1.6)) * 2.1, 2.0));
  if (aspect < 1.0) textZone = max(textZone, 0.7); // stacked layout: text spans the width
  a *= (1.0 - 0.82 * textZone * (1.0 - glow)) * 0.8;
  o = vec4(col * a, a);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
	const s = gl.createShader(type)!;
	gl.shaderSource(s, src);
	gl.compileShader(s);
	if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
		console.warn(gl.getShaderInfoLog(s));
		return null;
	}
	return s;
}

/** Resolve any CSS colour (tokens, hsl(), calc()) to 0..1 RGB. */
function readColor(probe: HTMLElement, token: string): [number, number, number] {
	probe.style.color = `var(${token})`;
	const m = getComputedStyle(probe).color.match(/[\d.]+/g) ?? ['0', '0', '0'];
	return [Number(m[0]) / 255, Number(m[1]) / 255, Number(m[2]) / 255];
}

export function heroShader() {
	const canvas = document.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
	if (!canvas) return;
	const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' });
	if (!gl) return;

	const vs = compile(gl, gl.VERTEX_SHADER, VERT);
	const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
	if (!vs || !fs) return;
	const prog = gl.createProgram()!;
	gl.attachShader(prog, vs);
	gl.attachShader(prog, fs);
	gl.linkProgram(prog);
	if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
	gl.useProgram(prog);

	const buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
	const loc = gl.getAttribLocation(prog, 'p');
	gl.enableVertexAttribArray(loc);
	gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

	const U = (n: string) => gl.getUniformLocation(prog, n);
	const uRes = U('uRes'), uTime = U('uTime'), uMouse = U('uMouse'), uMouseAmt = U('uMouseAmt');
	const uC1 = U('uC1'), uC2 = U('uC2'), uDark = U('uDark'), uClick = U('uClick'), uScroll = U('uScroll');

	const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const probe = document.createElement('i');
	probe.style.display = 'none';
	document.body.appendChild(probe);

	function applyColors() {
		const c1 = readColor(probe, '--accent-regular');
		const c2 = readColor(probe, '--link-color');
		gl!.uniform3f(uC1, ...c1);
		gl!.uniform3f(uC2, ...c2);
		gl!.uniform1f(uDark, document.documentElement.classList.contains('theme-dark') ? 1 : 0);
		if (!running) draw();
	}

	let w = 1, h = 1;
	function resize() {
		const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
		// Lines are soft; rendering at ~70% is invisible and keeps phones cool.
		const scale = dpr * (innerWidth < 700 ? 0.6 : 0.75);
		w = Math.max(2, Math.round(canvas!.clientWidth * scale));
		h = Math.max(2, Math.round(canvas!.clientHeight * scale));
		canvas!.width = w;
		canvas!.height = h;
		gl!.viewport(0, 0, w, h);
		gl!.uniform2f(uRes, w, h);
		if (!running) draw();
	}

	// Pointer, in the canvas's own 0..1 space. Eased so it feels liquid.
	let tx = 0.7, ty = 0.5, mx = 0.7, my = 0.5, amt = 0, amtTarget = 0;
	let clickX = 0, clickY = 0, clickT = -1;
	window.addEventListener('pointermove', (e) => {
		const r = canvas!.getBoundingClientRect();
		tx = (e.clientX - r.left) / r.width;
		ty = 1 - (e.clientY - r.top) / r.height;
		amtTarget = e.clientY >= r.top && e.clientY <= r.bottom ? 1 : 0;
	}, { passive: true });
	document.addEventListener('pointerleave', () => (amtTarget = 0));
	window.addEventListener('pointerdown', (e) => {
		const r = canvas!.getBoundingClientRect();
		if (e.clientY < r.top || e.clientY > r.bottom) return;
		clickX = (e.clientX - r.left) / r.width;
		clickY = 1 - (e.clientY - r.top) / r.height;
		clickT = 0;
	}, { passive: true });

	let running = false, visible = true, raf = 0, last = performance.now(), time = 0;
	function draw() {
		gl!.uniform1f(uTime, time);
		gl!.uniform2f(uMouse, mx, my);
		gl!.uniform1f(uMouseAmt, amt);
		gl!.uniform3f(uClick, clickX, clickY, clickT);
		gl!.uniform1f(uScroll, scrollY / Math.max(1, innerHeight));
		gl!.clearColor(0, 0, 0, 0);
		gl!.clear(gl!.COLOR_BUFFER_BIT);
		gl!.drawArrays(gl!.TRIANGLES, 0, 3);
	}
	function frame(now: number) {
		const dt = Math.min(0.05, (now - last) / 1000);
		last = now;
		time += dt;
		const k = 1 - Math.exp(-dt * 6);
		mx += (tx - mx) * k;
		my += (ty - my) * k;
		amt += (amtTarget - amt) * (1 - Math.exp(-dt * 3));
		if (clickT >= 0) { clickT += dt; if (clickT > 3) clickT = -1; }
		draw();
		raf = requestAnimationFrame(frame);
	}
	function start() {
		if (running || reduced) return;
		running = true;
		last = performance.now();
		raf = requestAnimationFrame(frame);
	}
	function stop() {
		running = false;
		cancelAnimationFrame(raf);
	}
	const sync = () => (visible && !document.hidden && !document.querySelector('dialog[open]') ? start() : stop());

	new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(canvas);
	document.addEventListener('visibilitychange', sync);
	new MutationObserver(sync).observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
	// Palette changes: theme toggle sets a class, the slam sets an attribute.
	new MutationObserver(applyColors).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-slam'] });
	new ResizeObserver(resize).observe(canvas);

	time = 8; // skip the field's flat first seconds
	applyColors();
	resize();
	draw();
	canvas.classList.add('ready');
	sync();
}
