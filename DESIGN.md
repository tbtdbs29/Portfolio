---
name: Thibault Dubois — Portfolio
description: A developer presented the way Apple presents a product; light, centred, one idea per section.
colors:
  blue: "#0071e3"
  blue-hover: "#0062c4"
  link: "#0066cc"
  link-dark: "#2997ff"
  white: "#ffffff"
  gray: "#f5f5f7"
  ink: "#1d1d1f"
  ink-2: "#6e6e73"
  hair: "#d2d2d7"
  segment-track: "#e8e8ed"
  bubble: "#e9e9eb"
  black: "#000000"
  tile-dark: "#1d1d1f"
  on-dark: "#f5f5f7"
  on-dark-2: "#a1a1a6"
  control-dark: "#333336"
  control-dark-hover: "#48484c"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3rem, 8vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 5.5vw, 3.5rem)"
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: "-0.03em"
  subhead:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.3125rem, 2.8vw, 1.75rem)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.1875rem, 2.1vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: "-0.022em"
    fontFeature: "\"cv11\", \"ss03\""
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, SF Pro Display, SF Pro Text, Inter, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: "-0.022em"
rounded:
  photo: "4px"
  bubble: "18.4px"
  md: "18px"
  lg: "28px"
  pill: "980px"
spacing:
  gutter: "clamp(1.25rem, 5vw, 3rem)"
  content: "980px"
  wide: "1200px"
  nav-height: "52px"
  band: "clamp(5rem, 11vw, 8.5rem)"
  tile-gap: "20px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "12px 22.4px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.blue-hover}"
  button-primary-small:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "4px 12.8px"
    height: "28px"
  link-chevron:
    textColor: "{colors.link}"
    typography: "{typography.body}"
  chip:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 15.2px"
    height: "40px"
  input-ask:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "4.8px 4.8px 4.8px 17.6px"
  segmented:
    backgroundColor: "{colors.segment-track}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "3px"
  segmented-selected:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "7.2px 17.6px"
  tile:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "24px 25.6px 27.2px"
  showcase:
    backgroundColor: "{colors.tile-dark}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "clamp(1rem, 4vw, 3rem)"
  message-user:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.bubble}"
    padding: "8.8px 15.2px"
  message-bot:
    backgroundColor: "{colors.bubble}"
    textColor: "{colors.ink}"
    rounded: "{rounded.bubble}"
    padding: "8.8px 15.2px"
  button-round-dark:
    backgroundColor: "{colors.control-dark}"
    textColor: "{colors.on-dark}"
    rounded: "50%"
    size: "36px"
  button-round-dark-hover:
    backgroundColor: "{colors.control-dark-hover}"
---

# Design System: Thibault Dubois — Portfolio

## Overview

**Creative North Star: "The Product Page"**

The site presents a person the way apple.com presents a product, played straight: one idea per section, a centred headline, a short grey lead under it, one large image or one dark tile, and nothing decorative. Grounds alternate between white and a pale cool grey, with a single black band for the photography. The craft bar is apple.com itself; anything that would look out of place on an iPhone or MacBook Air product page is out of place here.

Density is low and the rhythm is vertical. Every band carries generous padding (80–136px), headlines balance across lines, and content sits in Apple's 980px column, widening to 1200px only for tile grids, the photo carousel and the gallery. Type does the hierarchy work through size and weight alone: SF Pro where the platform has it, self-hosted Inter variable everywhere else, tightened by negative tracking. Colour is almost absent; Apple blue appears only where something can be pressed or followed.

Motion is quiet and functional: the hero portrait scales up gently toward full width as it scrolls into view (capped at 1.12x), project images zoom 3% on hover, the nav gains a hairline once the page scrolls. All of it collapses under `prefers-reduced-motion`. The rejected directions are confirmed: no themed concepts (film, paper, grease pencil) and no dark "creative developer" portfolio.

**Key Characteristics:**
- White / #f5f5f7 alternating bands, one black band for photography
- Centred headline + grey lead opening every section
- Apple blue only on actions and links
- Large rounded media frames (18px tiles, 28px hero and showcase)
- Pill buttons and pill controls throughout
- Translucent sticky nav with backdrop blur
- Hairlines instead of shadows

## Colors

A near-monochrome Apple palette: white, cool greys and near-black ink, with one blue reserved for interaction.

### Primary
- **Apple Blue** (blue): fills every primary action: the hero "Voir les projets" pill, the nav "Contact" pill, the chat send button and the user's chat bubbles. Also the focus ring and the input focus glow. Hover darkens to **Pressed Blue** (blue-hover).
- **Link Blue** (link): inline text links and the chevron links ("Me contacter ›", LinkedIn, GitHub) on light grounds.
- **Night Link Blue** (link-dark): the same links and the focus ring on the black photography band and in the gallery lightbox.

### Neutral
- **White** (white): default band ground, project tiles on grey bands, chips, the ask field, the selected segment.
- **Apple Gray** (gray): alternate band ground (flagship, work, contact), the chat panel, the footer, image placeholders.
- **Ink** (ink): all headings and body text on light grounds.
- **Secondary Gray** (ink-2): leads, descriptions, meta lines, dates, fine print, placeholder text.
- **Hairline Gray** (hair): 1px dividers in the project list, timeline, footer top edge, and chip / input strokes.
- **Segment Track** (segment-track): the recessed track behind segmented controls.
- **Bubble Gray** (bubble): the assistant's chat bubbles.
- **Black** (black): the photography band ground only.
- **Graphite** (tile-dark): dark media tiles: the flagship schematic and the dashboard tile.
- **On-Dark** (on-dark) and **On-Dark Secondary** (on-dark-2): headline and lead text on black and graphite.
- **Dark Control** (control-dark, hover control-dark-hover): round arrow and close buttons on dark grounds.

### Named Rules
**The Blue Means Press Rule.** Blue is never decoration, never a heading colour, never a background band. If it is blue, it can be clicked, typed into, or is the user's own message.

**The Alternating Ground Rule.** Sections change ground (white, then #f5f5f7, with black kept for the one photographic band) instead of using borders, cards or dividers to separate them.

## Typography

**Display Font:** SF Pro Display via `-apple-system` (with self-hosted Inter variable, then Helvetica Neue, Arial)
**Body Font:** SF Pro Text via `-apple-system` (same stack)

**Character:** One neo-grotesque family at every level, tightened by negative tracking (-0.022em body, down to -0.035em display) so large type reads dense and engineered. Inter runs with `cv11` and `ss03` to sit closer to SF Pro's shapes.

### Hierarchy
- **Display** (600, clamp 48–88px, 1.05): the hero name and the gallery title only. Ends with a full stop.
- **Headline** (600, clamp 36–56px, 1.07, balanced): one per section, centred, usually a short sentence ending with a full stop.
- **Subhead** (500, clamp 21–28px, 1.2): the one-line title under the hero name.
- **Lead** (400, clamp 19–24px, 1.35, Secondary Gray, max 40ch): the paragraph under each headline.
- **Title** (600, 21px, 1.2): tile and feature titles; 24px on large tiles, 19px in lists and the feature trio.
- **Body** (400, 17px, 1.47): running text and buttons; descriptions inside tiles drop to 16px / 1.45 in Secondary Gray.
- **Label** (400, 12px): nav links, language toggle, small pill, footnotes, footer, fine print. Sentence case, never uppercase.

### Named Rules
**The Weight Not Colour Rule.** Hierarchy comes from size and weight (600 vs 400) plus the ink / Secondary Gray pair. No uppercase labels, no letter-spaced small caps, no coloured headings.

**The Tabular Meta Rule.** Dates, years, photo counts and lightbox captions use tabular numerals.

## Layout

A single centred column of full-width bands. Content width is 980px (`--max`) plus a fluid gutter (20–48px); tile grids, the "other projects" list, the about split, the carousel and the gallery widen to 1200px (`--wide`). Bands pad 80–136px vertically; each opens with a centred headline + lead block and a 40–72px gap before its content.

- **Project tiles:** six-column grid with 20px gaps; standard tiles span two columns, large tiles span three. A lone filtered tile centres across four columns. At ≤1068px the grid becomes two columns; at ≤734px one.
- **Other projects:** an editorial list, 6 / 3 / 3 columns (title + description, meta, links) separated by hairlines; stacks to one column on mobile.
- **About:** portrait (5fr, sticky at 80px from the top) beside the text (7fr); stacks at ≤1068px with the portrait capped at 416px.
- **Carousel:** horizontal scroll-snap track whose inline padding aligns the first photo with the 1200px column; landscape slides up to 736px wide, portrait slides up to 320px.
- **Gallery:** square-cell grid (min 176px, 4px gaps, dense flow) where some landscape photos span two columns so the last row fills; on mobile, three columns edge to edge with 2px gaps.
- **Breakpoints:** 1068px and 734px, Apple's own.

## Elevation & Depth

Flat. Depth comes from ground changes (white / grey / black), rounded media frames and the translucent nav, not from shadows. The nav is white at 72% with `saturate(1.8) blur(20px)` behind it and gains a 12%-black hairline once scrolled. The only shadows in the build are functional: the 1px lift under the selected segment of a segmented control, and the 3px blue focus glow on the ask field.

### Shadow Vocabulary
- **Segment thumb** (`box-shadow: 0 1px 3px rgba(0, 0, 0, .12)`): the selected segment in a segmented control, nowhere else.
- **Field focus glow** (`box-shadow: 0 0 0 3px rgba(0, 113, 227, .2)`): the ask field while focused.

### Named Rules
**The No-Lift Rule.** Tiles, cards, images and buttons never cast shadows, at rest or on hover. Hover changes colour, opacity or image scale, not elevation.

## Shapes

Generous continuous curves on media, full pills on controls. Large frames (hero portrait, flagship showcase, chat panel, about portrait) use 28px; project tiles and carousel slides use 18px; screenshots inset in a tile get 10px top corners; chat bubbles round at about 18px with the tail corner pinched to about 6px; schematic nodes use 14px. Every button, chip, input and segmented control is a full pill (980px / 99px), arrow buttons are circles. The one deliberate exception is the gallery grid: 4px corners on desktop and square on mobile, so photographs read as one continuous wall of images rather than a stack of cards. Lines are 1px hairlines; the schematic uses 1.5px strokes.

## Components

### Buttons
Calm and unmistakably Apple.
- **Shape:** full pill (980px radius), at least 44px tall.
- **Primary:** Apple Blue fill, white 17px regular text, 12px × 22.4px padding.
- **Hover / Focus:** background darkens to Pressed Blue over 0.2s; focus shows a 2px blue outline offset 3px.
- **Small:** the nav "Contact" pill, 28px tall, 12px text.
- **Chevron link:** the secondary action beside every pill: Link Blue text followed by a small SVG chevron, underline on hover. Never a second filled or outlined button.
- **Round dark:** 36px circles in Dark Control with an SVG arrow, for carousel and lightbox navigation; disabled at 35% opacity.

### Chips
- **Style:** white pill with a 1px Hairline Gray stroke, 15px ink text, 40px tall; suggested questions above the chat field.
- **State:** stroke darkens to Secondary Gray on hover.

### Segmented control
- **Style:** a Segment Track pill with 3px inset; segments are transparent pills, 14px text (13px on mobile).
- **State:** the selected segment becomes a white pill with the segment-thumb shadow; `aria-pressed` drives it. Used for the project filter and the gallery series switch.

### Cards / Containers
- **Project tile:** 18px radius, white on the grey band, no border, no shadow. A 3:2 media area on top (screenshots inset on Apple Gray with 28px padding, or a Graphite schematic), then a body padded 24px × 25.6px with title, grey description, small meta line and chevron links. Hover zooms the image 3% over 0.8s.
- **Showcase:** a Graphite 28px frame holding the flagship schematic (an SVG diagram on desktop, a vertical node flow on mobile).
- **Chat panel:** Apple Gray, 28px radius, max 672px wide, holding the log, chips, field and fine print.

### Inputs / Fields
- **Style:** the ask field is a white pill with a Hairline Gray stroke, the text input borderless inside it, a 36px blue circular send button at the right end.
- **Focus:** stroke turns Apple Blue with the 3px blue glow.
- **Disabled / Error:** the send button drops to 35% opacity while empty or waiting; an assistant error renders as a white bubble in Secondary Gray, not in red.

### Chat messages
iMessage-style bubbles at 17px / 1.4, max 80% wide: the user's in Apple Blue with white text, right-aligned, bottom-right corner pinched; the assistant's in Bubble Gray, left-aligned, bottom-left corner pinched. A three-dot pulsing indicator shows while the assistant is answering.

### Navigation
- **Style:** sticky, 52px tall, translucent white with backdrop blur; wordmark (21px, 600) left, 12px links at 80% opacity, the EN/FR toggle, then the small blue Contact pill.
- **States:** links go to full opacity on hover and when their section is in view (`aria-current`); a hairline appears under the bar after scrolling.
- **Mobile (≤734px):** links collapse behind a two-line SVG menu button; the open menu turns the bar solid white and drops a full-width sheet of 28px semibold links.

### Lightbox
A full-screen dialog at 94% black: the photo contained with 6px corners, a small tabular caption below, round dark buttons for previous, next and close (prev/next move to the bottom on mobile). It fades in over 0.3s.

## Do's and Don'ts

### Do:
- **Do** open every section with a centred headline (600, -0.03em) and a Secondary Gray lead, then one piece of content.
- **Do** alternate white and #f5f5f7 bands; keep black for the one photographic band.
- **Do** pair one blue pill with one chevron link when a section needs two actions.
- **Do** frame large media in 28px rounded corners and tiles in 18px.
- **Do** use the shared SVG sprite for icons (chevron, arrows, send, close, menu) at 1em.
- **Do** keep hover feedback to colour, opacity or a 3% image zoom, and honour `prefers-reduced-motion`.

### Don't:
- **Don't** use blue for anything that cannot be pressed or followed.
- **Don't** add shadows to tiles, images or buttons; the segment thumb and the field focus glow are the only shadows.
- **Don't** put uppercase or letter-spaced labels above headlines; the headline opens the section on its own.
- **Don't** reintroduce themed worlds (film rebate, paper, grease pencil) or the dark "creative developer" look (noise overlays, custom cursors, uppercase Space Grotesk).
- **Don't** use emoji or text glyphs as icons; icons are SVG strokes in the current colour.
