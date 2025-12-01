# Jobster Landing Page

A simple, static landing page for a job platform, built with **HTML**, **Tailwind CSS (CDN)**, and a small amount of **vanilla JavaScript**.  
The layout is split into reusable HTML partials to keep the codebase tidy and easy to extend.

## Structure

- `index.html`  
  Main entry point. It:
  - Loads Tailwind via CDN.
  - Loads Font Awesome icons.
  - Includes custom styles from `assets/css/styles.css`.
  - Declares empty `<div>` placeholders with `data-include="partials/*.html"` which are filled at runtime.

- `assets/css/styles.css`  
  Custom global styles: font imports, gradient background, card hover effects, dot indicators, etc.

- `assets/js/main.js`  
  - `loadPartials()` fetches each file referenced by a `data-include` attribute and injects the HTML.
  - `initInteractions()` adds:
    - Hover effects for `.category-card` and `.job-card`.
    - Click-to-toggle favorite behavior on `.fa-heart` icons.
  - On `DOMContentLoaded`, it runs `loadPartials().then(initInteractions)`.

- `partials/`  
  - `header.html` – Top navigation and brand.
  - `hero.html` – Hero section, search UI, tags, and hero image.
  - `categories.html` – “Search by Category” grid.
  - `featured-jobs.html` – “Featured Job Offers” cards.
  - `footer.html` – Footer links, social icons, and subscribe form.

## Creating a New Section / Partial

You can add new sections to the page by following the existing pattern:

1. **Create the partial HTML file**
   - Place it in the `partials/` folder, e.g. `partials/testimonials.html`.
   - Put only the markup for that section inside (no `<html>`, `<head>`, or `<body>` tags), for example:

   ```html
   <!-- Testimonials Section -->
   <section class="py-16 bg-white">
       <div class="container mx-auto px-4">
           <h2 class="text-2xl font-bold text-gray-800 mb-8">What our users say</h2>
           <!-- your content here -->
       </div>
   </section>
   ```

2. **Include it in `index.html`**
   - Add a new `div` with a `data-include` attribute pointing to your new file:

   ```html
   <div data-include="partials/testimonials.html"></div>
   ```

   - Place this line in `index.html` where you want the section to appear in the layout order.

3. **(Optional) Add interactivity**
   - If your new section needs JavaScript behavior, add it to `initInteractions()` in `assets/js/main.js`.
   - Query for elements inside your partial after it has been loaded, for example:

   ```js
   function initInteractions() {
       // ...existing code...

       const testimonialCards = document.querySelectorAll('.testimonial-card');
       testimonialCards.forEach(card => {
           // add listeners or effects here
       });
   }
   ```

As long as you follow this pattern (partial file + `data-include` + optional JS in `initInteractions()`), new sections will plug into the page cleanly.

## Running the Page Locally

Because partials are loaded via `fetch()`, you should serve the project from a local web server (not just open the file directly in the browser).

From `/home/cita/project` you can use Python's simple HTTP server:

```bash
cd /home/cita/project
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

You should see the complete Jobster landing page with all sections loaded and interactive.


# portfoliocaka
