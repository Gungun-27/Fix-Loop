# FixLoop: design doc

## Intent

The tool has one job: make a slightly dull task (fixing accessibility) feel clear and trustworthy. The look borrows from editorial event posters: a dark navy opening, cream working areas, bold uppercase labels, and tilted tape strips. The tape and the four-step card are the memorable parts. Everything else stays quiet so the numbers and the before and after are easy to read.

## Who it speaks to

Someone who looks after a site and isn't an accessibility expert. So the page says "page" instead of "DOM", "problems" instead of "violations", and "fixed, then proven" instead of anything about compliance.

## Layout

Desktop opening:

```
+--------------------------------------------------------------+
| Accessibility checker that proves its fixes                  |
| Fix it. Then prove it worked.            +----------------+  |
| Add a web page. FixLoop finds ...        | 1 Scan         |  |
| [Try it on a sample page]  Check mine    | 2 Fix          |  |
|                                          | 3 Scan again   |  |
|                                          | 4 Keep         |  |
| ///// tape: FIND IT > FIX IT > ... ///// +----------------+  |
+--------------------------------------------------------------+
| Step 1: Add your page      [ textarea ]   [Check my page]    |
| Step 2: What we fixed      [4 numbers] [fix cards] [needs..] |
| Honest limits                                                |
+--------------------------------------------------------------+
```

On narrow screens the hero stacks (text first, card second) and the stat cards wrap. Text is left aligned everywhere. Lines stay under about 70 characters.

## Visual system

| Token | Light | Dark | Use |
|---|---|---|---|
| Background | `#f2ede3` | `#0d1426` | page |
| Ink | `#17203a` | `#eee9dd` | body text |
| Muted | `#454d62` | `#b4bbd0` | labels, helper text |
| Card | `#ffffff` | `#172040` | input and result cards |
| Line | `#cfc8b8` | `#2c3760` | borders |
| Navy | `#121e3a` | same | hero, primary button |
| Red | `#b8141f` | `#ff8a92` | headings, links, problem edge |
| Lime | `#d9f25c` | same | main call to action, tape |
| Pink | `#f4a6b7` | same | second tape, card shadow |
| Olive | `#8fb800` | same | "proven" edge |

Contrast of the main pairs, calculated with the WCAG formula: ink on cream 13.8, muted on cream 7.2, red on cream 5.7, cream on navy 14.1, navy on lime 13.2, navy on pink 8.6, and in dark mode ink 15.1, muted 9.6, red 8.1. All are above the 4.5 minimum for normal text.

**Type.** Bricolage Grotesque (800 weight) for the headline, section headings, numbers and tape. DM Sans for body text, labels and buttons. JetBrains Mono for page code and diffs only. Headline scales with `clamp(44px, 8vw, 82px)`.

**Shape.** 2px borders, hard offset shadows (no soft blur), corners of 6px on controls and 12px on the main cards. The loop card and tape are rotated a little to break the grid on purpose, and that is the only place rotation is used.

## Components

- **Tape strips:** decorative, hidden from screen readers, never carry information.
- **Loop card:** a real ordered list (Scan, Fix, Scan again, Keep) so screen readers get the same explanation.
- **Drop area:** one card with a labelled textarea, three buttons and a "How do I get my page?" disclosure.
- **Stat cards:** four numbers with a coloured top edge. Problems found is red, fixes proven is olive.
- **Fix card:** tick box with the fix type, the element selector, the tag before (red) and after (green), and a one-line reason.
- **Progress chips:** Scan, Fix, Scan again, Keep light up while the loop runs.
- **Severity bars:** problems before (faint) and after (solid) for critical, serious, moderate and minor.
- **Before and after preview:** two scaled pictures of the page. Red outline is a problem, green is a proven fix, dashed amber still needs a person.
- **Needs-a-person card:** problem name, how many, how serious, and a "How to fix this" link.

## States

| State | What shows |
|---|---|
| Empty | "Nothing scanned yet." |
| Running | Status line changes: loading, scanning, re-scanning. Button disabled. |
| Done | Message with the totals, the results appear, the page scrolls to them, and the numbers count up. |
| No safe fixes | "No safe automatic fixes were found for this page." |
| Nothing left | A note that a person still needs to test with a keyboard and a screen reader. |
| Error | Says what went wrong in plain words, such as the engine failing to load because of the connection. |

## Motion

Only two moments: the numbers counting up when results arrive, and the smooth scroll to the results. Both answer a click. Both turn off when the person asks for reduced motion.

## Accessibility rules for the interface

- Every control reachable by keyboard, with a 3px focus outline that changes colour on the navy hero.
- The status line is a live region so progress is announced.
- Colour is never the only signal: removed and added lines start with a minus and a plus.
- Light and dark themes follow the system setting.
- No text is set in outlined or low-contrast styles.

## Copy rules

- Plain words, sentence case, active verbs. Buttons say what they do: Check my page, Download the fixed page.
- Say "fixed and proven", never "compliant" or "accessible now".
- Errors say what happened and what to try. They don't apologise.
- The limits are stated openly, near the results.
