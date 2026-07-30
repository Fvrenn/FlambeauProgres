Pill button, the base action control. One shape, five fills — pick the variant by emphasis, not by inventing a new shape.

```jsx
<Button variant="primary">Valider l'étape</Button>
<Button variant="secondary" icon={<PlusIcon/>}>Nouvelle tâche</Button>
<Button variant="outline">Annuler</Button>
<Button variant="ghost">Passer</Button>
<Button variant="accent" kbd="M">Besoin d'infos</Button>
```

Sizes: `sm` (32px, list/toolbar actions), `md` (40px, default), `lg` (48px, primary page CTAs). `kbd` renders a small translucent shortcut badge at the trailing edge (seen in review-queue action rows: "Interested", "Pass — P", "Skip — S").
