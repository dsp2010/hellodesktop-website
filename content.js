window.HELLODESK_CONTENT = {
 groups: { barbers: 'Barber shops' },
 industries: [{
  "id": "barber",
  "group": "barbers",
  "slug": "barbers",
  "name": "Barber shops",
  "icon": "✂",
  "headline": "Keep the conversation going. Keep the chair moving.",
  "intro": "AI telephone receptionists and custom websites exclusively for barber shops. Built around your services, staff diaries and booking rules.",
  "questions": [
    "Can I book a skin fade?",
    "Can I add a beard trim?",
    "Can I book with my usual barber?",
    "Do you accept walk-ins?"
  ],
  "scenarios": [
    [
      "The right service",
      "Clarify the haircut, beard service and appointment length from your approved service list."
    ],
    [
      "The right barber",
      "Check the requested barber’s actual availability through your supported booking connection."
    ],
    [
      "A clear next step",
      "Follow your walk-in, appointment-change and human-handover policies."
    ]
  ],
  "faq": [
    "Can it book a haircut?",
    "Receptionist packages include live availability checks and bookings through a supported, connected integration. The public voice demo uses practice details and does not reserve a real appointment."
  ]
}],
 planLabels:Object.fromEntries(window.HELLODESK_PACKAGES.packages.map(p=>[p.id,[p.name,p.description.replace(/barbers and salons/gi,'barber shops')]])),
 packageCategories:window.HELLODESK_PACKAGES.categories
};
