/* ADM walkthrough: plain-language landing flow. Mock content only; quotes attributed by role, never by name. */
(function () {
  var PAINS = [
    { id: "P1", t: "Data arrives by email and Excel",
      d: "There is no portal. Staff chase 50 municipalities by hand every quarter, the tracker is a manual Excel file, and people change the templates.",
      q: [["you have to manually contact 50 municipalities on a quarterly basis", "DPU lead"],
          ["sometimes they can send their own template", "DPU analyst"],
          ["improve the data ingestions, like by not using email or Excel files… lock down the template", "BIRU team lead"]] },
    { id: "P2", t: "Source systems change data without notice",
      d: "Nothing checks incoming data automatically. A whole fiscal year was wiped, a double-count bug came back, and production pointed at a test server.",
      q: [["Tpon kept changing their data and not telling us… It never matched", "BIRU manager"]] },
    { id: "P3", t: "Knowledge sits with individuals; work is duplicated",
      d: "Key know-how lives in personal files, and teams rebuild the same things.",
      q: [["information in an Excel sheet on one person's desktop", "BIRU manager"],
          ["there's a lot of duplication across the ministry", "MIH project team"]] },
    { id: "P4", t: "Sources disagree, and there is no glossary",
      d: "The same question gets different answers depending on where you look.",
      q: [["multiple different sources of information that give slightly different answers", "Policy advisor, housing"]] },
    { id: "P5", t: "Silos and uneven data maturity",
      d: "Units are at different stages. Requests are ad hoc and get asked again and again.",
      q: [["you need to meet them at their level of maturity", "Policy advisor"]] },
    { id: "P6", t: "Paid data is locked in one unit",
      d: "MPAC property data costs about $250K+ a year, but it sits in one unit's SharePoint where others can't use it." },
    { id: "P7", t: "The platform is still uncertain",
      d: "Fabric or Databricks is not decided, nor is how we meet ODP compliance. The team has only workspace-admin rights, and costs aren't visible." }
  ];
  var GAPS = [
    ["A single intake portal with locked templates, dropdowns and automatic reminders", "P1"],
    ["Automatic quality checks and source-system monitoring", "P2"],
    ["A trusted store with year-over-year history", "P2"],
    ["One shared home for data", "P3"],
    ["A business glossary and catalogue", "P4"],
    ["A governance and access framework for sharing data across units", "P6"],
    ["Data literacy and change support at each unit's maturity level", "P5"],
    ["A request process that turns repeated asks into reusable products", "P5"],
    ["A confirmed platform with proper rights and visible costs", "P7"]
  ];
  var TERMS = [
    ["Lakehouse", "One place that stores raw files and clean tables together, so we don't keep separate copies."],
    ["Bronze", "Data exactly as it arrived, kept as a record."],
    ["Silver", "Data that has been checked, cleaned and made consistent."],
    ["Gold", "Data ready for reports and decisions, with agreed definitions."],
    ["Quality check", "An automatic rule that stops bad or changed data before it reaches a report."],
    ["Glossary / catalogue", "A shared list of what each term means and where each dataset lives."],
    ["Data product", "A dataset someone owns and keeps reliable, so others can reuse it instead of re-asking."],
    ["Fabric / Databricks", "Two candidate platforms (software) for running all of this. Not yet decided."]
  ];
  var esc = SLIDES.esc;
  function tag(id) { return '<span class="wt-tag" title="' + esc(painName(id)) + '">' + id + "</span>"; }
  function painName(id) { return PAINS.filter(function (p) { return p.id === id; })[0].t; }
  function box(title, text, tags) { return '<div class="wt-box"><h3>' + esc(title) + "</h3><p>" + esc(text) + "</p>" + tags.map(tag).join("") + "</div>"; }
  var ARROW = '<div class="wt-arrow" aria-hidden="true">→</div>';

  var STEPS = [
    { nav: "Start", html: function () {
      return "<h1>A better way to collect, trust and share MMAH data</h1>" +
        '<p class="wt-lead">A 5-minute walkthrough: what staff told us, what is missing, the proposed design, and what we need from you.</p>' +
        '<div class="wt-grid"><div class="wt-card"><h2>1 · What people told us</h2><p>Seven problems, in staff\'s own words.</p></div>' +
        '<div class="wt-card"><h2>2 · What MMAH is missing</h2><p>Nine gaps, each tied to a problem.</p></div>' +
        '<div class="wt-card"><h2>3 · The proposed design</h2><p>A simple picture, and what each part fixes.</p></div>' +
        '<div class="wt-card"><h2>4 · What we need from you</h2><p>Three decisions.</p></div></div>';
    } },
    { nav: "1 · What people told us", html: function () {
      return "<h1>What people told us</h1><p class=\"wt-lead\">Seven themes from interviews. Quotes are attributed by role only.</p><div class=\"wt-grid\">" +
        PAINS.map(function (p) {
          return '<div class="wt-card"><h2>' + tag(p.id) + esc(p.t) + "</h2><p>" + esc(p.d) + "</p>" +
            (p.q || []).map(function (q) { return '<p class="wt-quote">“' + esc(q[0]) + '” <span class="wt-role">— ' + esc(q[1]) + "</span></p>"; }).join("") + "</div>";
        }).join("") + "</div>";
    } },
    { nav: "2 · What's missing", html: function () {
      return "<h1>What MMAH is missing</h1><p class=\"wt-lead\">Each gap is linked to the problem it would fix.</p><ul class=\"wt-gaps\">" +
        GAPS.map(function (g) { return '<li><span class="wt-gap">' + esc(g[0]) + '</span><span class="wt-fix">' + tag(g[1]) + esc(painName(g[1])) + "</span></li>"; }).join("") + "</ul>";
    } },
    { nav: "3 · The proposed design", html: function () {
      return "<h1>The proposed design, in plain words</h1><p class=\"wt-lead\">Data flows left to right. The tags show which problem each part fixes.</p>" +
        '<div class="wt-flow">' +
        box("1. Who sends data", "Municipalities, service managers, source systems like TPON, and MPAC.", ["P1", "P6"]) + ARROW +
        box("2. Web intake portal", "Locked templates, dropdowns, automatic reminders and a live tracker. Replaces email, Excel and SFTP.", ["P1"]) + ARROW +
        box("3. Automatic checks", "Quality rules plus monitoring that flags when a source changes its data.", ["P2"]) + ARROW +
        box("4. One trusted store", "A lakehouse with bronze → silver → gold layers and year-over-year history.", ["P2", "P3"]) + ARROW +
        box("5. Shared reports & products", "Reusable data products and reports that every unit can find and use.", ["P5", "P6"]) +
        "</div>" +
        '<div class="wt-base"><div><strong>Glossary & catalogue</strong> — one meaning per term. ' + tag("P4") + "</div>" +
        "<div><strong>Sharing & access rules</strong> — so MPAC and other data can be shared across units. " + tag("P6") + "</div>" +
        "<div><strong>Support for each unit</strong> — training and change help at each unit's level. " + tag("P5") + "</div>" +
        "<div><strong>Platform: Fabric or Databricks</strong> — <em>not confirmed</em>; needs proper rights and visible costs. " + tag("P7") + "</div></div>" +
        '<p class="wt-note">Engineers: the detailed version, with every piece tagged by pain point, is the <a href="pages/blueprint.html">full blueprint</a> (as of 4 Nov 2026).</p>';
    } },
    { nav: "Words we use", html: function () {
      return "<h1>Words we use</h1><p class=\"wt-lead\">One line each.</p><dl class=\"wt-defs\">" +
        TERMS.map(function (t) { return "<dt>" + esc(t[0]) + "</dt><dd>" + esc(t[1]) + "</dd>"; }).join("") + "</dl>";
    } },
    { nav: "4 · What we need from you", html: function () {
      return "<h1>What we need from you</h1><p class=\"wt-lead\">Three decisions unblock the work.</p><ol class=\"wt-asks\">" +
        "<li><strong>1. Platform decision</strong><p>Choose Microsoft Fabric or Databricks, including how we meet ODP compliance.</p></li>" +
        "<li><strong>2. Access and admin rights</strong><p>Rights beyond workspace admin, so the team can set up the platform properly.</p></li>" +
        "<li><strong>3. Budget owner</strong><p>Name who owns the platform budget, so costs are visible and managed.</p></li></ol>" +
        '<p class="wt-note"><a class="wt-btn wt-primary" href="slides.html#deck=map&step=0">Continue: the rest of the site as slides →</a></p><p class="wt-note">Engineer pages: <a href="map.html">platform map</a> · <a href="pages/blueprint.html">full blueprint</a> · <a href="pages/data-products.html">data products</a>.</p>';
    } }
  ];

  SLIDES.run({ steps: function () { return STEPS; } });
})();
