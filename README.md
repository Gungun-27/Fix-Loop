# FixLoop

Accessibility fixes you can trust. FixLoop patches a barrier, scans the page again, and only keeps the fix if the barrier is really gone.

Built solo for the WCC Launchpad 30 hackathon (4-5 Oct 2026), Open Innovation track, Accessibility. Author: Gungun Rajeshwar Raut.

**Live demo:** _add your deployed link here_

## What it does

You give it a web page (paste the page code or upload a saved copy). FixLoop then:

1. Makes a safe copy of the page with its scripts removed.
2. Scans the copy with axe-core and lists the accessibility barriers.
3. Writes a small patch for each barrier it can fix safely.
4. Applies the patches and scans again.
5. Keeps only the patches that cleared the barrier, undoes the rest, and counts any new problems it caused.
6. Shows every kept fix as a before and after, plus a side-by-side picture of your page with the problems outlined. You untick what you don't want and download the result.

What it fixes today: form fields with no name, links and buttons with no name, a missing page language, and text with too little contrast. Everything else it finds (missing image descriptions, for example) goes on a "still needs a person" list with a link on how to fix it.

## Why not an overlay or a plain scanner?

A scanner tells you what is broken and leaves the fixing to you. An overlay widget promises one-click compliance, and the FTC fined one vendor $1 million over that kind of claim. FixLoop sits between the two: real patches you can read, a second scan as proof, and a person approving each one. It never says a page is compliant.

## Try it

1. Open `index.html` in a browser (or the live link above). It needs an internet connection for the axe-core engine and the fonts.
2. Click **Try it on a sample page**.
3. Look at the numbers, untick a fix, and download the fixed page.
4. To check your own page: open it in Chrome, right-click, choose View page source, copy everything, paste it into the box, and press **Check my page**.

## Deploy

It is one static file. Any of these works:

- **GitHub Pages:** push the repo, then Settings > Pages > Deploy from branch > `main` / root.
- **Netlify Drop:** drag the folder onto app.netlify.com/drop.
- **Vercel:** import the repo, no build command, output directory `./`.

## Scan public websites (our evidence)

`scripts/scan.mjs` loads each home page listed in `scripts/sites.txt` in a real browser, runs axe-core, and writes `data/scan-results.json` and `data/summary.md`.

```bash
npm init -y
npm i playwright @axe-core/playwright
npx playwright install chromium
# add 50 public home page URLs to scripts/sites.txt, then:
node scripts/scan.mjs
```

It loads each home page once, waits two seconds between sites, and never logs in. Publish the totals. Only name a site if you are comfortable doing so, and describe what you found as detected signals, not as a verdict.

## Known limits

- Pasted or uploaded page code only. There is no live URL box yet because a browser page can't fetch other sites.
- Scripts are removed, so pages that build their content with JavaScript can look empty.
- Style sheets linked by relative path don't load, so contrast results can be incomplete. Save the page with Ctrl+S, or paste a version with inline styles, for the best result.
- Field, link and button names are taken from the element's own attributes, class names or link. They are good starting points, and you should read each one.
- Image descriptions are never invented. They go on the "still needs a person" list.
- Automated checks cover only part of WCAG. A clean result is not a compliance certificate.
- The script remover is a simple pass for pages you paste yourself. Don't expose this tool to other people's untrusted input without adding DOMPurify.

## Project layout

```
index.html          the whole app
docs/PRD.md         what we are building and why
docs/TECH_STACK.md  how it works and how to deploy it
docs/DESIGN.md      look, layout and copy rules
scripts/scan.mjs    the 50-site scan
scripts/sites.txt   URLs to scan (you fill this in)
data/               scan output goes here
```

## AI assistance

This project was built with help from Claude (Anthropic), which the hackathon rules allow. Claude wrote the first version of the code, the scan script and these docs from my brief. _Before you submit, replace this line with what you reviewed, changed and tested yourself._
