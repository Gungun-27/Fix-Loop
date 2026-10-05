# FixLoop: tech stack and architecture

## Stack

| Layer | Choice | Why | What we passed on |
|---|---|---|---|
| App | One static `index.html`, plain JavaScript | Nothing to install or build, deploys by dropping a file. Right size for a one-person, one-day build. | React and Vite: more setup for no gain here |
| Rule engine | axe-core 4.10.2 from jsDelivr, version pinned | Open source, widely used, and the same rules many audit tools run | Writing our own checks |
| Isolation | Hidden same-origin iframe loaded with `srcdoc` | axe needs a real page with layout and computed styles, especially for contrast | Parsing the HTML without rendering it |
| Fixes | Plain JavaScript rules, no model calls | Same input gives the same output, every fix has a reason, and nothing leaves the browser | An LLM writing patches, which is hard to verify |
| Styling | CSS custom properties, light and dark themes | Small, no framework, easy to keep accessible | Tailwind or a component library |
| Type | Bricolage Grotesque, DM Sans and JetBrains Mono from Google Fonts, with system fallbacks | A distinct headline face, a readable body face, and a proper code face | |
| Hosting | GitHub Pages, Netlify Drop or Vercel (static) | Free and takes a minute | A server |
| Evidence scan | Node, Playwright, @axe-core/playwright, run on your laptop | Real browser, so JavaScript-built pages render | Running it in the app |

## How it works

```
 paste / upload / sample
          |
          v
   sanitise (DOMParser): remove scripts, frames, objects, embeds,
   base, meta refresh, on* handlers, javascript: values
          |
          v
   hidden iframe (srcdoc)  <-- inject axe-core <script>
          |
     scan #1 (axe: wcag2a, wcag2aa, wcag21a, wcag21aa, violations only)
          |
          v
   plan fixes: language | field names | link/button names | contrast
          |
   apply every fix to the iframe copy
          |
     scan #2
          |
   keep fix only if its rule no longer flags its element; undo the rest
          |
     scan #3 (only if something was undone)
          |
          v
   show: found / left / proven / new problems caused
   review screen -> untick -> export fixed page + fix list
```

**Contrast fixes.** axe reports the text colour, background colour and the ratio it needs. We move the text colour toward black (on a light background) or white (on a dark one) in small steps until the ratio passes, then write the new colour as an inline style.

**New-problems check.** After the final scan, we count violations (rule plus element) that were not in the first scan.

## Security notes

- The script remover is a plain removal pass, fine for a page you paste yourself on your own machine. If you ever let other people paste pages into a hosted version, add DOMPurify.
- The iframe is not sandboxed, because axe has to run inside it. That is why scripts are stripped first.
- Nothing is uploaded. The only network requests are axe-core and the fonts.

## Test checklist

Do these before you record the demo. Write down what you actually see.

1. **Sample page.** Expect the language, the unnamed fields and select, the icon button, the social link and the two low-contrast texts to be fixed, and the images and the unnamed image link to stay on the "needs a person" list. Exact counts depend on how axe groups them, so record the real numbers.
2. **Empty box.** Press **Check my page** with nothing pasted. You should see the "Add a page first" message.
3. **Untick.** Untick one fix, download the fixed page, and confirm that fix is missing from the file.
4. **Run twice.** Run the sample, then run it again. The second run should match the first.
5. **Scripts.** Paste a page with a script tag. The downloaded page should have none.
6. **Keyboard only.** Do the whole flow without a mouse.
7. **Dogfood.** Paste FixLoop's own source into FixLoop. Fix anything it finds in `index.html`.
8. **Dark mode.** Switch your system theme and check the text is still readable.
9. **Phone width.** Resize the window down to about 380px. Nothing should scroll sideways except code blocks.

## Deploy in three steps

```bash
git init && git add . && git commit -m "FixLoop"
git branch -M main
git remote add origin https://github.com/<you>/fixloop.git && git push -u origin main
```

Then turn on GitHub Pages (Settings > Pages > Deploy from branch > `main` / root) and add the link to the README.

## Evidence scan

See the README for the commands. The script scans each home page once with a two second pause between sites, uses `bypassCSP` so axe can run on strict pages, and ignores certificate errors because some public sites have them. Sites that fail to load are recorded as errors and left out of the percentages.
