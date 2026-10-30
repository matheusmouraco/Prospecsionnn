(function () {
var WA = '5511930201546';
document.querySelectorAll('a.wa').forEach(function (a) {
a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(a.dataset.msg || 'Olá!');
a.target = '_blank'; a.rel = 'noopener';
});
document.getElementById('ano').textContent = new Date().getFullYear();
// manifesto words
var m = document.getElementById('mani');
m.innerHTML = m.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var loader = document.getElementById('loader');
var words = m.querySelectorAll('.w');
// nav hide on scroll down
var nav = document.getElementById('nav'), lastY = 0;
function onScroll(y) {
nav.classList.toggle('solid', y > 40);
nav.classList.toggle('hide', y > 500 && y > lastY);
lastY = y;
}
if (!window.gsap || !window.ScrollTrigger || reduce) {
if (loader) loader.remove();
words.forEach(function (w) { w.classList.add('on'); });
window.addEventListener('scroll', function () { onScroll(window.scrollY); }, { passive: true });
return;
}
gsap.registerPlugin(ScrollTrigger);
var lenis = window.Lenis ? new Lenis({ lerp: 0.1 }) : null;
if (lenis) {
lenis.on('scroll', function (e) { ScrollTrigger.update(); onScroll(e.scroll); });
gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
gsap.ticker.lagSmoothing(0);
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
a.addEventListener('click', function (e) {
var id = a.getAttribute('href'); if (id.length < 2) return;
var t = document.querySelector(id); if (!t) return;
e.preventDefault(); lenis.scrollTo(t, { offset: 0, duration: 1.4 });
});
});
} else {
window.addEventListener('scroll', function () { onScroll(window.scrollY); }, { passive: true });
}
// intro
var pct = document.getElementById('pct'), cnt = { v: 0 };
var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
tl.to('.loader img', { opacity: 1, scale: 1, duration: 1, startAt: { scale: .92 } }, 0)
.to('.loader .bar', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' }, 0)
.to(cnt, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: function () { pct.textContent = String(Math.round(cnt.v)).padStart(3, '0'); } }, 0)
.to('.loader', { yPercent: -100, duration: 1, ease: 'expo.inOut', onComplete: function () { loader.remove(); } }, 1.25)
.from('.big span', { yPercent: 110, opacity: 0, duration: 1.4, stagger: .05 }, 1.55)
.from('#car', { xPercent: 12, opacity: 0, filter: 'blur(14px)', duration: 1.8 }, 1.6)
.from('.hero h1 .ln > span', { yPercent: 105, duration: 1.2, stagger: .09 }, 1.9)
.from('.hero .side > *, .hero .meta, .nav .wrap > *', { y: 22, opacity: 0, duration: 1, stagger: .06 }, 2.1);
// hero scroll
gsap.to('#car', { scale: 1.14, yPercent: -62, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
gsap.to('.big', { xPercent: -14, opacity: .3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
gsap.to('.hero .bottom', { yPercent: -40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '20% top', end: '80% top', scrub: true } });
// marquee, speed follows scroll velocity
var track = document.getElementById('track'), grp = track.firstElementChild;
track.appendChild(grp.cloneNode(true)); track.appendChild(grp.cloneNode(true));
var x = 0, speed = 1, dir = 1;
ScrollTrigger.create({ onUpdate: function (s) { dir = s.direction; speed = 1 + Math.min(Math.abs(s.getVelocity()) / 220, 7); } });
gsap.ticker.add(function () {
var w = grp.offsetWidth; x -= 1.1 * speed * dir; speed += (1 - speed) * .06;
if (x <= -w) x += w; if (x > 0) x -= w;
track.style.transform = 'translate3d(' + x + 'px,0,0)';
});
// manifesto words light up
ScrollTrigger.create({ trigger: '#mani', start: 'top 80%', end: 'bottom 45%', scrub: true,
onUpdate: function (s) { var n = Math.round(s.progress * words.length); words.forEach(function (w, i) { w.classList.toggle('on', i < n); }); } });
// generic reveals
gsap.utils.toArray('.lab, .svc .txt > :not(h2), .vs .grid, .vs .after, .proc .row, details, .mani .foot, footer .top > div').forEach(function (el) {
gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
});
gsap.utils.toArray('.svc h2, .faq h2, .ben .intro h2').forEach(function (el) {
gsap.from(el, { yPercent: 30, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
});
// insulfilm diagram: rays travel in, part passes, part bounces back
function draw(sel) {
document.querySelectorAll(sel).forEach(function (p) { var l = p.getTotalLength(); p.style.strokeDasharray = p.classList.contains('uv') ? '' : l; if (!p.classList.contains('uv')) p.style.strokeDashoffset = l; });
}
draw('#visIns .ray');
var ti = gsap.timeline({ scrollTrigger: { trigger: '#visIns', start: 'top 70%' } });
ti.from('#visIns .sun', { scale: 0, transformOrigin: '118px 128px', duration: 1, ease: 'back.out(2)' })
.to('#visIns .ray.in:not(.uv)', { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: .12 }, .3)
.from('#visIns .ray.uv', { opacity: 0, duration: .8, stagger: .12 }, .3)
.from('#visIns .film', { scaleX: 0, transformOrigin: '330px 340px', duration: .8 }, .5)
.to('#visIns .ray.out', { strokeDashoffset: 0, duration: .9, ease: 'power2.out', stagger: .15 }, 1.2)
.from('#visIns .ray.bk', { opacity: 0, duration: .8, stagger: .15 }, 1.2)
.from('#visIns .tag', { opacity: 0, y: 8, duration: .7, stagger: .12 }, 1.6);
// ppf diagram: layers separate as you scroll
var tp = gsap.timeline({ scrollTrigger: { trigger: '#visPpf', start: 'top 75%', end: 'bottom 35%', scrub: 1 } });
tp.from('#visPpf .l1', { y: -40, ease: 'none' }, 0)
.to('#visPpf .l1', { y: -60, ease: 'none' }, 0)
.to('#visPpf .l2', { y: -20, ease: 'none' }, 0)
.to('#visPpf .l3', { y: 20, ease: 'none' }, 0)
.to('#visPpf .l4', { y: 60, ease: 'none' }, 0)
.to('#visPpf .tag:nth-of-type(1)', { y: -60, ease: 'none' }, 0)
.to('#visPpf .tag:nth-of-type(2)', { y: -20, ease: 'none' }, 0)
.to('#visPpf .tag:nth-of-type(3)', { y: 20, ease: 'none' }, 0)
.to('#visPpf .tag:nth-of-type(4)', { y: 60, ease: 'none' }, 0)
.fromTo('#visPpf .hits circle', { y: -60, opacity: 0 }, { y: 60, opacity: 1, ease: 'power1.in', stagger: .1 }, 0);
// benefits: horizontal scroll on desktop
var mm = gsap.matchMedia();
mm.add('(min-width: 1001px)', function () {
var rail = document.getElementById('rail');
gsap.to(rail, { x: function () { return -(rail.scrollWidth - window.innerWidth); }, ease: 'none',
scrollTrigger: { trigger: '#beneficios', start: 'top top', end: function () { return '+=' + (rail.scrollWidth - window.innerWidth); }, pin: true, scrub: 1, invalidateOnRefresh: true } });
});
mm.add('(max-width: 1000px)', function () {
var rail = document.getElementById('rail');
rail.style.width = 'auto'; rail.style.flexDirection = 'column';
gsap.utils.toArray('.bc').forEach(function (el) { gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } }); });
return function () { rail.style.width = ''; rail.style.flexDirection = ''; };
});
// final
gsap.from('.end .bgcar', { yPercent: 18, scale: .9, ease: 'none', scrollTrigger: { trigger: '.end', start: 'top bottom', end: 'bottom bottom', scrub: true } });
gsap.from('.end .lg, .end h2, .end p, .end .ctas', { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: .1, scrollTrigger: { trigger: '.end', start: 'top 65%' } });
// faq smooth open
document.querySelectorAll('details').forEach(function (d) {
var s = d.querySelector('summary'), a = d.querySelector('.a');
s.addEventListener('click', function (e) {
e.preventDefault();
if (d.open) { gsap.to(a, { height: 0, duration: .5, ease: 'expo.out', onComplete: function () { d.open = false; a.style.height = ''; ScrollTrigger.refresh(); } }); }
else { d.open = true; gsap.from(a, { height: 0, duration: .7, ease: 'expo.out', onComplete: function () { ScrollTrigger.refresh(); } }); }
});
});
// cursor + magnetic buttons
if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
var cur = document.getElementById('cur');
var qx = gsap.quickTo(cur, 'x', { duration: .25, ease: 'power3' }), qy = gsap.quickTo(cur, 'y', { duration: .25, ease: 'power3' });
window.addEventListener('mousemove', function (e) { qx(e.clientX); qy(e.clientY); });
document.querySelectorAll('a, button, summary').forEach(function (el) {
el.addEventListener('mouseenter', function () { cur.classList.add('big'); });
el.addEventListener('mouseleave', function () { cur.classList.remove('big'); });
});
document.querySelectorAll('.btn').forEach(function (b) {
b.addEventListener('mousemove', function (e) { var r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4, ease: 'power3' }); });
b.addEventListener('mouseleave', function () { gsap.to(b, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' }); });
});
}
window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
