## Goal
- Transform SEEIT from a visual Wazuh clone into a functional Wazuh-like SOC platform by fixing workflows, interactions, and behavior without redesigning the UI.

## Constraints & Preferences
- DO NOT redesign UI, change colors, layout, typography, replace components, or create new UI concepts.
- Only improve behavior, workflows, interactions and analyst experience.
- All data is mock/hardcoded (no backend).
- Use react-hot-toast for all feedback (loading, empty, success, error states).
- Target 85%+ Wazuh workflow parity.

## Progress
### Done
- Compliance evidence panels: added `toast` + interactive evidence click workflow to PCI DSS, HIPAA, NIST 800-53, TSC (matching GDPR pattern — click requirement card → navigate to events tab + toast feedback).
- Alerting enhancements: functional severity filter (stateful `<select>` that filters `filteredAlerts`), search input with `value`/`onChange` binding, `acknowledged` state tracking per alert, timeline section in detail flyout with lifecycle events, "Close alert" action button, empty state messaging differentiates "no alerts" vs "no match".
- MITRE technique detail panel: added Related Alerts (3 mock items with click-toast), Related Agents (2 mock items with status), Related Events (5 mock items with navigation to `/events`), added `useNavigate` import.
- Toast feedback: added `react-hot-toast` to 15 previously toast-less pages (Docker, AWS, GCP, O365, MsGraph, GitHub, Rules, Maps, Reporting, Visualize, Notifications, Dashboards, ItHygiene, AnomalyDetection, ConfigurationAssessment).
- Fixed pre-existing ESLint build errors: `confirm` → `window.confirm` in Agents.tsx (2 occurrences). Build now passes cleanly.
- Groups.tsx: fixed search filter not applied to `groupsList` (added `.filter()` on `searchQuery`), added additional mock groups for testing, built out manage-agents dual-panel workflow with `availableAgents`/`groupAgents` state, functional arrow buttons (add/remove selected/all), dynamic "Apply changes" button enabling, `availableFilter`/`groupFilter` search inputs with functional filtering, added `toast` import, added `onClick` handlers to file View/Edit icons.
- MITRE intelligence subtabs: replaced monolithic groups-only panel with conditional rendering per subtab — groups/mitigations/software/tactics/techniques each show distinct mock data with appropriate column headers.
- MalwareDetection pagination: fixed `pagedEvents` to actually slice data (`allEvents.slice(...)`) instead of returning the full array; changed `ITEMS_PER_PAGE = 15` and computed `totalPages`.
- ConfigurationAssessment events tab: added full mock event generation (`mockScaEvents` array with 45 items), `scaEventSearch` state/search filter, pagination with `SCA_EVENTS_PER_PAGE` and `pagedScaEvents`, replaced static warning banner with functional table + pagination controls. Also wired `onClick` handlers to filter chip remove, date picker, show dates, add filter, refresh buttons.
- Full project audit: all 33 pages, 3 components, all routes, buttons, modals, dropdowns, charts, filters, tables, search boxes, flyouts, handlers, and navigation flows audited for workflow parity.
- FIM events tab: added event drilldown modal (magnifying glass → `setSelectedFimEvent`), dynamic pagination with page state, replaced hardcoded page numbers with computed pages from `eventsData`.
- VulnerabilityDetection: added `vulnSearch` state → `value`/`onChange` on search input, filtered `filteredInventory` by both search and chip filters, CVE click handler opens detail modal.
- Dashboard module grid cards: confirmed already navigable with `useNavigate` and route mapping.
- Events.tsx: enhanced Share URL to include filters and timeRange, restored filters/timeRange from URL params on page load, added toast feedback on time range selection.
- Cloud modules (Docker, AWS, GCP, O365, MsGraph, GitHub): added `value`/`onChange` search bindings — `dockerSearch`, `o365Search`, `msgraphSearch`, `awsSearch`, `gcpSearch`, `githubSearch`. MsGraph, Gcp, Github also filter their table data by search term.
- Compliance pages (PciDss, Hipaa, Nist80053, Tsc, Gdpr): added `reqSearch` state with `value`/`onChange` on search inputs, filters requirement list by search, replaced hardcoded events table rows with paginated mock data and functional `←`/`→` pagination buttons.
- Groups.tsx: fixed pre-existing syntax error (missing `const groupFiles = [` declaration).

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- All fixes use targeted inline edits (no page rebuilds, no component replacement).
- Mock data is expanded / made functional rather than replaced with real API calls.
- Decorative elements are given actual handlers (toast, navigation, state update) rather than removed.

## Next Steps
Batch 3 — Medium (optional):
- Maps.tsx: render a functional map or proper interactive placeholder
- ThreatHunting: wire "Generate report", "Export Formatted", "Add filter" buttons
- AgentDetail: add agent actions dropdown (restart/upgrade/remove)

Batch 4 — Low:
- Loading states (`toast.loading`) on refresh/export/create actions
- Sorting indicators on table columns
- Empty state improvements on pages with no data

## Critical Context
- Build: `npx react-scripts build` (CRA). Current state: compiles cleanly with no errors.
- React 18, react-router-dom v7, Chart.js 4.5.1, Tailwind CSS 3.4.19, react-icons v4, react-hot-toast, framer-motion.
- TypeScript strict mode with `target: es5` — avoid `[...new Set()]`, use `Array.from(new Set())`.
- All state is local `useState` per page; no global state management, no API calls, no `useEffect` for data fetching.
- Styling is inline CSS + `wz-*` utility classes in `index.css` + Tailwind utilities.
- `react-hot-toast` is imported across all 33 pages.
- No shared components/context/hooks/utils — all logic is per-page.

## Relevant Files
- `/home/saad/Desktop/seeit-frontend/src/pages/Groups.tsx` (674 lines): Groups management — search, manage-agents, file handlers all functional.
- `/home/saad/Desktop/seeit-frontend/src/pages/MitreAttack.tsx` (1048 lines): MITRE ATT&CK — intelligence subtabs render correct content per tab, technique detail panel has related alerts/agents/events.
- `/home/saad/Desktop/seeit-frontend/src/pages/MalwareDetection.tsx` (738 lines): Malware detection — pagination now properly slices data.
- `/home/saad/Desktop/seeit-frontend/src/pages/ConfigurationAssessment.tsx` (475 lines): SCA — events tab now has mock data, search filter, paginated table.
- `/home/saad/Desktop/seeit-frontend/src/pages/Alerting.tsx` (608 lines): Alerting — functional severity filter, search, acknowledged state, timeline flyout, close action.
- `/home/saad/Desktop/seeit-frontend/src/pages/FileIntegrityMonitoring.tsx` (578 lines): FIM — event drilldown modal, dynamic pagination.
- `/home/saad/Desktop/seeit-frontend/src/pages/VulnerabilityDetection.tsx` (796 lines): Vuln detection — search filter, CVE click handler.
- `/home/saad/Desktop/seeit-frontend/src/pages/Events.tsx` (957 lines): Events — share URL includes filters/timeRange, restored from params.
- `/home/saad/Desktop/seeit-frontend/src/pages/PciDss.tsx` (662 lines): PCI DSS — search binding, paginated events table.
- `/home/saad/Desktop/seeit-frontend/src/pages/Dashboard.tsx` (500 lines): Dashboard — module grid cards already navigable.
