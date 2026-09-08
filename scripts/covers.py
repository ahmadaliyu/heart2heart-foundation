"""
Placeholder cover art.

Generated rather than stock: the Foundation has no photography yet, and a
generated cover in the brand palette reads as designed instead of as a broken
image or a generic stock photo. Each is derived from the item's slug, so the
same article always gets the same cover and every one is distinct.

The motif is the mark's idea at texture scale — two ribbons that cross and
continue past one another. Replacing these with real photography is a file
swap: same paths, same 16:10 ratio.
"""
import hashlib, pathlib, math, re

W, H = 1200, 750

# top, bottom, accent, ribbon-ink
SCHEMES = [
    ("#3A2456", "#180D22", "#E8A33D", "#EFE3F7"),  # night, amber
    ("#6B4494", "#33204A", "#F4D9A7", "#FFFFFF"),  # plum, sand
    ("#FBF6EE", "#F0E4D2", "#5B3A7E", "#B98A2E"),  # cream, plum
    ("#F3ECF9", "#DFD0EE", "#5B3A7E", "#8055A6"),  # lilac, plum
    ("#8B5FB0", "#4A2F6B", "#FDF8EE", "#E8A33D"),  # mid plum, cream
    ("#2C1B40", "#120A19", "#EEC070", "#9D77BF"),  # deepest, gold
]

def h(seed, salt, n):
    return int(hashlib.sha256(f"{seed}:{salt}".encode()).hexdigest(), 16) % n

def sweep(cx, cy, r, a0, a1):
    """A single arc path, drawn the long way round when asked."""
    x0, y0 = cx + r * math.cos(a0), cy + r * math.sin(a0)
    x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
    large = 1 if abs(a1 - a0) > math.pi else 0
    return f"M{x0:.1f},{y0:.1f} A{r:.1f},{r:.1f} 0 {large} 1 {x1:.1f},{y1:.1f}"

def band(cx, cy, base_r, a0, span, colour, strands, w0, op0, step):
    """A ribbon: several parallel strands falling away in weight and opacity."""
    return "".join(
        sweep_path(cx, cy, base_r - i * step, a0 + i * 0.03, a0 + span - i * 0.02, colour,
                   max(2, w0 - i * 2.6), max(0.05, op0 - i * 0.085))
        for i in range(strands)
    )

def sweep_path(cx, cy, r, a0, a1, colour, width, opacity):
    return (f'<path d="{sweep(cx, cy, r, a0, a1)}" stroke="{colour}" '
            f'stroke-opacity="{opacity:.2f}" stroke-width="{width:.1f}" '
            f'stroke-linecap="round" fill="none"/>')

def cover(seed: str) -> str:
    top, bottom, accent, ink = SCHEMES[h(seed, "scheme", len(SCHEMES))]

    # The two ribbons cross near the middle third and run off opposite edges,
    # so the composition carries across the whole frame rather than pooling in
    # one corner.
    ax = 300 + h(seed, "ax", 340)
    ay = 520 + h(seed, "ay", 260)
    ar = 430 + h(seed, "ar", 190)
    aa = -2.45 + h(seed, "aa", 60) / 100

    bx = 620 + h(seed, "bx", 380)
    by = 40 + h(seed, "by", 200)
    br = 380 + h(seed, "br", 210)
    ba = 0.55 + h(seed, "ba", 70) / 100

    ribbon_a = band(ax, ay, ar, aa, 1.55, accent, 4, 22, 0.70, 34)
    ribbon_b = band(bx, by, br, ba, 1.20, ink, 3, 14, 0.26, 28)

    # Rotating the whole group is what stops fourteen covers looking like one
    # composition repeated — the gesture reads differently at every angle.
    spin = h(seed, "spin", 360)
    glow_x = h(seed, "gx", 100)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-hidden="true">
  <defs>
    <linearGradient id="g" x1="0.1" y1="0" x2="0.85" y2="1">
      <stop offset="0" stop-color="{top}"/>
      <stop offset="1" stop-color="{bottom}"/>
    </linearGradient>
    <radialGradient id="bloom" cx="{glow_x / 100:.2f}" cy="0.12" r="0.85">
      <stop offset="0" stop-color="{accent}" stop-opacity="0.26"/>
      <stop offset="1" stop-color="{accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="{W}" height="{H}" fill="url(#g)"/>
  <rect width="{W}" height="{H}" fill="url(#bloom)"/>
  <g transform="rotate({spin} {W/2} {H/2})">
    {ribbon_b}
    {ribbon_a}
  </g>
</svg>
"""

# Read the identifiers straight out of the fixtures, so a new article can never
# end up pointing at a cover that was never generated.
content = pathlib.Path("src/lib/data/content.ts").read_text()
names = re.findall(r'slug: "([a-z0-9-]+)"', content) + re.findall(r'id: "(vid_\d+)"', content)

# The five areas of work, plus the two audiences, all of which have an image
# slot on the site.
names += [
    "area-child-abuse", "area-drug-abuse", "area-sexual-abuse",
    "area-social-inclusion", "area-gender-based-violence",
    "audience-teenagers", "audience-married-couples",
]

out = pathlib.Path("public/covers")
out.mkdir(parents=True, exist_ok=True)
for name in sorted(set(names)):
    (out / f"{name}.svg").write_text(cover(name))
print(f"{len(set(names))} covers written")
