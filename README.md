# The Herbarium 
## V1.2.0 - Artisan Update



<img width="1164" height="1545" alt="_Users_joshuamae_Documents_Projects_The-Herbarium_herbarium-homepage%20(2) html" src="https://github.com/user-attachments/assets/5fc1c2c2-46e5-4539-9f0d-2e665ea1b0fa" />
<img width="1180" height="1073" alt="_Users_joshuamae_Documents_Projects_The-Herbarium_herbarium-homepage%20(2) html (1)" src="https://github.com/user-attachments/assets/2e8dacc3-0985-4fcb-91d2-2d2ebe99a684" />

- Project is currently under active development!

I've been working on a side project that started as a UI exercise and turned into something I'm genuinely proud of: The Herbarium — a botanical plant index built with the aesthetic of a 1960s natural history newspaper.

What is it?

A plant knowledge base where you can look up any species and get serious care information — watering schedules, light requirements, soil composition, seasonal activity, propagation methods — written with botanical depth rather than generic advice.

The design is deliberately editorial. Think broadsheet newspaper meets natural history archive. No cards with rounded corners and pastel gradients. Just strong typography, an ink-on-paper palette, and content that earns its space.

The design thinking

The brief I gave myself: what would a plant database look like if it was designed by a newspaper, not a SaaS company?

That meant:

A full-bleed masthead with the date and editorial tagline
A ticker of "Now in Season" plant updates
A four-column broadsheet layout with a featured species profile, editorial stories, a care archive, and a quick-access index
Playfair Display for display type, set at sizes that fill space with intention
A muted warm-white background (
#f5f0e8) with ink-black text — no brand colours fighting for attention

The result is a layout that feels like something you'd actually want to read, not just query.

Technical stack

HTML + CSS + vanilla JS — no framework, intentionally. The constraint forced me to think carefully about layout rather than reaching for components.
Tailwind CSS for utility spacing and responsive behaviour
Google Fonts — Playfair Display (editorial display) + Hanken Grotesk (body/UI)
Material Symbols for iconography at thin weight (300), which keeps the editorial feel
CSS custom properties throughout — the entire palette is tokenised, making it trivial to theme

Key layout techniques used:

CSS Grid for the broadsheet four-column structure
clamp() for fluid type scaling without breakpoint jumps
A film grain canvas overlay (static, drawn once on load) for texture
Intersection Observer for scroll-triggered fade-up animations

What I built

So far the project has two complete pages:

Homepage — The newspaper front page. Masthead, season ticker, nav with section tabs, a featured species column, editorial stories ("Why Your Monstera Won't Fenestrate"), care guide strips, a "Quick Index" sidebar with difficulty badges, and a newsletter section.

Plant Profile page — The species detail view. A gallery with thumbnail strip, full taxonomy table, a care overview grid (watering, light, temperature, humidity, soil, repotting), a difficulty bar, seasonal activity calendar with month-by-month breakdown, and a deep-dive accordion with the actual science behind each care requirement.

What's next

The front-end is largely designed. The next phase is connecting it to a real plant database API — likely the Perenual API — and building out the search and filtering system. I'm also planning:

A user collection/tracker feature (save plants, get seasonal reminders)
A search results page
Mobile-responsive passes on the broadsheet layout
