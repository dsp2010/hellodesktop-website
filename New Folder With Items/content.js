/* Barber shop content shared by demos, forms and setup briefs. */
window.HELLODESK_CONTENT = {
  groups: {barber: "Barber shops"},
  industries: [
  {
    "id": "barber",
    "group": "barber",
    "slug": "barbers",
    "name": "Barbers",
    "icon": "✂",
    "headline": "Keep the conversation going. Keep the chair moving.",
    "intro": "Give callers a friendly place to ask about cuts, beard trims and your shop while you focus on the customer in your chair.",
    "questions": [
      "How much is a haircut?",
      "Do you offer beard trims?",
      "What time do you close?",
      "Where can I book an appointment?"
    ],
    "scenarios": [
      [
        "Before a first visit",
        "Help new callers understand your services, prices and how to find you."
      ],
      [
        "Between appointments",
        "Explain your published opening hours and how your booking process works."
      ],
      [
        "The right service",
        "Introduce the cuts and grooming options you choose to share."
      ]
    ],
    "faq": [
      "Can it book a haircut?",
      "Booking links or appointment actions depend on the integrations in your finished assistant. Live availability is not included in this preview."
    ]
  }
],
  planLabels: Object.fromEntries(window.HELLODESK_PACKAGES.packages.map(p => [p.id, [p.name, p.description]])),
  packageCategories: window.HELLODESK_PACKAGES.categories
};
