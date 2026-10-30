# HelloDesk website

A static HTML/CSS/JavaScript site for UK barber shops. Open index.html using a local static server. No frontend framework, package installation, API key or backend is required.

## Editing and checks

- scripts/build.py contains page copy, shared navigation/footer, the fictional examples and legacy redirects.
- site.css contains the responsive green/cream design.
- site.js handles the enquiry draft, booking-system check, calculator, mobile menu and example controls.
- barber-setup.js retains the local setup brief, package summary, text download and eight manually reported test results.
- packages.js is the existing central package catalogue. Prices, allowances, setup fees, extra charges, cancellation/renewal terms and feature specifications have been preserved. Only two references to other business audiences were changed to barber shops.
- config.js holds the public contact details and remaining settings.

After editing copy, contact settings or packages, run:

    python3 scripts/build.py
    python3 scripts/check.py

The generated HTML is checked in at the repository root, so static hosting does not need a build step. The generator reads packages.js and config.js through Node to keep visible prices and contact details in sync. Do not edit generated HTML directly.

## What works now

- Five-link primary navigation, readable static pages and responsive layouts.
- One four-step receptionist illustration and one fictional barber website concept.
- Validated enquiry form with conditional fields and a review dialog. Visitors choose to open an email/WhatsApp draft and must send it themselves.
- Booking-method questions that always explain that the setup needs checking.
- Browser-only missed-enquiry estimate with input limits and zero/empty handling.
- A local setup brief download. All test results start untested; user-entered results are not independent verification.
- Old demo, compatibility, onboarding and setup URLs lead to their replacements. industries/barbers.html repairs the previously missing destination.

The public website does not make live calls or appointments, take payments, send form submissions, activate a subscription or load third-party voice widgets.

## Remaining connections and settings

| Location | Purpose and boundary |
| --- | --- |
| config.js → contact and messages | Email, phone number, WhatsApp destination and message drafts. Rebuild the HTML after changes. |
| config.js → booking.calendarUrl | Empty by default. A verified HTTPS scheduler URL reveals a link on Contact. Actual availability, time zones and confirmation remain with that scheduler; WhatsApp/email stay available. Merely setting a URL does not validate that service. |
| config.js → enquiry.mode | draft. No delivery backend exists. Changing this value does not enable delivery. |
| config.js → support.hours / support.responseTime | Empty and hidden until real commitments are supplied. |
| config.js → demo | The walkthrough is the only receptionist example. A future video needs an approved real asset and explicit rendering work; setting a URL alone does not display a player. |
| config.js → evidence | Empty approved-evidence structure. No testimonials/results are displayed. Add a reviewed rendering section only when genuine permission-approved material exists. |
| config.js → pilot | Undecided terms. Agree price, duration, scope and inclusions before starting; applications never create obligations. |
| config.js → verifiedFeatures | Empty. Nothing has yet been confirmed from the first real telephone call through final completion. |
| packages.js | Existing commercial data. Receptionist specifications are labelled as scope to agree and test, including reminders and supported booking actions. No new feature was silently added to a package. |

Before enabling form delivery, implement a secure backend with server-side validation, size/rate limits and spam controls. Use an authorised sender and Reply-To for delivery to the configured support email. Keep secrets on the server, preserve entries on failure, prevent duplicate submissions and show success only after a verified acceptance response. Avoid logging enquiry contents.

Telephone answering, booking connections, reminders, messages and transfers still need separate implementation/connection and agreed real-service tests. Caller notices and any recording/transcript access and retention must be agreed before use. The website's examples do not verify those services.

## Verification for this update

- Static check: all 26 HTML routes, local files/fragments, form labels, exact contact details, obsolete-demo removal and JavaScript syntax.
- Compared all 10 packages against the original catalogue: prices, allowances, extra charges, terms and feature specifications unchanged.
- Browser checks: enquiry review and encoded drafts with fictional data, conditional pilot/demo fields, invalid phone handling, Escape closing, booking-system fallback, example navigation, concept notice and setup brief download.
- Calculator: default 2 × 22 × 25% × £25 = £275; zero and empty inputs return zero, negative/over-100% values show errors; 3 × 22 × 25% × £25 = £412.50.
- Visual checks: desktop, phone-size frames and a tablet-size frame; no page-level horizontal overflow on representative pages; mobile menu tested.
- Real telephone calls, delivery, scheduling, payments and appointments were not tested or activated. No external test messages were sent.
