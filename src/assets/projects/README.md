# Project images

One folder per freelance project, named after its `slug` in
`src/app/pages/Freelance.tsx` (synera, taoufik, nafs, validz).

- `cover.png` (or .jpg/.webp…) — the main image. Shown on the device mockup
  in the catalogue card and first in the project's gallery.
- Any other image — added to the gallery after the cover, sorted by filename.
  Prefix with numbers to control the order: `01-home.png`, `02-cart.png`, …

Files are picked up automatically; no code change needed. For a new project,
add an entry with a new `slug` and create a folder with the same name.
