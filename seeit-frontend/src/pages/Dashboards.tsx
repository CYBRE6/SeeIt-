import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiSearch, FiRefreshCw, FiDownload, FiUpload, FiTrash2, FiChevronDown, FiChevronUp, FiPlus, FiSettings, FiHelpCircle, FiLink } from 'react-icons/fi';

type SubPage = 'welcome' | 'index-patterns' | 'data-sources' | 'create-data-source' | 'saved-objects' | 'advanced-settings';

/* ── Index patterns mock data ── */
const indexPatterns = [
  { name: 'wazuh-alerts-*', isDefault: true },
  { name: 'wazuh-monitoring-*' },
  { name: 'wazuh-states-inventory-*' },
  { name: 'wazuh-states-inventory-browser-extensions-*' },
  { name: 'wazuh-states-inventory-groups-*' },
  { name: 'wazuh-states-inventory-hardware-*' },
  { name: 'wazuh-states-inventory-hotfixes-*' },
  { name: 'wazuh-states-inventory-interfaces-*' },
  { name: 'wazuh-states-inventory-networks-*' },
  { name: 'wazuh-states-inventory-packages-*' },
  { name: 'wazuh-states-inventory-ports-*' },
  { name: 'wazuh-states-inventory-processes-*' },
  { name: 'wazuh-states-inventory-protocols-*' },
  { name: 'wazuh-states-inventory-services-*' },
  { name: 'wazuh-states-inventory-system-*' },
  { name: 'wazuh-states-inventory-users-*' },
  { name: 'wazuh-states-vulnerabilities-*' },
  { name: 'wazuh-statistics-*' },
];

/* ── Saved objects mock data ── */
const savedObjects = [
  { type: 'settings', title: 'Advanced Settings [2.19.5]', updated: 'Jun 11, 2026 @ 01:29:26.246' },
  { type: 'indexPattern', title: 'wazuh-monitoring-*',                          updated: 'Jun 11, 2026 @ 01:29:22.109' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-interfaces-*',         updated: 'Jun 12, 2026 @ 22:15:08.669' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-packages-*',           updated: 'Jun 12, 2026 @ 22:09:28.701' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-processes-*',          updated: 'Jun 12, 2026 @ 22:10:14.692' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-protocols-*',          updated: 'Jun 12, 2026 @ 22:15:27.137' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-networks-*',           updated: 'Jun 12, 2026 @ 22:15:06.189' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-hotfixes-*',           updated: 'Jun 12, 2026 @ 22:09:29.662' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-ports-*',              updated: 'Jun 12, 2026 @ 22:25:59.238' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-browser-extensions-*', updated: 'Jun 12, 2026 @ 22:09:45.641' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-groups-*',             updated: 'Jun 12, 2026 @ 22:28:47.038' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-users-*',              updated: 'Jun 12, 2026 @ 22:28:45.305' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-services-*',           updated: 'Jun 12, 2026 @ 22:29:14.530' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-*',                    updated: 'Jun 12, 2026 @ 23:00:41.708' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-system-*',             updated: 'Jun 12, 2026 @ 23:02:44.653' },
  { type: 'indexPattern', title: 'wazuh-states-inventory-hardware-*',           updated: 'Jun 12, 2026 @ 23:02:44.735' },
  { type: 'indexPattern', title: 'wazuh-statistics-*',                          updated: 'Jun 12, 2026 @ 23:42:08.083' },
  { type: 'indexPattern', title: 'wazuh-alerts-*',                              updated: 'Jun 13, 2026 @ 15:29:26.871' },
  { type: 'indexPattern', title: 'wazuh-states-vulnerabilities-*',              updated: 'Jun 13, 2026 @ 15:36:02.660' },
];

const sidebarLink = (active: boolean): React.CSSProperties => ({
  display: 'block', padding: '5px 0', fontSize: '13px', cursor: 'pointer',
  color: active ? '#005cca' : '#334155', fontWeight: active ? 600 : 400,
  textDecoration: 'none', background: 'none', border: 'none', textAlign: 'left'
});

const btn = (primary = false): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: '6px',
  padding: '7px 14px', borderRadius: '4px', fontSize: '13px',
  fontWeight: 600, cursor: 'pointer', border: '1px solid',
  background: primary ? '#005cca' : '#ffffff',
  color: primary ? '#ffffff' : '#334155',
  borderColor: primary ? '#005cca' : '#cbd5e1'
});

const Toggle: React.FC<{ checked: boolean }> = ({ checked }) => (
  <div style={{ width: '36px', height: '20px', borderRadius: '10px', background: checked ? '#005cca' : '#cbd5e1', position: 'relative', cursor: 'pointer' }}>
    <div style={{ position: 'absolute', top: '2px', left: checked ? '18px' : '2px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
  </div>
);

const advancedSettingsData = [
  { group: 'General', items: [
    { key: 'csv:quoteValues', label: 'Quote CSV values', desc: 'Should values be quoted in csv exports?', type: 'toggle', value: true },
    { key: 'csv:separator', label: 'CSV separator', desc: 'Separate exported values with this string', type: 'text', value: ',' },
    { key: 'data:withLongNumerals', label: 'Extend Numeric Precision', desc: 'Turn on for precise handling of extremely large numbers. Turn off to optimize performance when high precision for large values isn\'t required.', type: 'toggle', value: true },
    { key: 'dateFormat', label: 'Date format', desc: 'When displaying a pretty formatted date, use this format', type: 'text', value: 'MMM D, YYYY @ HH:mm:ss.SSS' },
    { key: 'dateFormat:dow', label: 'Day of week', desc: 'What day should weeks start on?', type: 'select', value: 'Sunday' },
    { key: 'dateFormat:scaled', label: 'Scaled date format', desc: 'Values that define the format used in situations where time-based data is rendered in order, and formatted timestamps should adapt to the interval between measurements. Keys are ISO8601 intervals.', type: 'json', value: '[\n  ["", "HH:mm:ss.SSS"],\n  ["PT1S", "HH:mm:ss"],\n  ["PT1M", "HH:mm"],\n  ["PT1H", "YYYY-MM-DD HH:mm"],\n  ["P1DT", "YYYY-MM-DD"],\n  ["P1YT", "YYYY"]\n]' },
    { key: 'dateFormat:tz', label: 'Timezone for date formatting', desc: 'Which timezone should be used. "Browser" will use the timezone detected by your browser.', type: 'select', value: 'Browser' },
    { key: 'dateNanosFormat', label: 'Date with nanoseconds format', desc: 'Used for the date_nanos datatype of OpenSearch', type: 'text', value: 'MMM D, YYYY @ HH:mm:ss.SSSSSSSSS' },
    { key: 'defaultIndex', label: 'Default index', desc: 'The index to access if no index is set\n\nDefault: null', type: 'text', value: 'wazuh-alerts-*', hasReset: true },
    { key: 'defaultRoute', label: 'Default route', desc: 'This setting specifies the default route when opening OpenSearch Dashboards. You can use this setting to modify the landing page when opening OpenSearch Dashboards. The route must be a relative URI.', type: 'text-disabled', value: '/app/wz-home' },
    { key: 'fields:popularLimit', label: 'Popular fields limit', desc: 'The top N most popular fields to show', type: 'text', value: '10' },
    { key: 'filterEditor:suggestValues', label: 'Filter editor suggest values', desc: 'Set this property to false to prevent the filter editor from suggesting values for fields.', type: 'toggle', value: true },
    { key: 'filters:pinnedByDefault', label: 'Pin filters by default', desc: 'Whether the filters should have a global state (be pinned) by default', type: 'toggle', value: false },
    { key: 'format:bytes:defaultPattern', label: 'Bytes format', desc: 'Default numeral format for the "bytes" format', type: 'text', value: '0,0.[0]b' },
    { key: 'format:currency:defaultPattern', label: 'Currency format', desc: 'Default numeral format for the "currency" format', type: 'text', value: '($0,0.[00])' },
    { key: 'format:defaultTypeMap', label: 'Field type format name', desc: 'Map of the format name to use by default for each field type. "_default_" is used if the field type is not mentioned explicitly', type: 'json', value: '{\n  "ip": { "id": "ip", "params": {} },\n  "date": { "id": "date", "params": {} },\n  "date_nanos": { "id": "date_nanos", "params": {}, "opensearch": true },\n  "number": { "id": "number", "params": {} },\n  "boolean": { "id": "boolean", "params": {} },\n  "_source": { "id": "_source", "params": {} },\n  "_default_": { "id": "string", "params": {} }\n}' },
    { key: 'format:number:defaultLocale', label: 'Formatting locale', desc: 'Numeral language locale', type: 'select', value: 'en' },
    { key: 'format:number:defaultPattern', label: 'Number format', desc: 'Default numeral format for the "number" format', type: 'text', value: '0,0.[000]' },
    { key: 'format:percent:defaultPattern', label: 'Percent format', desc: 'Default numeral format for the "percent" format', type: 'text', value: '0,0.[000]%' },
    { key: 'histogram:barTarget', label: 'Target bars', desc: 'Attempt to generate around this many bars when using "auto" interval in date histograms', type: 'text', value: '50' },
    { key: 'histogram:maxBars', label: 'Maximum bars', desc: 'Never show more than this many bars in date histograms, scale values if needed', type: 'text', value: '100' },
    { key: 'history:limit', label: 'History limit', desc: 'In fields that have history (e.g. query inputs), show this many recent values', type: 'text', value: '10' },
    { key: 'indexPattern:placeholder', label: 'Index pattern placeholder', desc: 'The placeholder for the "Index pattern name" field in "Management > Index Patterns > Create Index Pattern".', type: 'text', value: '' },
    { key: 'metaFields', label: 'Meta fields', desc: 'Fields that exist outside of _source to merge into our document when displaying it\n\nDefault: _source, _id, _type, _index, _score', type: 'text', value: '_source, _index', hasReset: true },
    { key: 'metrics:max_buckets', label: 'Maximum buckets', desc: 'The maximum number of buckets a single datasource can return', type: 'text', value: '2000' },
    { key: 'query:allowLeadingWildcards', label: 'Allow leading wildcards in query', desc: 'When set, * is allowed as the first character in a query clause. Currently only applies when experimental query features are enabled in the query bar. To disallow leading wildcards in basic lucene queries, use query:queryString:options.', type: 'toggle', value: true },
    { key: 'query:queryString:options', label: 'Query string options', desc: 'Options for the lucene query string parser. Is only used when "Query language" is set to Lucene.', type: 'json', value: '{ "analyze_wildcard": true }' },
    { key: 'reporting:useFOR', label: 'Reporting use ForeignObject rendering', desc: 'Whether to use ForeignObject rendering when generating reports. If it causes issues, try disabling this option.', type: 'toggle', value: true },
    { key: 'reporting:useOcr', label: 'Reporting use OCR on PDF', desc: 'Whether to run optical character recognition on PDF reports to make text selectable', type: 'toggle', value: false },
    { key: 'savedObjects:listingLimit', label: 'Objects listing limit', desc: 'Number of objects to fetch for the listing pages', type: 'text', value: '1000' },
    { key: 'savedObjects:perPage', label: 'Objects per page', desc: 'Number of objects to show per page in the load dialog', type: 'text', value: '20' },
    { key: 'search:queryLanguage', label: 'Query language', desc: 'Query language used by the query bar. DQL is a new language built specifically for OpenSearch Dashboards.', type: 'select', value: 'DQL' },
    { key: 'search:queryLanguageBlocklist', label: 'Additional query languages blocklist', desc: 'Additional languages that are blocked from being used in the query editor. Note: DQL and Lucene will not be blocked even if set.', type: 'text', value: 'none' },
    { key: 'shortDots:enable', label: 'Shorten fields', desc: 'Shorten long fields, for example, instead of foo.bar.baz, show f.b.baz', type: 'toggle', value: false },
    { key: 'sort:options', label: 'Sort options', desc: 'Options for the OpenSearch sort parameter', type: 'json', value: '{ "unmapped_type": "boolean" }' },
    { key: 'state:storeInSessionStorage', label: 'Store URLs in session storage', desc: 'The URL can sometimes grow to be too large for some browsers to handle. To counter-act this we are testing if storing parts of the URL in session storage could help. Please let us know how it goes!', type: 'toggle', value: false },
    { key: 'timepicker:quickRanges', label: 'Time filter quick ranges', desc: 'The list of ranges to show in the Quick section of the time filter. This should be an array of objects, with each object containing "from", "to" (see accepted formats), and "display" (the title to be displayed).', type: 'json', value: '[\n  {\n    "from": "now/d",\n    "to": "now/d",\n    "display": "Today"\n  },\n  {\n    "from": "now/w",\n    "to": "now/w",\n    "display": "This week"\n  },\n  {\n    "from": "now-15m",\n    "to": "now",\n    "display": "Last 15 minutes"\n  },\n  {\n    "from": "now-30m",\n    "to": "now",\n    "display": "Last 30 minutes"\n  },\n  {\n    "from": "now-1h",\n    "to": "now",\n    "display": "Last 1 hour"\n  },\n  {\n    "from": "now-24h",\n    "to": "now",\n    "display": "Last 24 hours"\n  }\n]' },
    { key: 'timepicker:refreshIntervalDefaults', label: 'Time filter refresh interval', desc: 'The timefilter\'s default refresh interval. The "value" needs to be specified in milliseconds.', type: 'json', value: '{\n  "pause": false,\n  "value": 0\n}' },
    { key: 'timepicker:timeDefaults', label: 'Time filter defaults', desc: 'The timefilter selection to use when OpenSearch Dashboards is started without one\n\nDefault:\n{\n  "from": "now-15m",\n  "to": "now"\n}', type: 'json', value: '{ "from": "now-24h", "to": "now" }', hasReset: true },
    { key: 'truncate:maxHeight', label: 'Maximum table cell height', desc: 'The maximum height that a cell in a table should occupy. Set to 0 to disable truncation', type: 'text', value: '115' },
  ]},
  { group: 'Appearance', items: [
    { key: 'accessibility:disableAnimations', label: 'Disable Animations', desc: 'Turn off all unnecessary animations in the OpenSearch Dashboards UI. Refresh the page to apply the changes.', type: 'toggle', value: false },
    { key: 'pageNavigation', label: 'Side nav style', desc: 'Change the style of navigation', type: 'select', value: 'Modern' },
    { key: 'theme:darkMode', label: 'Dark mode', desc: 'Enable a dark mode for the OpenSearch Dashboards UI. A page refresh is required for the setting to be applied.', type: 'toggle', value: false },
    { key: 'theme:version', label: 'Theme version', desc: 'Switch between the themes used for the current and next versions of OpenSearch Dashboards. A page refresh is required for the setting to be applied.', type: 'select', value: 'v7', hasLink: 'Theme feedback' },
  ]},
  { group: 'Discover', items: [
    { key: 'context:defaultSize', label: 'Context size', desc: 'The number of surrounding entries to show in the context view', type: 'text', value: '5' },
    { key: 'context:step', label: 'Context size step', desc: 'The step size to increment or decrement the context size by', type: 'text', value: '5' },
    { key: 'context:tieBreakerFields', label: 'Tie breaker fields', desc: 'A comma-separated list of fields to use for tie-breaking between documents that have the same timestamp value. From this list the first field that is present and sortable in the current index pattern is used.', type: 'text', value: '_doc' },
    { key: 'defaultColumns', label: 'Default columns', desc: 'Columns displayed by default in the Discovery tab', type: 'text', value: '_source' },
    { key: 'discover:aggs:terms:size', label: 'Number of terms', desc: 'Determines how many terms will be visualized when clicking the "visualize" button, in the field drop downs, in the discover sidebar.', type: 'text', value: '20' },
    { key: 'discover:modifyColumnsOnSwitch', label: 'Modify columns when changing index patterns', desc: 'Remove columns that not available in the new index pattern.', type: 'toggle', value: true },
    { key: 'discover:sampleSize', label: 'Number of rows', desc: 'The number of rows to show in the table', type: 'text', value: '500' },
    { key: 'discover:searchOnPageLoad', label: 'Search on page load', desc: 'Controls whether a search is executed when Discover first loads. This setting does not have an effect when loading a saved search.', type: 'toggle', value: true },
    { key: 'discover:sort:defaultOrder', label: 'Default sort direction', desc: 'Controls the default sort direction for time based index patterns in the Discover app.', type: 'select', value: 'Descending' },
    { key: 'doc_table:hideTimeColumn', label: 'Hide \'Time\' column', desc: 'Hide the \'Time\' column in Discover and in all Saved Searches on Dashboards.', type: 'toggle', value: false },
    { key: 'doc_table:highlight', label: 'Highlight results', desc: 'Highlight results in Discover and Saved Searches Dashboard. Highlighting makes requests slow when working on big documents.', type: 'toggle', value: true },
  ]},
  { group: 'Notifications', items: [
    { key: 'notifications:banner', label: 'Custom banner notification', desc: 'A custom banner intended for temporary notices to all users. Markdown supported.', type: 'json', value: '' },
    { key: 'notifications:lifetime:banner', label: 'Banner notification lifetime', desc: 'The time in milliseconds which a banner notification will be displayed on-screen for. Setting to Infinity will disable the countdown.', type: 'text', value: '3000000' },
    { key: 'notifications:lifetime:error', label: 'Error notification lifetime', desc: 'The time in milliseconds which an error notification will be displayed on-screen for. Setting to Infinity will disable.', type: 'text', value: '300000' },
    { key: 'notifications:lifetime:info', label: 'Info notification lifetime', desc: 'The time in milliseconds which an information notification will be displayed on-screen for. Setting to Infinity will disable.', type: 'text', value: '5000' },
    { key: 'notifications:lifetime:warning', label: 'Warning notification lifetime', desc: 'The time in milliseconds which a warning notification will be displayed on-screen for. Setting to Infinity will disable.', type: 'text', value: '10000' },
  ]},
  { group: 'Search', items: [
    { key: 'courier:batchSearches', label: 'Batch concurrent searches', desc: 'When disabled, dashboard panels will load individually, and search requests will terminate when users navigate away or update the query. When enabled, dashboard panels will load together when all of the data is loaded, and searches will not terminate.', type: 'toggle', value: false },
    { key: 'courier:customRequestPreference', label: 'Custom request preference', desc: 'Request Preference used when courier:setRequestPreference is set to "custom".', type: 'text', value: '_local' },
    { key: 'courier:ignoreFilterIfFieldNotInIndex', label: 'Ignore filter(s)', desc: 'This configuration enhances support for dashboards containing visualizations accessing dissimilar indexes. When disabled, all filters are applied to all visualizations. When enabled, filter(s) will be ignored for a visualization when the visualization\'s index does not contain the filtering field.', type: 'toggle', value: false },
    { key: 'courier:maxConcurrentShardRequests', label: 'Max Concurrent Shard Requests', desc: 'Controls the max_concurrent_shard_requests setting used for _msearch requests sent by OpenSearch Dashboards. Set to 0 to disable this config and use the OpenSearch default.', type: 'text', value: '0' },
    { key: 'courier:setRequestPreference', label: 'Request preference', desc: 'Allows you to set which shards handle your search requests.\n• Session ID: restricts operations to execute all search requests on the same shards. This has the benefit of reusing shard caches across requests.\n• Custom: allows you to define a your own preference. Use \'courier:customRequestPreference\' to customize your preference value.\n• None: means do not set a preference. This might provide better performance because requests can be spread across all shard copies. However, results might be inconsistent because different shards might be in different refresh states.', type: 'select', value: 'Session ID' },
    { key: 'query:dataframe:hydrationStrategy', label: 'Data frame hydration strategy', desc: 'Allows you to set how often the data frame schema is updated.\n• On data source change: hydrates the schema when the data source changes. For example, any time the index pattern is change the data frame schema is hydrated.\n• Per query: hydrates the schema per query to the data source. Could be expensive, but ensures the schema of the data frame fits the result set.\n• Per response: hydrates the schema if the data source returns a schema. Not implemented.\n• Advanced: hydrates the schema in intervals. If the schema hasn\'t changed the interval increases. If the schema has changed the interval resets. Not implemented.\n\nExperimental: Requires query enhancements enabled.', type: 'select', value: 'On data source change' },
    { key: 'query:enhancements:enabled', label: 'Enable query enhancements', desc: 'Experimental: Allows users to query data using enhancements where available. If disabled, only querying and querying languages that are considered production-ready are available to the user.', type: 'toggle', value: false },
    { key: 'search:includeAllFields', label: 'Include all fields in search request', desc: 'Experimental: Adds the "fields": ["*"] property to search request body', type: 'toggle', value: false },
    { key: 'search:includeFrozen', label: 'Search in frozen indices', desc: 'Will include frozen indices in results if enabled. Searching through frozen indices might increase the search time.', type: 'toggle', value: false },
    { key: 'search:maxRecentDatasets', label: 'Maximum datasets in recents list', desc: '', type: 'text', value: '4' },
  ]},
  { group: 'Timeline', items: [
    { key: 'timeline:es.default_index', label: 'Default index', desc: 'Default opensearch index to search with .opensearch()', type: 'text', value: '_all' },
    { key: 'timeline:es.timefield', label: 'Time field', desc: 'Default field containing a timestamp when using .opensearch()', type: 'text', value: '@timestamp' },
    { key: 'timeline:graphite.url', label: 'Graphite URL', desc: '[experimental] The URL of your graphite host', type: 'text', value: '' },
    { key: 'timeline:max_buckets', label: 'Maximum buckets', desc: 'The maximum number of buckets a single datasource can return\n\nDefault: 200000', type: 'text', value: '200000', hasReset: true },
    { key: 'timeline:min_interval', label: 'Minimum interval', desc: 'The smallest interval that will be calculated when using "auto"', type: 'text', value: '1ms' },
    { key: 'timeline:quandl.key', label: 'Quandl key', desc: '[experimental] Your API key from www.quandl.com', type: 'text', value: 'someKeyHere' },
    { key: 'timeline:target_buckets', label: 'Target buckets', desc: 'The number of buckets to shoot for when using auto intervals', type: 'text', value: '200' },
  ]},
  { group: 'VisBuilder', items: [
    { key: 'visbuilder:enableVega', label: 'Enable vega transformation in visbuilder', desc: 'Allow visbuilder to render visualizations via vega.', type: 'toggle', value: false },
  ]},
  { group: 'Visualization', items: [
    { key: 'visualization:colorMapping', label: 'Color mapping', desc: 'Maps values to specified colors within visualizations', type: 'json', value: '{\n  "Count": "#54B399"\n}' },
    { key: 'visualization:dimmingOpacity', label: 'Dimming opacity', desc: 'The opacity of the chart items that are dimmed when highlighting another element of the chart. The lower this number, the more the highlighted element will stand out. This must be a number between 0 and 1.', type: 'text', value: '0.5' },
    { key: 'visualization:enablePluginAugmentation', label: 'Enable plugin augmentation', desc: 'Plugin functionality can be accessed from line chart visualizations', type: 'toggle', value: true },
    { key: 'visualization:enablePluginAugmentation.maxPluginObjects', label: 'Max number of associated augmentations', desc: 'Associating more than 10 plugin resources per visualization can lead to performance issues and increase the cost of running clusters.', type: 'text', value: '10' },
    { key: 'visualization:heatmap:maxBuckets', label: 'Heatmap maximum buckets', desc: 'The maximum number of buckets a single datasource can return. A higher number might have negative impact on browser rendering performance', type: 'text', value: '50' },
    { key: 'visualization:regionmap:customVectorMapMaxSize', label: 'Custom vector map size', desc: 'The maximum number of features to load from custom vector map. A higher number might have negative impact on browser rendering performance.', type: 'text', value: '1000' },
    { key: 'visualization:regionmap:showWarnings', label: 'Show region map warning', desc: 'Whether the region map shows a warning when terms cannot be joined to a shape on the map.', type: 'toggle', value: true },
    { key: 'visualization:tileMap:WMSdefaults', label: 'Default WMS properties', desc: 'Default properties for the WMS map server support in the coordinate map', type: 'json', value: '{\n  "enabled": false,\n  "url": "",\n  "options": {\n    "version": "",\n    "layers": "",\n    "format": "image/png",\n    "transparent": true,\n    "attribution": "",\n    "styles": ""\n  }\n}' },
    { key: 'visualization:tileMap:maxPrecision', label: 'Maximum tile map precision', desc: 'The maximum geoHash precision displayed on tile maps: 7 is high, 10 is very high, 12 is the max.', type: 'text', value: '7', hasLink: 'Explanation of cell dimensions' },
    { key: 'visualize:disableBucketAgg', label: 'Disable visualizations bucket aggregation types', desc: 'A comma-separated list of bucket aggregations\' names. e.g. significant_terms, terms. Deactivates the specified bucket aggregations from visualizations.', type: 'text', value: '' },
    { key: 'visualize:enableLabs', label: 'Enable experimental visualizations', desc: 'Allows users to create, view, and edit experimental visualizations. If disabled, only visualizations that are considered production-ready are available to the user.', type: 'toggle', value: true },
  ]}
];

const TypeIcon: React.FC<{ type: string }> = ({ type }) => {
  if (type === 'settings') return <FiSettings size={14} style={{ color: '#64748b' }} />;
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="3" width="4" height="4" />
      <rect x="3" y="17" width="4" height="4" />
      <rect x="17" y="17" width="4" height="4" />
      <path d="M12 7v6" />
      <path d="M5 17v-4h14v4" />
    </svg>
  );
};

const Dashboards: React.FC = () => {
  const [active, setActive] = useState<SubPage>('welcome');
  const [ipSearch, setIpSearch] = useState('');
  const [ipPage, setIpPage] = useState(1);
  const [soSearch, setSoSearch] = useState('');
  const [dsSearch, setDsSearch] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [selectedObject, setSelectedObject] = useState<any | null>(null);

  const rowsPerPage = 10;
  const filteredPatterns = indexPatterns.filter(p => p.name.includes(ipSearch));
  const totalIpPages = Math.ceil(filteredPatterns.length / rowsPerPage);
  const pagedPatterns = filteredPatterns.slice((ipPage - 1) * rowsPerPage, ipPage * rowsPerPage);

  const filteredSaved = savedObjects.filter(o => o.title.toLowerCase().includes(soSearch.toLowerCase()));

  const toggleSelect = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === filteredSaved.length) setSelected(new Set());
    else setSelected(new Set(filteredSaved.map((_, i) => i)));
  };

  /* ── layout ── */
  return (
    <div className="wz-page" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{ width: '180px', flexShrink: 0, padding: '20px 16px', background: '#ffffff', borderRight: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#1e293b' }}>Dashboards Management</span>
            <FiHelpCircle size={13} style={{ color: '#94a3b8', cursor: 'pointer' }} />
          </div>
          {([
            ['index-patterns', 'Index patterns'],
            ['data-sources',   'Data sources'],
            ['saved-objects',  'Saved objects'],
            ['advanced-settings', 'Advanced settings'],
          ] as [SubPage, string][]).map(([key, label]) => (
            <button key={key} style={sidebarLink(active === key || (key === 'data-sources' && active === 'create-data-source'))} onClick={() => setActive(key)}>
              {label}
            </button>
          ))}
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ flex: 1, padding: '32px 32px 40px', overflowY: 'auto' }}>

          {/* WELCOME */}
          {active === 'welcome' && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', background: '#ffffff', padding: '48px 64px', textAlign: 'center', maxWidth: '520px' }}>
                <FiSettings size={48} style={{ color: '#005cca', marginBottom: '20px' }} />
                <h1 style={{ fontSize: '26px', fontWeight: 300, color: '#1e293b', margin: '0 0 12px 0' }}>Welcome to Dashboards Management</h1>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 16px 0', lineHeight: 1.6 }}>
                  Manage your{' '}
                  <span style={{ color: '#005cca', cursor: 'pointer' }} onClick={() => setActive('index-patterns')}>index patterns</span>,
                  {' '}saved objects, Wazuh dashboard settings, and more.
                </p>
                <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                  A complete list of{' '}
                  <span style={{ color: '#005cca', cursor: 'pointer' }}>apps</span>
                  {' '}is in the menu on the left.
                </p>
              </div>
            </div>
          )}

          {/* INDEX PATTERNS */}
          {active === 'index-patterns' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 6px 0' }}>Index patterns</h1>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Create and manage the index patterns that help you retrieve your data from OpenSearch.</p>
                </div>
                <button onClick={() => toast.success('Creating index pattern')} style={btn(true)}><FiPlus size={13} /> Create index pattern</button>
              </div>

              {/* Search */}
              <div style={{ position: 'relative', margin: '20px 0 0' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><FiSearch size={14} /></span>
                <input value={ipSearch} onChange={e => { setIpSearch(e.target.value); setIpPage(1); }}
                  placeholder="Search..." style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {/* Table */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', marginTop: '16px', overflow: 'hidden', background: '#ffffff' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                        Pattern <FiChevronUp size={11} style={{ verticalAlign: 'middle' }} />
                      </th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#475569', fontWeight: 600 }}>Data Source Connection</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedPatterns.map((p, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ color: '#005cca', fontWeight: 500, cursor: 'pointer' }}>{p.name}</span>
                          {p.isDefault && (
                            <span style={{ marginLeft: '8px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '3px', padding: '1px 7px', fontSize: '11px', color: '#475569', fontWeight: 600 }}>Default</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#64748b' }}></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '12.5px', color: '#475569' }}>
                <span>Rows per page: <strong>10</strong> <FiChevronDown size={11} style={{ verticalAlign: 'middle' }} /></span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button onClick={() => setIpPage(p => Math.max(1, p - 1))} disabled={ipPage === 1}
                    style={{ border: 'none', background: 'none', cursor: ipPage === 1 ? 'not-allowed' : 'pointer', color: ipPage === 1 ? '#cbd5e1' : '#475569', padding: '4px 6px' }}>‹</button>
                  {Array.from({ length: totalIpPages }, (_, i) => i + 1).map(pg => (
                    <button key={pg} onClick={() => setIpPage(pg)}
                      style={{ border: pg === ipPage ? '1px solid #005cca' : '1px solid #e2e8f0', background: pg === ipPage ? '#005cca' : '#fff', color: pg === ipPage ? '#fff' : '#475569', borderRadius: '4px', padding: '3px 9px', fontSize: '12px', cursor: 'pointer', fontWeight: pg === ipPage ? 600 : 400 }}>
                      {pg}
                    </button>
                  ))}
                  <button onClick={() => setIpPage(p => Math.min(totalIpPages, p + 1))} disabled={ipPage === totalIpPages}
                    style={{ border: 'none', background: 'none', cursor: ipPage === totalIpPages ? 'not-allowed' : 'pointer', color: ipPage === totalIpPages ? '#cbd5e1' : '#475569', padding: '4px 6px' }}>›</button>
                </div>
              </div>
            </div>
          )}

          {/* DATA SOURCES */}
          {active === 'data-sources' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 6px 0' }}>Data Sources</h1>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Manage direct query data source connections.</p>
                </div>
                <button onClick={() => { setActive('create-data-source'); toast.success('Creating direct query connection'); }} style={btn(true)}>Create direct query connection</button>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '16px' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><FiSearch size={14} /></span>
                  <input value={dsSearch} onChange={e => setDsSearch(e.target.value)} placeholder="Search..."
                    style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button style={btn()}>Type <FiChevronDown size={12} /></button>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', background: '#ffffff', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#475569', fontWeight: 600 }}>Data source <FiChevronUp size={11} style={{ verticalAlign: 'middle' }} /></th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#475569', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#475569', fontWeight: 600 }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No items found</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CREATE DATA SOURCE */}
          {active === 'create-data-source' && (
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 6px 0' }}>Create Data Source</h1>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0' }}>Select a data source type to get started.</p>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                {/* Amazon S3 Card */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', width: '260px', textAlign: 'center', background: '#ffffff', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#c02428" style={{ marginBottom: '16px' }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                    <rect x="11" y="9" width="2" height="6" />
                  </svg>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Amazon S3</h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>Connect to Amazon S3 via AWS Glue Data Catalog</p>
                </div>
                
                {/* Prometheus Card */}
                <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', padding: '24px', width: '260px', textAlign: 'center', background: '#ffffff', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="#e6522c" style={{ marginBottom: '16px' }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                    <path d="M12 6C8.69 6 6 8.69 6 12s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
                    <circle cx="12" cy="12" r="2" fill="#fff" />
                  </svg>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: '0 0 8px 0' }}>Prometheus</h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>Connect to Prometheus</p>
                </div>
              </div>
            </div>
          )}

          {/* SAVED OBJECTS */}
          {active === 'saved-objects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: '0 0 6px 0' }}>Saved Objects</h1>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Manage and share your saved objects. To edit the underlying data of an object, go to its associated application.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => toast.success('All objects exported')} style={{...btn(), border: 'none', color: '#005cca'}}><FiDownload size={13} /> Export all objects</button>
                  <button onClick={() => toast.success('Import dialog opened')} style={{...btn(), border: 'none', color: '#005cca'}}><FiUpload size={13} /> Import</button>
                  <button onClick={() => toast.success('Saved objects refreshed')} style={{...btn(), border: 'none', color: '#005cca'}}><FiRefreshCw size={13} /> Refresh</button>
                </div>
              </div>

              {/* Toolbar */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '16px', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><FiSearch size={14} /></span>
                  <input value={soSearch} onChange={e => setSoSearch(e.target.value)} placeholder="Search..."
                    style={{ width: '100%', padding: '8px 12px 8px 36px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <button onClick={() => toast.success('Filter options opened')} style={btn()}>Type <FiChevronDown size={12} /></button>
                <button onClick={() => { if (selected.size > 0) toast.success('Deleted selected objects'); }} style={{ ...btn(), color: '#475569', opacity: selected.size === 0 ? 0.5 : 1 }} disabled={selected.size === 0}>
                  <FiTrash2 size={13} /> Delete
                </button>
                <button onClick={() => { if (selected.size > 0) toast.success('Exported selected objects'); }} style={{ ...btn(), opacity: selected.size === 0 ? 0.5 : 1 }} disabled={selected.size === 0}>
                  Export <FiChevronDown size={11} />
                </button>
              </div>

              {/* Table */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0, border: '1px solid #e2e8f0', borderRadius: '4px', background: '#ffffff', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', background: '#ffffff' }}>
                      <th style={{ padding: '10px 12px', width: '32px' }}>
                        <input type="checkbox" checked={selected.size === filteredSaved.length && filteredSaved.length > 0}
                          onChange={toggleAll} style={{ cursor: 'pointer' }} />
                      </th>
                      <th style={{ padding: '10px 8px', textAlign: 'left', color: '#475569', fontWeight: 600, width: '40px' }}>Type</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', color: '#475569', fontWeight: 600 }}>Title</th>
                      <th style={{ padding: '10px 12px', textAlign: 'left', color: '#475569', fontWeight: 600 }}>Last updated</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right', color: '#475569', fontWeight: 600 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSaved.map((obj, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: selected.has(i) ? '#eff6ff' : i % 2 === 0 ? '#ffffff' : '#fafafa' }}>
                        <td style={{ padding: '9px 12px' }}>
                          <input type="checkbox" checked={selected.has(i)} onChange={() => toggleSelect(i)} style={{ cursor: 'pointer' }} />
                        </td>
                        <td style={{ padding: '9px 8px', textAlign: 'center' }}><TypeIcon type={obj.type} /></td>
                        <td style={{ padding: '9px 12px' }}>
                          <span style={{ color: '#005cca', fontWeight: 500, cursor: 'pointer' }} onClick={() => setSelectedObject(obj)}>{obj.title}</span>
                        </td>
                        <td style={{ padding: '9px 12px', color: '#64748b', whiteSpace: 'nowrap' }}>{obj.updated}</td>
                        <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button onClick={() => toast.success('Link copied')} title="Link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px' }}>
                  <FiLink size={14} />
                </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {selectedObject && (
                <div style={{ width: '500px', flexShrink: 0, border: '1px solid #e2e8f0', borderRadius: '4px', background: '#ffffff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 400, color: '#1e293b', margin: 0, wordBreak: 'break-all' }}>{selectedObject.title}</h2>
                    <button onClick={() => { setSelectedObject(null); toast.success('Details closed'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ background: '#f0f9ff', borderLeft: '4px solid #0284c7', padding: '12px 16px', marginBottom: '24px', fontSize: '13px', color: '#0369a1', lineHeight: 1.5 }}>
                      Here are the saved objects related to {selectedObject.title}. Deleting this index-pattern affects its parent objects, but not its children.
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><FiSearch size={14} /></span>
                        <input placeholder="Search..." style={{ width: '100%', padding: '7px 10px 7px 32px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                      </div>
                      <button style={{ ...btn(), padding: '7px 12px', fontWeight: 400 }}>Direct relationship <FiChevronDown size={12} /></button>
                      <button style={{ ...btn(), padding: '7px 12px', fontWeight: 400 }}>Type <FiChevronDown size={12} /></button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '10px 8px', textAlign: 'left', color: '#1e293b', fontWeight: 600 }}>Type</th>
                          <th style={{ padding: '10px 8px', textAlign: 'left', color: '#1e293b', fontWeight: 600 }}>Direct relationship</th>
                          <th style={{ padding: '10px 8px', textAlign: 'left', color: '#1e293b', fontWeight: 600 }}>Title</th>
                          <th style={{ padding: '10px 8px', textAlign: 'right', color: '#1e293b', fontWeight: 600 }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>No items found</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '12.5px', color: '#475569' }}>
                <span>Rows per page: <strong>50</strong> <FiChevronDown size={11} style={{ verticalAlign: 'middle' }} /></span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button style={{ border: 'none', background: 'none', color: '#cbd5e1', padding: '4px 6px', cursor: 'not-allowed' }}>‹</button>
                  <button style={{ border: '1px solid #005cca', background: '#005cca', color: '#fff', borderRadius: '4px', padding: '3px 9px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>1</button>
                  <button style={{ border: 'none', background: 'none', color: '#cbd5e1', padding: '4px 6px', cursor: 'not-allowed' }}>›</button>
                </div>
              </div>
            </div>
          )}

          {/* ADVANCED SETTINGS */}
          {active === 'advanced-settings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 300, color: '#1e293b', margin: 0 }}>Settings</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ position: 'relative', width: '220px' }}>
                    <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><FiSearch size={14} /></span>
                    <input placeholder="Search..." style={{ width: '100%', padding: '7px 10px 7px 32px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', outline: 'none' }} />
                  </div>
                  <button onClick={() => toast.success('Category filter opened')} style={{...btn(), fontWeight: 400}}>Category <FiChevronDown size={12} /></button>
                </div>
              </div>

              <div style={{ background: '#fef9c3', padding: '16px 20px', borderRadius: '4px', marginBottom: '24px' }}>
                <div style={{ fontWeight: 600, color: '#a16207', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  Caution: You can break stuff here
                </div>
                <div style={{ fontSize: '13.5px', color: '#713f12', lineHeight: 1.5 }}>
                  Be careful in here, these settings are for very advanced users only. Tweaks you make here can break large portions of Wazuh dashboard. Some of these settings may be undocumented, unsupported or experimental. If a field has a default value, blanking the field will reset it to its default which may be unacceptable given other configuration directives. Deleting a custom setting will permanently remove it from Wazuh Dashboard's config.
                </div>
              </div>

              {advancedSettingsData.map(group => (
                <div key={group.group}>
                  <h2 style={{ fontSize: '22px', fontWeight: 300, color: '#1e293b', margin: '0 0 16px 0', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>{group.group}</h2>
                  {group.items.map(setting => (
                    <div key={setting.key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', padding: '24px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'start' }}>
                      <div style={{ paddingRight: '20px' }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>{setting.label}</div>
                        <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{setting.desc}</div>
                        {(setting as any).hasLink && <div style={{ fontSize: '13px', color: '#005cca', marginTop: '12px', cursor: 'pointer' }}>{(setting as any).hasLink}</div>}
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', marginBottom: '8px', fontFamily: 'monospace' }}>{setting.key}</div>
                        {setting.type === 'toggle' && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Toggle checked={setting.value as boolean} />
                            <span style={{ fontSize: '13px', color: '#1e293b' }}>{setting.value ? 'On' : 'Off'}</span>
                          </div>
                        )}
                        {setting.type === 'text' && (
                          <>
                            <input defaultValue={setting.value as string} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', width: '100%', boxSizing: 'border-box', outline: 'none' }} />
                            {(setting as any).hasReset && <div style={{ fontSize: '12px', color: '#005cca', marginTop: '8px', cursor: 'pointer', fontWeight: 500 }}>Reset to default</div>}
                          </>
                        )}
                        {setting.type === 'text-disabled' && (
                          <input disabled defaultValue={setting.value as string} style={{ padding: '8px 12px', border: '1px solid #e2e8f0', background: '#f8fafc', borderRadius: '4px', fontSize: '13px', width: '100%', boxSizing: 'border-box', color: '#94a3b8' }} />
                        )}
                        {setting.type === 'select' && (
                          <div style={{ position: 'relative' }}>
                            <select defaultValue={setting.value as string} style={{ padding: '8px 32px 8px 12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px', width: '100%', boxSizing: 'border-box', outline: 'none', appearance: 'none', background: '#fff' }}>
                              <option>{setting.value}</option>
                            </select>
                            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }}><FiChevronDown size={14} /></span>
                          </div>
                        )}
                        {setting.type === 'json' && (
                          <textarea defaultValue={setting.value as string} rows={7} style={{ padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace', width: '100%', boxSizing: 'border-box', outline: 'none', background: '#f8fafc', resize: 'vertical' }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Dashboards;
