# SEEIT vs Wazuh — Complete Workflow Parity Audit

> Goal: Transform SEEIT from a visual Wazuh clone into a functional SOC platform
> where every analyst workflow matches the real Wazuh Dashboard.

---

## EXECUTIVE SUMMARY

| Module | Current Parity | Priority |
|--------|---------------|----------|
| Discover/Events | 55% | CRITICAL |
| Agents | 35% | CRITICAL |
| Threat Hunting | 30% | HIGH |
| Vulnerability Detection | 40% | HIGH |
| MITRE ATT&CK | 25% | HIGH |
| Compliance (GDPR/PCI/HIPAA/NIST/TSC) | 15% | MEDIUM |
| Alerting | 40% | MEDIUM |
| Settings | 30% | MEDIUM |
| Reporting | 5% | LOW |
| Visualize/Dashboards | 5% | LOW |
| FIM | 10% | MEDIUM |
| SCA | 10% | MEDIUM |
| Malware Detection | 10% | LOW |
| CIS-CAT | 5% | LOW |
| Groups | 5% | LOW |

---

## DISCOVER / EVENTS (Events.tsx — 713 lines)

### Current State (What Works)
- DQL search bar with real filtering against mock data (lines 184-189)
- Filter builder popover with field/operator/value (line 557-595)
- Filter chips display + remove (lines 526-540)
- Time range picker dropdown with 7 presets (line 475-497)
- Histogram bar click narrows time range (lines 259-269)
- Dynamic column add/remove via field sidebar (lines 352-433)
- Event row expand with JSON details (line 643+)
- Refresh button with hit count simulation (line 211-215)
- New button resets search state (line 288)

### Missing Workflows (Wazuh Parity Gaps)

#### 1. Filter Chips — Enable/Disable Toggle
**Wazuh behavior:** Click a filter chip to toggle it on/off without deleting it. Strikethrough styling when disabled.
**SEEIT current:** X button removes filter permanently. No toggle.
**Fix:** Add `enabled: boolean` to each filter object. Click chip body toggles enabled/disabled. Click X removes.
**Code change:**
```tsx
// In filters state, change type to:
{ field: string; operator: string; value: string; enabled: boolean }

// In chip render, add onClick to toggle:
<div onClick={() => {
  const updated = [...filters];
  updated[idx].enabled = !updated[idx].enabled;
  setFilters(updated);
}} style={{ textDecoration: f.enabled ? 'none' : 'line-through', cursor: 'pointer' }}>
```

#### 2. Filter Chips — Pin/Unpin
**Wazuh behavior:** Pin filter icon persists filter across page navigation. Unpin removes it.
**SEEIT current:** No pin/unpin.
**Fix:** Add `pinned: boolean` to filter. Add pin icon button next to X. Store pinned filters in localStorage.
**Code change:**
```tsx
// Add to filter type:
pinned: boolean

// Add pin icon button:
<button onClick={() => { filters[idx].pinned = !filters[idx].pinned; setFilters([...filters]); }}>
  <FiMapPin size={10} style={{ color: f.pinned ? '#005cca' : '#cbd5e1' }} />
</button>
```

#### 3. Filter Chips — Exclude (Negate) Filter
**Wazuh behavior:** Eye/strikethrough icon inverts filter (include → exclude). Shows "NOT" prefix.
**SEEIT current:** No exclude capability.
**Fix:** Add `exclude: boolean` to filter. Render "NOT" prefix when excluded. Add eye icon toggle.
**Code change:**
```tsx
// Add to filter type:
exclude: boolean

// In filter application (lines 193-207):
return Object.entries(alert.fields).some(([key, val]) => {
  const matches = /* existing logic */;
  return f.exclude ? !matches : matches;
});

// In chip render:
<span>{f.exclude ? 'NOT ' : ''}{f.field} {f.operator} {f.value}</span>
```

#### 4. Filter Chips — Edit Inline
**Wazuh behavior:** Click pencil icon on chip to modify filter values.
**SEEIT current:** Must delete and recreate.
**Fix:** Add `editingFilterIdx` state. When pencil clicked, show inline edit form pre-filled with current values.

#### 5. "Clear All" Filters Button
**Wazuh behavior:** "Clear all" removes all non-pinned filters.
**SEEIT current:** No clear all button.
**Fix:** Add button next to "Add filter":
```tsx
{filters.length > 0 && (
  <button onClick={() => { setFilters(filters.filter(f => f.pinned)); toast.success('Filters cleared'); }}>
    Clear all
  </button>
)}
```

#### 6. Histogram — Brush Selection (Click+Drag to Zoom)
**Wazuh behavior:** Click and drag on histogram to select a time sub-range. Double-click to reset.
**SEEIT current:** Single bar click sets time range. No drag-to-zoom.
**Fix:** Add mousedown/mousemove/mouseup handlers on chart canvas to detect drag range. On drag end, set time range to selected bucket range.
**Code change:**
```tsx
// Add drag state:
const [dragStart, setDragStart] = useState<number | null>(null);
const [dragEnd, setDragEnd] = useState<number | null>(null);

// Add onMouseDown on canvas:
onMouseDown={(e) => {
  const chart = chartRef.current;
  if (!chart) return;
  const elements = chart.getElementsAtEventForMode(e.nativeEvent, 'index', { intersect: true }, false);
  if (elements.length > 0) setDragStart(elements[0].index);
}}

// Add onMouseUp:
onMouseUp={(e) => {
  if (dragStart === null) return;
  const chart = chartRef.current;
  const elements = chart.getElementsAtEventForMode(e.nativeEvent, 'index', { intersect: true }, false);
  if (elements.length > 0) {
    const start = Math.min(dragStart, elements[0].index);
    const end = Math.max(dragStart, elements[0].index);
    const startLabel = chartData.labels[start];
    const endLabel = chartData.labels[end];
    setTimeRange(`${startLabel} - ${endLabel}`);
    toast.success(`Time range narrowed to ${startLabel} - ${endLabel}`);
  }
  setDragStart(null);
}}
```

#### 7. Histogram — Hover Tooltip
**Wazuh behavior:** Hover shows exact count + time bucket in tooltip.
**SEEIT current:** Chart.js default tooltip works but not customized.
**Fix:** Already works via Chart.js. Add custom tooltip callback:
```tsx
tooltip: {
  enabled: true,
  callbacks: {
    title: (items) => items[0].label,
    label: (item) => `${item.raw} alerts`
  }
}
```

#### 8. Saved Searches — Persist State
**Wazuh behavior:** Save current search config (query + filters + columns + time range) to localStorage. Open loads saved config. Share generates URL.
**SEEIT current:** Toast placeholders only.
**Fix:** Implement localStorage-based save/load:
```tsx
const [savedSearches, setSavedSearches] = useState(() => {
  return JSON.parse(localStorage.getItem('seeit_saved_searches') || '[]');
});

// Save button handler:
const saveSearch = (name: string) => {
  const search = {
    name,
    query: search,
    filters,
    selectedFields,
    timeRange,
    createdAt: new Date().toISOString()
  };
  const updated = [...savedSearches, search];
  setSavedSearches(updated);
  localStorage.setItem('seeit_saved_searches', JSON.stringify(updated));
  toast.success(`Search "${name}" saved`);
};

// Open button handler:
// Show dropdown of saved searches. Click loads the saved state.
```

#### 9. Inspect — Show Raw Query
**Wazuh behavior:** Inspect button shows Request (raw query DSL), Response, and Statistics tabs.
**SEEIT current:** Toast placeholder.
**Fix:** Show modal with query structure:
```tsx
const inspectQuery = () => {
  const query = {
    index: 'wazuh-alerts-*',
    query: search || '*',
    filters: filters.filter(f => f.enabled),
    timeRange,
    size: 500,
    sort: [{ timestamp: 'desc' }]
  };
  // Show modal with JSON.stringify(query, null, 2)
};
```

#### 10. Share — URL State Encoding
**Wazuh behavior:** Share generates URL with query params for all state.
**SEEIT current:** Toast placeholder.
**Fix:** Encode state in URL search params:
```tsx
const shareSearch = () => {
  const params = new URLSearchParams();
  if (search) params.set('q', search);
  filters.forEach((f, i) => params.set(`f${i}`, JSON.stringify(f)));
  params.set('cols', selectedFields.join(','));
  params.set('timerange', timeRange);
  const url = `${window.location.origin}/events?${params.toString()}`;
  navigator.clipboard.writeText(url);
  toast.success('Search URL copied to clipboard');
};
```

#### 11. Table Sort — Column Header Click
**Wazuh behavior:** Click column header to sort ascending/descending.
**SEEIT current:** No sort.
**Fix:** Add sort state and sort logic:
```tsx
const [sortField, setSortField] = useState<string | null>(null);
const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

const sortedAlerts = [...filteredAlerts].sort((a, b) => {
  if (!sortField) return 0;
  const aVal = a.fields[sortField] || '';
  const bVal = b.fields[sortField] || '';
  return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
});
```

#### 12. Pagination — Client-Side
**Wazuh behavior:** Results paginated (default 50 per page). Prev/next/page number.
**SEEIT current:** All results shown at once.
**Fix:** Add pagination:
```tsx
const [eventsPage, setEventsPage] = useState(1);
const eventsPerPage = 15;
const startIdx = (eventsPage - 1) * eventsPerPage;
const paginatedAlerts = filteredAlerts.slice(startIdx, startIdx + eventsPerPage);
const totalEventPages = Math.ceil(filteredAlerts.length / eventsPerPage);
```

#### 13. Show Dates Toggle — Date Column
**Wazuh behavior:** Toggle shows/hides timestamp column. Date format switches between relative and absolute.
**SEEIT current:** `showDates` state exists but not wired.
**Fix:** Wire toggle to show timestamp in absolute format when enabled.

#### 14. DQL Syntax Validation
**Wazuh behavior:** DQL bar validates query syntax.
**SEEIT current:** No validation.
**Fix:** Add simple validation:
```tsx
// Basic DQL validation
const validateDQL = (query: string) => {
  const validSyntax = /^[\w.*\[\]:"\s\-()<>]+$/;
  return validSyntax.test(query);
};
```

#### 15. Context Menu — Right-Click on Field Values
**Wazuh behavior:** Right-click field value shows "Filter for", "Filter out", "Toggle column", "Copy".
**SEEIT current:** No context menu.
**Fix:** Add custom context menu on field badge click:
```tsx
// Add state for context menu
const [contextMenu, setContextMenu] = useState<{ x: number; y: number; field: string; value: string } | null>(null);

// On field badge click:
onClick={(e) => {
  e.stopPropagation();
  setContextMenu({ x: e.clientX, y: e.clientY, field: key, value: val });
}}

// Render context menu at position
{contextMenu && (
  <div style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 1000, minWidth: '180px' }}>
    <div onClick={() => { setFilters([...filters, { field: contextMenu.field, operator: 'is', value: contextMenu.value, enabled: true, pinned: false, exclude: false }]); setContextMenu(null); }}>Filter for value</div>
    <div onClick={() => { setFilters([...filters, { field: contextMenu.field, operator: 'is', value: contextMenu.value, enabled: true, pinned: false, exclude: true }]); setContextMenu(null); }}>Filter out value</div>
    <div onClick={() => { navigator.clipboard.writeText(`${contextMenu.field}: ${contextMenu.value}`); setContextMenu(null); }}>Copy to clipboard</div>
  </div>
)}
```

#### 16. Auto-Refresh Toggle
**Wazuh behavior:** Toggle auto-refresh at configurable intervals (5s, 15s, 30s, 1m, 5m, etc.)
**SEEIT current:** Manual refresh only.
**Fix:** Add auto-refresh state and useEffect interval:
```tsx
const [autoRefresh, setAutoRefresh] = useState(false);
const [autoRefreshInterval, setAutoRefreshInterval] = useState(60000);

useEffect(() => {
  if (!autoRefresh) return;
  const interval = setInterval(handleRefresh, autoRefreshInterval);
  return () => clearInterval(interval);
}, [autoRefresh, autoRefreshInterval]);
```

---

## AGENTS (Agents.tsx — 590 lines)

### Current State (What Works)
- Agent list with search (line 510-514)
- Agent navigation to detail (lines 541-542)
- Status filter state (line 77, filter logic line 139)
- Deploy wizard with OS selection and install commands (lines 146-430)
- Copy to clipboard for deploy commands (lines 97-101)
- Donut charts for status/OS/groups (lines 449-484)
- Pagination state (lines 78-79, buttons lines 576-580)
- Actions dropdown icon (line 557)

### Missing Workflows

#### 1. Status Filter Buttons (Not Rendered)
**Wazuh:** Click "Active", "Pending", "Disconnected", "Never connected" buttons to filter agents.
**SEEIT:** `filterStatus` state exists but no UI buttons to change it.
**Fix:** Add filter buttons above table:
```tsx
<div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
  {['all', 'active', 'pending', 'disconnected', 'never_connected'].map(s => (
    <button key={s} onClick={() => setFilterStatus(s)}
      style={{ padding: '4px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer',
        background: filterStatus === s ? '#005cca' : '#f1f5f9',
        color: filterStatus === s ? '#fff' : '#475569', fontWeight: filterStatus === s ? 600 : 400 }}>
      {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
    </button>
  ))}
</div>
```

#### 2. Bulk Selection + Bulk Actions
**Wazuh:** Select multiple agents → bulk restart, upgrade, remove, assign to group.
**SEEIT:** Checkboxes render but do nothing.
**Fix:** Add bulk selection state and bulk action bar:
```tsx
const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

// Bulk action bar (appears when selectedAgents.length > 0):
{selectedAgents.length > 0 && (
  <div style={{ display: 'flex', gap: '8px', padding: '8px 16px', background: '#eff6ff', borderRadius: '4px' }}>
    <button onClick={() => toast.success(`${selectedAgents.length} agent(s) restarted`)}>Restart</button>
    <button onClick={() => toast.success(`${selectedAgents.length} agent(s) upgrade queued`)}>Upgrade</button>
    <button onClick={() => toast.success(`${selectedAgents.length} agent(s) removed`)}>Remove</button>
  </div>
)}
```

#### 3. Actions Dropdown (FiMoreHorizontal)
**Wazuh:** Per-agent actions: Restart, Upgrade, Remove, Add to Group.
**SEEIT:** Icon exists, onClick shows generic toast.
**Fix:** Add dropdown menu with specific actions:
```tsx
const [actionsMenuAgent, setActionsMenuAgent] = useState<string | null>(null);

// On click:
onClick={() => setActionsMenuAgent(actionsMenuAgent === agent.id ? null : agent.id)}

// Render dropdown:
{actionsMenuAgent === agent.id && (
  <div style={{ position: 'absolute', right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, minWidth: '160px' }}>
    <div onClick={() => { toast.success(`Agent ${agent.id} restarted`); setActionsMenuAgent(null); }}>Restart agent</div>
    <div onClick={() => { toast.success(`Agent ${agent.id} upgrade queued`); setActionsMenuAgent(null); }}>Upgrade agent</div>
    <div onClick={() => { toast.success(`Agent ${agent.id} removed`); setActionsMenuAgent(null); }}>Remove agent</div>
    <div onClick={() => { toast.success(`Add agent ${agent.id} to group`); setActionsMenuAgent(null); }}>Add to group</div>
  </div>
)}
```

#### 4. Pagination — Wire Page Numbers + Slice Data
**Wazuh:** Page numbers work, data slices per page.
**SEEIT:** State only, no data slicing.
**Fix:**
```tsx
const agentsPerPage = 10;
const startIdx = (currentPage - 1) * agentsPerPage;
const paginatedAgents = filteredAgents.slice(startIdx, startIdx + agentsPerPage);
const totalAgentPages = Math.ceil(filteredAgents.length / agentsPerPage);
```

#### 5. Agent Row Click → Agent Detail
**Wazuh:** Click agent name OR ID opens detail view.
**SEEIT:** ID and name both navigate (already working). ✅

#### 6. Agent Table Column Sort
**Wazuh:** Click column headers to sort.
**SEEIT:** No sort.
**Fix:** Add sort state and sort logic per column.

---

## AGENT DETAIL (AgentDetail.tsx — 763 lines)

### Current State (What Works)
- 3 tabs: Summary (default), Stats (`?tab=stats`), Configuration (`?tab=config`)
- Summary tab shows agent metadata, system inventory, event charts, MITRE, compliance, vulnerabilities, SCA
- Stats tab shows global/interval tables
- Configuration tab shows configuration sections
- Agent metadata display (ID, status, IP, version, OS, group, etc.)

### Missing Workflows

#### 1. Inventory Tab (Missing)
**Wazuh:** Agent detail has 4 tabs: Summary, Stats, Configuration, Inventory. Inventory shows hardware, OS, network, packages, ports, processes, hotfixes.
**SEEIT:** Only 3 tabs. No Inventory tab.
**Fix:** Add Inventory tab with sub-sections:
```tsx
const [agentTab, setAgentTab] = useState<'summary' | 'stats' | 'config' | 'inventory'>('summary');

// Add tab button:
<button onClick={() => { setAgentTab('inventory'); navigate(`/agents/detail?id=${id}&tab=inventory`); }}>
  Inventory
</button>

// Add Inventory content:
{agentTab === 'inventory' && (
  <div>
    {/* Hardware section: CPU, RAM, Board serial */}
    {/* OS section: Name, version, architecture */}
    {/* Network interfaces table */}
    {/* Packages table with search/filter */}
    {/* Ports table */}
    {/* Processes table */}
  </div>
)}
```

#### 2. Security Events Tab (Missing)
**Wazuh:** Agent detail has a Security Events tab showing alerts specific to that agent.
**SEEIT:** Missing.
**Fix:** Add Security Events tab that navigates to Events page with agent filter:
```tsx
<button onClick={() => navigate(`/events?search=agent.id:${id}`)}>
  Security Events
</button>
```

#### 3. Inventory Sub-Tab Filtering
**Wazuh:** Each inventory section (Hardware, OS, Network, Packages, etc.) has its own search/filter.
**SEEIT:** Would need state for active inventory sub-section.

---

## THREAT HUNTING (ThreatHunting.tsx — 541 lines)

### Current State (What Works)
- Dashboard tab with Chart.js doughnut/line charts (lines 249-327)
- Events tab with bar chart + table (lines 333-455)
- Agent name links to detail (line 429)
- Pagination state (lines 445-451)
- Document details flyout (lines 461-536)
- Filter chips display + remove (lines 199-228)
- Export formatted button (line 385)
- Tab switching (lines 97-114)

### Missing Workflows

#### 1. Filters Not Applied to Data
**Wazuh:** Filter chips actually filter the events table and dashboard charts.
**SEEIT:** `eventsData` rendered as-is, no filtering.
**Fix:** Apply filter logic:
```tsx
const filteredEvents = eventsData.filter(ev => {
  return filters.every(f => {
    if (f.key === 'manager.name') return ev.agent?.includes(f.value) || true;
    if (f.key === 'agent.id') return true;
    return true;
  });
});
```

#### 2. Add Filter — Real Popover
**Wazuh:** "Add filter" opens field/operator/value selector.
**SEEIT:** Shows toast placeholder.
**Fix:** Same filter builder as Events.tsx.

#### 3. Time Picker — Interactive
**Wazuh:** Time picker dropdown with presets + custom range.
**SEEIT:** Static display "Last 24 hours" with no interaction.
**Fix:** Add time picker dropdown same as Events.tsx.

#### 4. Histogram — Bar Click
**Wazuh:** Click bars to filter/narrow time.
**SEEIT:** Static bar chart.
**Fix:** Add onClick handler same as Events.tsx.

#### 5. Column Management
**Wazuh:** Add/remove columns in events table.
**SEEIT:** Hardcoded columns.
**Fix:** Add column management same as Events.tsx.

#### 6. Sorting
**Wazuh:** Column header sorting.
**SEEIT:** No sort.
**Fix:** Add sort state and handlers.

#### 7. Pagination — Data Slicing
**Wazuh:** Results paginated.
**SEEIT:** State only.
**Fix:** Slice data: `filteredEvents.slice((currentPage-1)*15, currentPage*15)`.

---

## VULNERABILITY DETECTION (VulnerabilityDetection.tsx — 746 lines)

### Current State (What Works)
- 3 tabs: Dashboard, Inventory, Events (lines 131-147)
- Severity stat boxes navigate to inventory filtered (line 227)
- CVE ID links open NVD (previously wired)
- Agent name/ID links navigate to detail (previously wired)
- Pagination (lines 379-397)
- Document detail flyout (lines 532-741)
- Sort direction toggle (line 329)
- Filter chips display + remove (lines 174-190)
- Charts (bar, doughnut) on dashboard tab

### Missing Workflows

#### 1. Filters Not Applied to Data
**Wazuh:** Filter chips filter the inventory and events tables.
**SEEIT:** Data rendered as-is.
**Fix:** Apply filter logic to both `inventoryRows` and `eventsRows`.

#### 2. Sort Direction Toggle — No Sort Logic
**Wazuh:** `sortDir` toggles but `Array.sort()` never called.
**SEEIT:** Toggle exists (line 329) but data not sorted.
**Fix:**
```tsx
const sortedInventory = [...inventoryRows].sort((a, b) => {
  if (sortDir === 'asc') return a.cve.localeCompare(b.cve);
  return b.cve.localeCompare(a.cve);
});
```

#### 3. Export CSV Button — No Handler
**Wazuh:** Exports table data as CSV file.
**SEEIT:** No onClick.
**Fix:**
```tsx
const exportCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map(row => headers.map(h => row[h]).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  toast.success('CSV exported');
};
```

#### 4. Histogram — Bar Click
**Wazuh:** Click bars to narrow time.
**SEEIT:** Static chart.
**Fix:** Add onClick handler.

#### 5. Add Filter Button — No Handler
**Wazuh:** Opens filter builder.
**SEEIT:** No onClick.
**Fix:** Add filter popover same as Events.tsx.

#### 6. Refresh Button — No Handler
**Wazuh:** Refreshes data.
**SEEIT:** No onClick.
**Fix:** Add toast + simulated refresh.

#### 7. Pagination — Data Slicing
**Wazuh:** Results paginated.
**SEEIT:** State only.
**Fix:** Slice data by currentPage.

---

## MITRE ATT&CK (MitreAttack.tsx — 835+ lines)

### Current State (What Works)
- 4 tabs: Dashboard, Intelligence, Framework, Events (line 204)
- Dashboard tab: line charts, doughnuts, bar charts (lines 344-396)
- Intelligence tab: sidebar with groups/mitigations/software/tactics/techniques (lines 401-481)
- Group detail flyout with software/techniques tables (lines 702-830)
- Framework tab: tactics sidebar + technique grid with filtering (lines 488-630)
- Technique detail panel with "View related alerts" and "View on MITRE ATT&CK" buttons (lines 587-618)
- Events tab: table with MITRE fields (lines 660-693)
- Filter chips display + remove (lines 292-322)

### Missing Workflows

#### 1. Filters Not Applied to Data
**Wazuh:** Filters actually filter events and dashboard charts.
**SEEIT:** `eventsData` rendered as-is.
**Fix:** Apply filter logic.

#### 2. Framework — Click Tactic → Filter Techniques
**Wazuh:** Clicking a tactic in the left panel filters the techniques grid.
**SEEIT:** `selectedTactic` state exists and filters techniques ✅. But clicking a technique should also show related alerts below.
**Fix:** When technique selected, show related alerts table below the detail panel.

#### 3. Intelligence — All Resource Types
**Wazuh:** Intelligence tab shows 5 resource types: groups, mitigations, software, tactics, techniques. Each has its own table and flyout.
**SEEIT:** Only shows groups in the list. Other tabs (mitigations, software, tactics, techniques) exist in sidebar but click handlers may not work.
**Fix:** Wire each intel sub-tab to show appropriate data.

#### 4. Intelligence — Search Across All Resources
**Wazuh:** Search input searches across all MITRE resources simultaneously.
**SEEIT:** Search input exists but does nothing.
**Fix:** Wire search to filter across selected resource type.

#### 5. Dashboard — Chart Click → Filter
**Wazuh:** Click a chart segment/bar to add a filter.
**SEEIT:** Charts are static.
**Fix:** Add onClick to charts that adds filter chips.

#### 6. Events — Expand Event Detail
**Wazuh:** Click expand on event row to see full document in Table/JSON.
**SEEIT:** No expand on events rows. No detail flyout.
**Fix:** Add document detail flyout same as ThreatHunting.

#### 7. Events — Pagination + Sorting
**Wazuh:** Paginated, sortable.
**SEEIT:** No pagination, no sort.
**Fix:** Add both.

#### 8. Filter Chips — Add Filter
**Wazuh:** "Add filter" opens filter builder.
**SEEIT:** No handler on "Add filter" button.
**Fix:** Add filter popover.

---

## COMPLIANCE (Gdpr.tsx, PciDss.tsx, Hipaa.tsx, Nist80053.tsx, Tsc.tsx)

### Current State (What Works)
All 5 compliance pages share identical structure:
- 3 tabs: Dashboard, Controls, Events
- Dashboard tab: SVG donut charts, bar chart
- Controls tab: sidebar requirements + requirements grid
- Events tab: static bar chart + table
- Filter chips display + remove
- Gdpr: sidebar click filters requirements grid ✅ (recently wired)
- Gdpr: requirement card click switches to events ✅ (recently wired)

### Missing Workflows (All 5 Pages)

#### 1. Filters Not Applied to Data
**Wazuh:** Filter chips filter the events table.
**SEEIT:** Data rendered as-is.
**Fix:** Apply filter logic.

#### 2. Dashboard Charts — Static SVGs
**Wazuh:** Charts are interactive (Chart.js). Click segments to filter.
**SEEIT:** Hand-drawn SVGs. Not interactive.
**Fix:** Replace SVGs with Chart.js components. Add onClick to filter.

#### 3. Controls Tab — Requirement → Evidence Drill-Down
**Wazuh:** Click a requirement → shows controls that map to it → shows evidence for each control.
**SEEIT:** Requirement card click switches to events tab (Gdpr). Others: no interaction.
**Fix:** Add evidence detail panel below the grid showing related alerts/evidence.

#### 4. Events Tab — Static Bar Chart
**Wazuh:** Events histogram updates with filters.
**SEEIT:** Static SVG bars. Not interactive.
**Fix:** Replace with Chart.js Bar component + onClick.

#### 5. Events Tab — No Pagination
**Wazuh:** Paginated results.
**SEEIT:** All results shown at once.
**Fix:** Add pagination.

#### 6. Events Tab — No Expand
**Wazuh:** Expand event to see full details.
**SEEIT:** No expand capability.
**Fix:** Add document detail flyout.

#### 7. Controls Tab — Search/Filter
**Wazuh:** Search input filters requirements.
**SEEIT:** Input exists but does nothing.
**Fix:** Wire search to filter requirements.

#### 8. Controls Tab — "Hide Requirements with No Alerts" Toggle
**Wazuh:** Toggle hides requirements with 0 alerts.
**SEEIT:** Toggle exists, filter partially works (Gdpr).
**Fix:** Ensure filter works across all 5 compliance pages.

---

## ALERTING (Alerting.tsx — 507 lines)

### Current State (What Works)
- 3 tabs: Alerts, Monitors, Destinations
- Alerts tab: checkbox selection, View Alert Details, Acknowledge buttons
- Alert detail flyout (recently added)
- Monitors tab: empty state with Create monitor button
- Destinations tab: redirect notice
- Create monitor wizard (multi-step form)
- Severity display with color coding

### Missing Workflows

#### 1. Alert Detail Flyout — More Fields
**Wazuh:** Shows rule.id, rule.description, rule.level, agent.name, agent.id, rule.groups, MITRE ATT&CK, compliance frameworks, full log message.
**SEEIT:** Shows basic fields. Missing: rule groups, MITRE, compliance, full log.
**Fix:** Add more fields to the flyout.

#### 2. Severity Filter Dropdown
**Wazuh:** Filter alerts by severity level (Critical, High, Medium, Low, Info).
**SEEIT:** Dropdown exists but does nothing (line 266-267).
**Fix:** Wire dropdown to filter `mockAlertRows`.

#### 3. Alert Type Filter Dropdown
**Wazuh:** Filter by alert type (All alerts, Active, Acknowledged).
**SEEIT:** Dropdown exists but does nothing (line 268-270).
**Fix:** Wire dropdown.

#### 4. Search Bar
**Wazuh:** Search bar filters alerts by text.
**SEEIT:** Search input exists but does nothing.
**Fix:** Wire search to filter.

#### 5. Monitors Tab — Monitors Table
**Wazuh:** Shows list of configured monitors with state, type, latest alert, actions.
**SEEIT:** Empty state only.
**Fix:** Add mock monitors data and table.

#### 6. Monitors — Actions Dropdown
**Wazuh:** Per-monitor actions: Start, Stop, Edit, Delete.
**SEEIT:** No actions.
**Fix:** Add actions dropdown.

#### 7. Acknowledge — Update Status
**Wazuh:** Acknowledging an alert updates its status in the table.
**SEEIT:** Toast only, no status update.
**Fix:** Update the alert row's `ack` count.

---

## SETTINGS (Settings.tsx — 5847 lines)

### Current State (What Works)
- Dev Tools tab: console with query editor, execute button, response viewer, welcome drawer
- Security tab: Users table, Create User modal, Roles table, Policies table with pagination
- Multiple configuration sub-views (Global, Alerts, Policy monitoring, etc.)
- Statistics view with charts
- Logs view with search and real-time toggle

### Missing Workflows

#### 1. Dev Tools — Response Not Cleared on Execute
**Wazuh:** Execute clears previous response, shows new result.
**SEEIT:** Response appends (actually replaces ✅).
**Fix:** Already works correctly.

#### 2. Security — Role Assignment on User Create
**Wazuh:** Can assign multiple roles when creating a user.
**SEEIT:** Single role select.
**Fix:** Change to multi-select or add role assignment after creation.

#### 3. Security — User Edit
**Wazuh:** Can edit user roles.
**SEEIT:** No edit capability.
**Fix:** Add edit button → modal pre-filled with current user data.

#### 4. Configuration — All Sub-Views
**Wazuh:** Each config section shows actual agent/manager configuration.
**SEEIT:** Most sections show read-only values.
**Fix:** This is acceptable for a mock UI.

---

## REPORTING (Reporting.tsx — 264 lines)

### Current State
- Report creation form with type, date range, format selection
- Report generation with loading state
- Report list table (empty)

### Missing Workflows

#### 1. Export CSV/PDF
**Wazuh:** Export report as CSV or PDF.
**SEEIT:** Download button exists but shows toast.
**Fix:** Generate actual CSV/PDF file.

#### 2. Report Validation
**Wazuh:** Validates date range, format before generating.
**SEEIT:** No validation.
**Fix:** Add validation.

---

## VISUALIZE / DASHBOARDS (Dashboards.tsx — 599 lines, Visualize.tsx)

### Current State
- Dashboard page with sample data add/remove buttons
- Module cards that navigate to respective routes
- "Add data" toggles sample data status

### Missing Workflows

#### 1. Every Visualization Card Must Perform an Action
**Wazuh:** Dashboard cards are interactive charts. Click to drill down.
**SEEIT:** Cards are static. "Add data" buttons exist but don't create real visualizations.
**Fix:** Make cards interactive with real chart.js visualizations.

---

## FIM (Fim.tsx), SCA (Sca.tsx), MALWARE DETECTION (MalwareDetection.tsx)

### Current State
- All three follow similar pattern: Dashboard + Events tabs
- Charts are static or SVG-based
- Events tables show mock data
- No filter application
- No interactive charts

### Missing Workflows

#### 1. Filters Not Applied
**Fix:** Apply filter logic to events data.

#### 2. Charts Not Interactive
**Fix:** Replace SVGs with Chart.js + onClick handlers.

#### 3. No Pagination
**Fix:** Add pagination.

#### 4. No Event Expand
**Fix:** Add document detail flyout.

---

## GROUPS (Groups.tsx)

### Current State
- Agent group listing with search
- Group configuration editor
- Agent assignment to groups

### Missing Workflows

#### 1. Group Actions
**Wazuh:** Create group, delete group, edit configuration, manage files.
**SEEIT:** Basic listing only.
**Fix:** Add group actions dropdown.

---

## GLOBAL REQUIREMENTS

### Every Visible Interaction Must Perform a Meaningful Action

| Element | Current State | Required Fix |
|---------|--------------|--------------|
| All "Add filter" buttons | Toast placeholder or no handler | Real filter builder popover |
| All filter chip X buttons | Remove filter | Add toggle, pin, exclude, edit |
| All time pickers | Some static | All interactive with presets |
| All histograms | Some static | All clickable with time narrow |
| All "Export" buttons | Toast or no handler | Real CSV export |
| All pagination controls | State only | Data slicing |
| All search inputs | Some uncontrolled | All wire to filter logic |
| All table headers | No sort | All sortable |
| All "Columns" buttons | No handler | Dynamic column management |
| All "Inspect" buttons | Toast placeholder | Show raw query |
| All "Save" buttons | Toast placeholder | localStorage persistence |
| All "Share" buttons | Toast placeholder | URL state encoding |

### react-hot-toast Usage
**Requirement:** Every action must provide feedback.
**Current:** Events.tsx (13 calls), ThreatHunting (7 calls), VulnerabilityDetection (0 calls), Dashboard (0 calls), Gdpr/PciDss/Hipaa/Nist/Tsc (0 calls).
**Fix:** Add toast calls to all interactive elements across all pages.

---

## IMPLEMENTATION PRIORITY

### Phase 1 — Critical (Days 1-3)
1. **Events.tsx:** Filter chips toggle/pin/exclude/edit, Clear All, saved searches, inspect, share URL, pagination, column sort, context menu
2. **Agents.tsx:** Status filter buttons, bulk selection, bulk actions, actions dropdown, pagination data slicing
3. **VulnerabilityDetection.tsx:** Apply filters to data, sort logic, export CSV, add filter button handler, refresh handler, histogram click, pagination slicing

### Phase 2 — High (Days 4-6)
4. **ThreatHunting.tsx:** Apply filters to data, real filter popover, interactive time picker, histogram click, column management, sort, pagination slicing
5. **MITRE ATT&CK:** Apply filters to data, intelligence resource tabs, dashboard chart clicks, events expand/pagination/sort, add filter handler
6. **AgentDetail.tsx:** Add Inventory tab, Security Events tab

### Phase 3 — Medium (Days 7-9)
7. **Compliance pages (all 5):** Apply filters, replace SVGs with Chart.js, events expand/pagination/sort, controls search, requirement → evidence drill-down
8. **Alerting:** Wire severity/type/search filters, monitor table, acknowledge status update, richer flyout
9. **FIM, SCA, Malware Detection:** Apply filters, Chart.js charts, pagination, event expand

### Phase 4 — Low (Days 10-12)
10. **Settings:** Security user edit, role multi-select
11. **Reporting:** Real CSV/PDF export, validation
12. **Visualize/Dashboards:** Interactive charts
13. **Groups:** Group actions

---

## CODE CHANGE REFERENCE

### Common Pattern: Filter Builder Popover (Reusable Across All Pages)

```tsx
// Add to each page that has filters:
const [showFilterPopover, setShowFilterPopover] = useState(false);
const [filterField, setFilterField] = useState('agent.name');
const [filterOperator, setFilterOperator] = useState('is');
const [filterValue, setFilterValue] = useState('');

// Filter popover JSX:
{showFilterPopover && (
  <div style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <select value={filterField} onChange={e => setFilterField(e.target.value)}>
        {availableFields.map(f => <option key={f} value={f}>{f}</option>)}
      </select>
      <select value={filterOperator} onChange={e => setFilterOperator(e.target.value)}>
        <option value="is">is</option>
        <option value="is not">is not</option>
        <option value="exists">exists</option>
        <option value="does not exist">does not exist</option>
        <option value=">">&gt;</option>
        <option value="<">&lt;</option>
      </select>
      {filterOperator !== 'exists' && filterOperator !== 'does not exist' && (
        <input type="text" value={filterValue} onChange={e => setFilterValue(e.target.value)} placeholder="Value" />
      )}
    </div>
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <button onClick={() => { setShowFilterPopover(false); setFilterValue(''); }}>Cancel</button>
      <button onClick={() => {
        setFilters([...filters, { field: filterField, operator: filterOperator, value: filterValue, enabled: true, pinned: false, exclude: false }]);
        setShowFilterPopover(false);
        setFilterValue('');
        toast.success(`Filter added: ${filterField} ${filterOperator} ${filterValue}`);
      }}>Save</button>
    </div>
  </div>
)}
```

### Common Pattern: Pagination

```tsx
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 15;
const startIdx = (currentPage - 1) * itemsPerPage;
const paginatedData = filteredData.slice(startIdx, startIdx + itemsPerPage);
const totalPages = Math.ceil(filteredData.length / itemsPerPage);

// Render pagination controls:
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <span>Rows per page: {itemsPerPage}</span>
  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
    <span style={{ cursor: currentPage > 1 ? 'pointer' : 'not-allowed' }} onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>&lt;</span>
    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(p => (
      <span key={p} onClick={() => setCurrentPage(p)} style={{ cursor: 'pointer', fontWeight: currentPage === p ? 600 : 400, color: currentPage === p ? '#005cca' : '#475569' }}>{p}</span>
    ))}
    {totalPages > 5 && <span>...</span>}
    {totalPages > 5 && <span onClick={() => setCurrentPage(totalPages)} style={{ cursor: 'pointer' }}>{totalPages}</span>}
    <span style={{ cursor: currentPage < totalPages ? 'pointer' : 'not-allowed' }} onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}>&gt;</span>
  </div>
</div>
```

### Common Pattern: Document Detail Flyout

```tsx
const [detailAlert, setDetailAlert] = useState<any>(null);

{detailAlert && (
  <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '520px', background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
      <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Document Details</h2>
      <button onClick={() => setDetailAlert(null)}><FiX size={20} /></button>
    </div>
    <div style={{ display: 'flex', gap: '24px', padding: '0 24px', borderBottom: '1px solid #e2e8f0' }}>
      <button onClick={() => setModalTab('table')}>Table</button>
      <button onClick={() => setModalTab('json')}>JSON</button>
    </div>
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
      {modalTab === 'table' ? (
        Object.entries(detailAlert).map(([key, val]) => (
          <div key={key} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', paddingBottom: '12px', borderBottom: '1px dashed #e2e8f0' }}>
            <span style={{ color: '#475569' }}>{key}</span>
            <span style={{ color: '#1e293b' }}>{String(val)}</span>
          </div>
        ))
      ) : (
        <pre style={{ fontSize: '12px' }}>{JSON.stringify(detailAlert, null, 2)}</pre>
      )}
    </div>
  </div>
)}
```

### Common Pattern: CSV Export

```tsx
const exportCSV = (data: Record<string, any>[], filename: string) => {
  if (data.length === 0) { toast.error('No data to export'); return; }
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`${filename} exported as CSV`);
};
```

---

*Generated by workflow parity analysis. Last updated: June 2026.*
