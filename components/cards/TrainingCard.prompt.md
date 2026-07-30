Catalog card for a formation ("training") listing page. The whole card is a link out to an external resource (video, article, partner site) — hence the ↗ affordance instead of an internal chevron.

```jsx
<TrainingCard
  image="/assets/badges/hero-scouts.png"
  category="Formation Bois"
  title="L'enfant à l'âge Petits Flambeaux"
  description="Comprendre les besoins et le développement des 7-8 ans."
  duration="12 min de lecture"
  href="https://example.org/guide-du-bois"
/>
```

Use in a responsive grid (`display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:20px`) for a formation list page.
