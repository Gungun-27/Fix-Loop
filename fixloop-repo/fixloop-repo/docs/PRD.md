# FixLoop: product requirements

Version 1.0, 5 Oct 2026. Owner: Gungun Rajeshwar Raut. Status: hackathon build for WCC Launchpad 30.

## 1. Summary

FixLoop is a browser tool that checks a web page for common accessibility barriers, writes a fix for each one it can fix safely, scans the patched page again, and keeps only the fixes that cleared the problem. The owner approves every fix before exporting.

## 2. The problem

Accessibility audits tell a team what is broken but not how to fix it, so the same barriers stay on live pages for years.

What the evidence says:

- WebAIM's 2026 scan of the top million home pages found automatically detectable WCAG failures on 95.9% of them. Six kinds of error made up about 96% of everything detected: low contrast text (83.9% of pages), missing image descriptions (53.1%), missing form labels (51%), empty links (46.3%), empty buttons (30.6%) and a missing page language (13.5%). Source: https://webaim.org/projects/million/
- WebAIM also notes that these counts only cover what tools can detect, so real conformance is lower than the numbers suggest.
- In India, GIGW 3.0 (NIC, MeitY, 2023) sets WCAG 2.1 AA as the accessibility baseline for government websites. Explainer: https://accesssure.in/learn/gigw-3-0-explained/
- One-click "AI overlay" products have a bad record. The FTC ordered an overlay vendor to pay $1 million for claiming its tool could make any site WCAG compliant. Source: https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million

_Check each figure against its source before you quote it in the video or the submission. Swap the GIGW link for the NIC/MeitY original if you can find it._

Four of the six common categories (contrast, labels, empty links and buttons, language) have a fix that can be worked out from the page itself. That is where FixLoop starts.

## 3. Who it is for

These are assumptions until the survey in section 9 is done.

- **Primary:** people who look after a site without an accessibility specialist. Student and freelance web developers, college and club site maintainers, NGO volunteers, small business owners with a part-time web person.
- **Secondary:** reviewers who want a fast first pass before a full manual audit.

Their job to be done: "Tell me what is blocking people on my page, fix the easy things, and show me the fixes worked."

## 4. Goals and non-goals

**Goals**

- Fix the machine-detectable barriers that have a safe fix, and prove each fix with a second scan.
- Keep a person in charge: nothing ships without the owner seeing a before and after.
- Work with no setup and no account, with the page staying in the browser.
- Never overclaim. No "compliant" language anywhere.

**Non-goals**

- Certifying that a page meets WCAG or GIGW.
- An overlay widget that changes a live site.
- Writing image descriptions automatically.
- Crawling a whole site, accounts, or storing anyone's pages.

## 5. Scope

| Built in v1 | Not in v1 |
|---|---|
| Paste or upload page code, plus a one-click sample | Live URL scanning with a rendered page |
| Safe copy with scripts removed | AI-suggested image descriptions with approval |
| axe-core scan (WCAG 2.0 and 2.1, A and AA rules) | Patches written back to source files or a pull request |
| Four fix recipes (see FR4) | WCAG 2.2 rules |
| Apply, re-scan, keep only proven fixes, undo the rest | Whole-site batch dashboard |
| New-problems check | Hindi and Marathi interface |
| Review screen with untick boxes | |
| "Still needs a person" list with how-to links | |
| Download fixed page and fix list | |

## 6. User flow

1. Land on the page. Click **Try it on a sample page** or paste or upload your own.
2. Click **Check my page**. Progress messages appear: loading, scanning, re-scanning.
3. Read the four numbers: problems found, problems left, fixes proven, new problems caused.
4. Review each fix as a before and after. Untick any you don't want.
5. Read the "still needs a person" list.
6. Download the fixed page and the fix list.

## 7. Functional requirements

| ID | Requirement | Acceptance check |
|---|---|---|
| FR1 | Accept pasted page code or an uploaded .html/.htm file. | Empty input shows "Add a page first, or try the sample." |
| FR2 | Make a safe copy: remove scripts, frames, objects, embeds, base and meta refresh tags, inline event handlers and javascript: values. | A pasted page with a script tag shows no script in the scanned copy. |
| FR3 | Scan the copy with axe-core using the WCAG 2.0/2.1 A and AA tags, violations only. | The sample page returns violations. |
| FR4 | Fix recipes: (a) page language, set to en, or hi if the text is mostly Devanagari; (b) form field and select names, from placeholder, title, name or id; (c) link and button names, from title, image alt, svg title, or a known icon or site word in the class or link; (d) text contrast, nearest colour that passes. | Each recipe appears in the sample run, and a field with no usable attribute is left for a person. |
| FR5 | Apply all fixes, re-scan, keep a fix only if the same rule no longer flags the same element, undo the rest, re-scan again if anything was undone. | A deliberately useless patch is undone and does not appear in "fixes proven". |
| FR6 | Report problems in the final scan that were not in the first scan. | The number shows on screen and is 0 on the sample page. |
| FR7 | Show each kept fix with the opening tag before and after, the reason, and a tick box. | Unticking removes it from the export. |
| FR8 | List every remaining violation with count, impact and a how-to link. | Image descriptions appear here on the sample page. |
| FR9 | Export the fixed page (ticked fixes only) and a markdown fix list. | Both files download and open. |
| FR10 | State that a clean scan is not a compliance certificate, and avoid the word "compliant" as a claim. | The limits section is visible without scrolling past the results. |

## 8. Non-functional requirements

- **Privacy:** the page stays in the browser. The only network requests are the axe-core script and the fonts.
- **FixLoop is itself accessible:** keyboard reachable, visible focus, status messages announced, contrast of at least 4.5:1, reduced motion respected. Test it by running FixLoop on its own source.
- **Speed:** a typical page should return a result in a few seconds, with progress messages while it works.
- **Browsers:** current Chrome and Edge are the target. Test Firefox and Safari if there is time.

## 9. Evidence plan

Fill these in with real results. Don't submit the blanks.

**A. Scan of public home pages.** Run `scripts/scan.mjs` on about 50 public home pages (colleges, municipal bodies, hospitals, state department sites). Report:

| Measure | Result |
|---|---|
| Home pages scanned successfully | _fill in_ of _fill in_ |
| Pages with at least one detectable barrier | _fill in_ |
| Pages with at least one barrier in the categories FixLoop targets | _fill in_ |
| Median detectable problems per page | _fill in_ |
| Most common barrier | _fill in_ |

Say "detectable by automated checks on the home page", because that is all this measures.

**B. Short survey** of 30 or more people who build or look after a site (classmates, club web teams). Ask: Have you checked your site for accessibility? What did you use? Did you fix what it found? What stopped you? Report the counts you actually get.

**C. FixLoop's own results.** Run the sample and five real saved pages. Record problems found, problems left, fixes proven and new problems caused.

## 10. Success measures

- Of the problems found in the categories FixLoop targets, how many end as proven fixes.
- New problems caused should be 0 on every test page.
- Time from click to result.
- For the hackathon: a deployed link, a working one-click demo, the evidence tables filled in, and the limits stated plainly.

## 11. Risks

| Risk | What we do about it |
|---|---|
| A guessed name is wrong or awkward | The reason text says to confirm the wording, and every fix has a tick box. |
| Pages built with JavaScript look empty | Say so in the limits. Playwright-rendered scanning is the next step. |
| Contrast is wrong when linked style sheets don't load | Say so, and ask for a saved copy. |
| Someone reads a clean result as "compliant" | No such wording anywhere, and the limits section says the opposite. |
| Sites block the scan script | Failed sites are listed as errors and left out of the percentages. |
| Naming sites looks like shaming | Publish totals. Name sites only with care, as detected signals. |
| The CDN is down during the demo | Record the demo video first, and keep a copy of the result screen. |

## 12. How this maps to the judging criteria

This is the aim, not a predicted score.

| Criterion | Where FixLoop answers it |
|---|---|
| User insight and problem evidence (15) | Our own scan of public sites, the survey, and the WebAIM data |
| Strength of the core solution (24) | One workflow from page in to proven fixes out |
| Technical depth and reliability (24) | The apply, re-scan, undo loop, the contrast solver, the new-problems check |
| Originality and differentiation (15) | Proof by re-scan, with no overlay and no compliance claim |
| Real-world usability (12) | One-click sample, plain wording, no setup |
| Responsible design and trust (10) | A person approves, no compliance claims, nothing leaves the browser |

## 13. After the hackathon

Live URL scanning with a rendered page, pull requests against a real repo, optional AI-written image descriptions that always need approval, WCAG 2.2 rules, and a batch dashboard for a whole site.
