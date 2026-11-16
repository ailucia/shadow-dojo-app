// Shadow Dojo — one-page resume layout (Typst). Layout only: every [bracketed] line is a
// placeholder. /forge copies this into my/resume/master-<angle>.typ and fills it from your
// resume; your masters never leave my/ (gitignored).
// Toolchain: Typst (`brew install typst`). Build: typst compile master-<angle>.typ resume.pdf
// /forge edits the prose only; leave the spacing constants and helpers alone.

#set document(title: "Resume")
#set page(paper: "us-letter", margin: (x: 0.75in, top: 0.5in, bottom: 0.45in))

#let ink    = rgb("#202020")
#let accent = rgb("#4472C4")   // name, separators, section titles
#let muted  = rgb("#5a5a5a")   // dates

#set text(font: ("Avenir Next", "Helvetica Neue", "Helvetica", "Arial"), size: 9.3pt, fill: ink)
// SPACING HIERARCHY — keep these STRICTLY INCREASING so items read as grouped:
//   leading (wrapped lines, tightest) < g-bullet < par spacing < g-subrole < g-company < g-section
// If a page spills, trim content first; only then scale these together, still increasing.
#set par(leading: 0.5em, spacing: 5pt, justify: false)

#let g-bullet  = 5pt    // space between bullets — must be > leading
#let g-section = 16pt   // space above a section header
#let g-company = 13pt   // space above a company header
#let g-subrole = 9pt    // space above an additional role at the same company

// ---- helpers -------------------------------------------------------------
#let sep = text(fill: accent, weight: "medium")[ #h(2pt)/#h(2pt) ]

#let section(title) = {
  v(g-section)
  align(center, text(size: 11pt, weight: "bold", fill: accent, tracking: 0.6pt)[#upper(title)])
  v(3pt)
}

// company header on its own line; g-company sets the gap above
#let company(name) = { v(g-company); text(size: 10.5pt, weight: "bold")[#name]; linebreak() }

// space above an additional role listed under the same company
#let subrole = v(g-subrole)

// role line: title, italic team, dates in muted small caps
#let role(title, dept: none, dates) = {
  text(size: 10.5pt)[#title]
  if dept != none { text(size: 9pt)[, ]; text(size: 9pt, style: "italic")[#dept] }
  h(4pt)
  text(size: 8pt, fill: muted)[– #smallcaps(dates)]
  linebreak()
}

// bullet list with dash markers
#let bullets(..items) = {
  set list(marker: text(fill: ink)[--], indent: 6pt, body-indent: 6pt, spacing: g-bullet)
  for it in items.pos() [ - #it ]
}

// ---- header --------------------------------------------------------------
#align(center, text(size: 29pt, weight: "bold", fill: accent, tracking: 0.5pt)[YOUR NAME])
#v(8pt)
#align(center, text(size: 10.5pt, weight: "bold")[
  #(([email\@example.com], [phone], [linkedin.com/in/you], [City, ST]).join(sep))
])
#v(9pt)
#block(width: 100%, text(size: 9.5pt)[
  [Two or three lines: who you are as a PM, what you build, and one anchored result.]
])

// ---- skills box ----------------------------------------------------------
#v(11pt)
#block(width: 100%, stroke: 0.6pt + rgb("#c7c7c7"), radius: 1pt, inset: (x: 10pt, y: 6pt))[
  #text(size: 10pt, weight: "bold")[EXPERTISE] \
  #text(size: 9pt)[[Skill areas, comma-separated]]
  #v(5pt)
  #text(size: 10pt, weight: "bold")[TOOLS & TECHNOLOGIES] \
  #text(size: 9pt)[[Tools, comma-separated]]
]

// ---- experience ----------------------------------------------------------
#section("Experience")

#company[[Company]]
#role([[Title]], dept: [[Team]], [[Start – End]])
#bullets(
  [[Result first, then how: what changed, by how much, for whom.]],
  [[Another accomplishment with an anchored number (baseline → result, scope).]],
)

// ---- education -----------------------------------------------------------
#section("Education")

#company[[School]]
#role([[Degree]], [[Year]])
