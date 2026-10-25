# Restaurant table picker (concept demo)

Live at `/tools/restaurant-tables`. Label: INTERACTIVE CONCEPT DEMO. It is a demonstration with made-up data. It takes no bookings, collects no personal details, makes no network calls and uses no third-party service. The visible notice is "Interactive demo — no real reservation is made."

## Files

| File | Job |
| --- | --- |
| `app/tools/restaurant-tables/layout-data.ts` | All data: floor size, sections, tables, days, time slots, example diary (`TAKEN`), party rules (`RULES`). |
| `app/tools/restaurant-tables/logic.ts` | Pure rules, no React or DOM: `tableFit`, `tableStatus`, `statusReason`, `summarise`, `footprint`, `validateLayout`. |
| `app/tools/restaurant-tables/plan-art.tsx` / `.css` | Draws the floor, chairs and the home-page mini plan from the data. |
| `app/tools/restaurant-tables/table-picker.tsx` / `.css` | The client component: controls, plan buttons, selected-table panel, simulated next step. |
| `tests/restaurant-tables.test.mjs` | Rules, data validation and "stays offline" checks. `tests/tools.test.mjs` checks the exported pages. |

## Data model

- Positions are grid cells on a `FLOOR.width` x `FLOOR.height` plan (20 x 16). `x`, `y` are the centre of a table, chairs included. `rotation` is 0 or 90.
- A `Table` has `id`, `label`, `capacity` (2, 4 or 6), `section`, `shape` (`round`, `square`, `long`), `x`, `y`, `rotation` and a plain-words `position`. Each shape seats one capacity (`SHAPES` in `logic.ts`): round 2, square 4, long 6.
- A `Section` has an id, a name, a blurb and a plan rectangle used only to tint the zone.
- Availability is stored as the tables already **taken** per day and time slot: `TAKEN[day][slot] = ['W2', 'M2']`. Anything not listed is free.
- Status for a table, party size and slot: `unfit` (too small, or more than `RULES.maxSpareSeats` spare seats) beats `taken` beats `available`. Status is shown as a word on the table, a different outline or pattern, and in the table's `aria-label`; colour is never the only cue.
- Days are named weekdays labelled as examples, not calendar dates. That avoids a stale date and any server/client hydration mismatch.

Rearranging the room, adding a section or changing the diary is a data edit. After any edit run `validateLayout(...)` (the test does): it reports duplicate ids, unknown sections, a shape/capacity mismatch, tables off the floor, overlapping tables and diary entries that name a missing table.

## How an owner-facing layout editor could work (not built)

- **Canvas.** The same SVG plan, with tables as draggable objects. Dragging snaps to the 0.5-cell grid; a handle rotates by 90 degrees. Palette items: round 2-top, square 4-top, long 6-top, wall, door, window, counter, plant.
- **Properties.** Selecting a table shows its label, section and position text. Capacity follows the shape, so it cannot be set wrongly.
- **Validation.** Run `validateLayout` live. Overlaps and off-floor tables turn red and block publishing. Also warn if a section has no tables or the room has no table for a party of 1 to 6.
- **Keyboard and screen reader.** Every move must work without a mouse: arrow keys nudge by one grid step, Delete removes, a list view edits the same data as a table of fields.
- **Versioning and publishing.** Store layouts as immutable versions (id, author, time, JSON). Editing creates a draft. "Publish" validates, then points the live room at that version; "Restore" re-publishes an older one. Bookings keep the table id and the layout version they were made against, so an old booking still makes sense after a rearrangement.
- **Safety on publish.** If a table with future bookings is removed or moved to another section, list those bookings and require the owner to reassign or contact the guests first.
- **Storage.** A small database table or JSON document per venue with row-level access. Never in the browser only.

## Production assessment (brief, not built)

| Area | What a real version needs |
| --- | --- |
| Booking system integration | Either build on an existing system's API (availability, create, cancel) or own the bookings table. The picker should only choose and propose; the booking system stays the source of truth. Terms, pricing and data protection need agreeing with the venue. |
| Double-booking prevention | Decide server-side, atomically, at the moment of booking: check the table is free for the whole sitting length, then write, in one transaction or with a unique constraint on table and time. Handle two guests clicking the same table; show the loser a clear "just taken, here are alternatives". Holds expire. The client display is only a hint. |
| Table rearrangement | Layout editor above, plus rules for merging tables (a 6-top made from two 4-tops), turn times and sitting length per table. |
| Accessibility | The demo already uses real buttons, `aria-pressed`, text status, visible focus and a 390px layout. A real version also needs step-free table flags, a plain list alternative to the plan, and testing with a screen reader and switch access. |
| Staff management | Staff log in (role-based), see today's floor, seat walk-ins, block tables, mark no-shows, and override the guest-facing rules. Needs audit trail and a quick mobile view. |
| Booking modifications | Guests change or cancel by a private link; cut-off rules; the freed table returns to availability atomically; confirmations and reminders by email or text through an approved provider. |
| Maintenance and support | Someone owns uptime, backups, data retention and deletion, GDPR requests, staff training, a support route when the room is full on a Friday, and updates when the venue changes its layout or opening hours. Plan for ongoing cost, not only the build. |

None of this exists in the demo. The honest next step with a venue is a short scoping conversation, then a fixed-price build on top of whatever booking system they already use.
