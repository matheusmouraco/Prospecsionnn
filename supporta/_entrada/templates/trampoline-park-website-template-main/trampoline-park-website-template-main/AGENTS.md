# AGENTS.md: trampoline park website template

Website for a trampoline park or indoor family activity venue. One file, `index.html`, with inline CSS and scripts (GSAP, ScrollTrigger, Lenis from jsDelivr); no build step, and none is needed for copy, colour or photo edits.

## Files
Edit these files, not a page fetched by URL (that arrives as a summary).
```bash
curl -LO https://raw.githubusercontent.com/8bsite/trampoline-park-website-template/main/index.html
curl -LO https://raw.githubusercontent.com/8bsite/trampoline-park-website-template/main/AGENTS.md
curl -LO https://raw.githubusercontent.com/8bsite/trampoline-park-website-template/main/LICENSE
curl -LO https://raw.githubusercontent.com/8bsite/trampoline-park-website-template/main/CREDITS.md
```
Upload `index.html`, LICENSE and CREDITS.md; not this file, README.md or `previews/`.

## Keep
- Every `id`, `data-8b-section`, `data-8b-motion` and `data-8b-part` (`section:<id>` styles, `scene:<id>` animation).
- Selectors the scripts use:
  - `section-script:nav`: `.nav__menu` `.menu__close` `.menu__list`
  - `section-script:contact`: `.ct__form` `.ct__status` `data-error` `data-sent`
  - `scene:opening`: `.op__jumper` `.op__title-in` `.op__sticker` `.op__wave` `.op__fan` `.op__card` `.op__bed`
  - `scene:zones`: `.zn__row` `.zn__disc` `.zn__name` `.zn__body`
  - `scene:airtime`: `.at__img` `.at__line` `.at__text`
  - `scene:sessions`: `.ss__title` `.ss__ticket--glow`
  - `scene:parties`: `.pt__route` `.pt__ball` `.pt__ball-in` `.pt__stop` `.pt__pop` `.pt__dash` `.pt__trail` `.pt__stops`
  - `scene:league`: `.lg__rows` `data-week`
  - `scene:prices`: `.pr__row`
  - `scene:faq`: `.fq__list` `.fq__mark` `.fq__item`
  - `scene:footer`: `.ft__mark-wrap` `.ft__mark` `.ft__disc`
- `style="--len:N"` = characters in that display line, spaces included: `Bounce` is 6, `Hopla` is 5.
- The wavy section edges are inline SVGs (class m-wave); each coloured section starts with one. Their colour follows the section's background.
- The sessions background colour run and the Glow Night glow use --color-4, --color-5, --color-2 and --color-3: recolour through the tokens and the run follows.
- The rules and the FAQ mention an online waiver, but the page has no waiver link: add one if you use a waiver service, or edit the text.
- Colours and fonts are variables in `:root` (`data-8b-part="tokens"`): `--color-1` #f5e3cd (cream page background), `--color-2` #e2130f (red headings, buttons and red bands), `--color-3` #1b1b1b (text and the dark league band), `--color-4` #ffd750 (yellow stickers and yellow bands), `--color-5` #f4a804 (amber party route and timetable shade), `--color-6` #ffffff (white outlines on headings, photo frames, ticket cards and rule stickers); body text needs 4.5:1 contrast.
- With reduced motion the page must read in full.
- Keep the header comment and `<meta name="generator">`. Keep the "Design: 8B" footer link unless the site owner asks to remove it.

## Replace
- `data-8b-placeholder` (og-image, favicon, phone, email, form): real value in, attribute out; no value, remove the row (no image: drop `og:image`, set `twitter:card` to `summary`).
- Book (nav), Book a jump (first screen and prices): now #contact; owner's target: your online booking page.
- Book a party (parties): now #contact; owner's target: your party booking page or enquiry form.
- Enter this month's league (league): now #contact; owner's target: your league entry form, or remove the link.
- The form in `#contact` (fields `name`, `email`, `date`, `jumpers`, `session`) sends nothing; `section-script:contact` validates it and shows the thank-you text. Formspree: `action="https://formspree.io/f/<id>"` and `fetch` POST `new FormData(form)` first. Netlify: `data-netlify="true"` and a hidden `form-name`. Or delete it and the script.
- The name Hopla (any letter case); the favicon letter and colours in `<link rel="icon">`.
- Photos (28, Unsplash: opening 4, zones 6, airtime 1, sessions 5, parties 5, landing 2, league 1, rules 1, footer 3): `src`, no `srcset`/`sizes`, `width`/`height` to the ratio, `alt`, CREDITS.md.
- `<title>`, meta description, og tags.

## Ask the owner for
All demo text, never to be invented:
- Place: an indoor park in an old steel shed in Sheffield; the address "Unit 3, Furnace Yard, Sheffield S3" (menu overlay, contact, footer); Sheffield also in the page title, meta description and the hidden text of the first heading (opening).
- Directions: forty free parking spaces in the yard and the Shalesmoor tram stop two minutes away (faq "Where do we park?", contact, "Free parking" sticker).
- Phone and email (replaced with placeholders) in the menu overlay, faq, contact and footer.
- Opening hours: Monday to Thursday 9:30 to 20:00, Friday 9:30 to 22:00, Saturday 9:00 to 22:00, Sunday 9:00 to 19:00 (contact); "Open 7 days" sticker and "Late nights on Fridays and Saturdays" (opening).
- Session times: Little Hops weekdays 9:30 to 12:00, Open Jump every day 12:00 to 16:00, After School weekdays 16:00 to 18:30, Rebound Tue and Thu 18:45 to 19:30, Glow Night Fri and Sat 19:30 to 22:00 (sessions); dodgeball leagues on Mondays and ninja coaching on Wednesdays (sessions); a quiet hour every Sunday at nine (faq).
- Pass prices: Hour Jump £14, Long Jump £18, Little Hops £8.50, Glow Night £16 (two and a half hours, 13+), Frequent Flyer £29 a month with unlimited Open Jump and a monthly guest pass (prices); grip socks £2.50 (rules, prices).
- Party offer: from £19 per child, ten jumpers minimum, invitations included, ninety minutes, an hour on the courts with a coach, the party room for forty-five minutes, pizza, squash, fruit, party bags and a balloon for every guest (parties).
- Café menu prices: flat white £3.10, hot chocolate £3.40, cheese toastie £5.20, kids' pizza slice £3.80, slushie £2.60, fruit pot £2.20; hot food all day, free Wi-Fi, a plug at every table, high chairs, a changing room (landing).
- Ages: "Ages 3 to 93" (opening); zone ages All ages, 6+, 7+, 8+, 6+, Under 5s (zones); session ages Under 5s with a grown-up, 5 and up, 7 to 16, Adults 16+, 13 and up (sessions); children under eight need a grown-up in the building, waivers for under-18s signed by a parent or carer (faq).
- Venue numbers: sixty-two linked trampolines and a foam pit "the size of a swimming pool" (opening); forty linked beds, nine thousand foam blocks, twelve obstacles, three slam-dunk runways (zones, league); "Six zones" (opening sticker).
- Free things and promises: spectators never pay, one grown-up jumps free with every child under five, free entry for carers, free lockers, coaches on every court, "we'll email back within the hour" (landing, sessions, prices, faq, rules, contact form text and its data-sent message).
- Rules and policies: online waiver that lasts a year, only birthday cakes may be brought in, the café caters for most allergies, step-free access to the café, toilets and two of the courts, walk-ins when there is space (rules, faq).
- League: six named people with times (Maisie R. 41.82 s, Dev P. 42.10 s, Tomasz K. 43.57 s, Ruby A. 44.03 s, Kwame O. 45.66 s, Lou B. 46.20 s), the caption "October, after four Sundays", the table settling every Sunday night and the prize of a year of free jumping (league).
- Company: "© 2026 Hopla Trampoline Park Ltd" (footer).

## Known limits
- Without motion (reduce motion or no JavaScript) the sessions section stays on the yellow morning ground; with motion it ends on the night ground. Both are complete and readable.
- The footer wordmark stays split into letters (SplitText) after it lands; this is invisible but shows in the DOM.
- The league note under the table describes the animation ("Rows start in last Sunday's order…"); edit or remove it with the rows.

## Check
375 and 1440 px, reduced motion on, console clean; `data-8b-placeholder` and Hopla left only in class names.
