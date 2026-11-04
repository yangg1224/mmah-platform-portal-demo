/* Plain-language slide decks for each engineer page (mock data only; roles, never names). Uses js/slides.js. */
(function () {
  var esc = SLIDES.esc;
  function slide(title, lead, points) {
    return function () {
      return "<h1>" + esc(title) + '</h1><p class="wt-lead">' + esc(lead) + "</p>" +
        (points ? '<div class="wt-grid">' + points.map(function (p) { return '<div class="wt-card"><h2>' + esc(p[0]) + "</h2><p>" + esc(p[1]) + "</p></div>"; }).join("") + "</div>" : "");
    };
  }
  function detail(href, label) {
    return { nav: "Full detail", html: function () {
      return "<h1>Want the full detail?</h1><p class=\"wt-lead\">Engineers keep the complete view, with every setting and link.</p>" +
        '<p><a class="wt-btn wt-primary" href="' + href + '">Open the engineer view: ' + esc(label) + " →</a></p>" +
        '<p class="wt-note">All statuses and numbers are mock sample data.</p>';
    } };
  }
  var DECKS = [
    { id: "map", nav: "Platform map", steps: [
      { nav: "What it is", html: slide("The platform map", "One picture of how data moves, from the people who send it to the reports that use it.", [
        ["1. Arrives", "Files from municipalities and partners land as they are (bronze)."],
        ["2. Cleaned", "Checked and made consistent (silver)."],
        ["3. Trusted", "Ready for reports, with agreed definitions (gold)."],
        ["4. Published", "Listed in the catalogue so people can find it."]]) },
      { nav: "What to look at", html: slide("What the colours tell you", "Each step shows a simple status (sample data).", [
        ["✓ Passing", "This step is healthy."], ["⚠ Warnings", "Some records need a fix; for example 12 open issues in cleaning (mock)."], ["○ Not yet linked", "Planned, not built yet."]]) },
      detail("map.html", "platform map") ] },
    { id: "blueprint", nav: "Blueprint", steps: [
      { nav: "What it is", html: slide("The platform blueprint", "Every piece of the proposed platform, as of 4 Nov 2026, and the problem each piece fixes.", [
        ["Sources & intake", "A web intake portal replaces email, Excel and SFTP."], ["Store & process", "A lakehouse with bronze, silver and gold layers."],
        ["Governance", "Glossary & catalogue, sharing rules, quality checks."], ["Platform", "Fabric or Databricks: not confirmed yet."]]) },
      { nav: "How to read it", html: slide("How to read it", "Click any box to see what it is, why we need it, who owns it and which pain point (P1–P7) it fixes.") },
      detail("pages/blueprint.html", "full blueprint") ] },
    { id: "products", nav: "Data products", steps: [
      { nav: "What they are", html: slide("Data products", "A data product is a dataset someone owns and keeps reliable, so others reuse it instead of re-asking.", [
        ["Municipal Planning Data", "Quarterly housing-supply submissions from municipalities, checked and published. Sample: 12 warnings open."],
        ["Housing & Homelessness", "Monthly aggregated measures only; no person-level data. Sample: passing."]]) },
      { nav: "Trust card", html: slide("Each product has a trust card", "A one-glance label, like a nutrition label for data.", [
        ["Owner and steward", "Who builds it and who vouches for its meaning (by role)."], ["Refresh", "How often it updates."], ["Quality", "Whether the checks passed."], ["Sensitivity", "Medium or lower only."]]) },
      detail("pages/data-products.html", "data products") ] },
    { id: "flows", nav: "Flows / lineage", steps: [
      { nav: "What it is", html: slide("Where did this number come from?", "Lineage lets anyone trace a published number back to its source and see what changed it.", [
        ["Extract", "Take the data from the source."], ["Load", "Store it untouched first (bronze)."], ["Transform", "Clean and combine it (silver, gold)."]]) },
      { nav: "Why it matters", html: slide("Why it matters", "When a source like TPON changes data without notice, lineage shows which reports are affected.") },
      detail("pages/flows.html", "flows / lineage") ] },
    { id: "setup", nav: "Platform setup", steps: [
      { nav: "What it is", html: slide("Platform setup", "How each environment is configured. An environment is a separate copy of the platform for a purpose.", [
        ["Dev", "Where engineers build."], ["Test", "Where changes are tested."], ["Pre-Prod", "A final rehearsal."], ["Prod", "What real users rely on."]]) },
      { nav: "Read-only", html: slide("Changes go through code", "The setup is written as code (infrastructure as code), reviewed and versioned, not clicked together by hand. This page only shows it.") },
      detail("pages/platform-setup.html", "platform setup") ] },
    { id: "rules", nav: "Rules", steps: [
      { nav: "What they are", html: slide("Rules and checks", "The business rules and quality checks the data must pass, in plain words first.", [
        ["Quality rule", "For example: every municipal submission must match the expected template and code lists."],
        ["Matching rule", "How free-text municipality names are matched to the official list."],
        ["Data contract", "An agreement on what a source will send, so surprises are caught."]]) },
      { nav: "Who approves", html: slide("Every rule has an owner", "Each rule shows its version and who approved it (a data steward, by role), so it never lives only in one person's head.") },
      detail("pages/rules.html", "rules / config") ] },
    { id: "services", nav: "Shared services", steps: [
      { nav: "What they are", html: slide("Shared services", "Reusable building blocks so teams stop rebuilding the same thing.", [
        ["Cleaning", "Standard checks and clean-up for every incoming file."], ["Name matching", "Matches municipality names to the official list."],
        ["Personal-field drop", "Removes personal fields before publishing."], ["Small-number suppression", "Hides very small counts to protect privacy."]]) },
      detail("pages/shared-services.html", "shared services") ] },
    { id: "releases", nav: "Releases", steps: [
      { nav: "What it is", html: slide("Releases and gates", "A release moves from Dev to Test to Pre-Prod to Prod. A gate is a checklist it must pass at each step.", [
        ["Sample: Release 0.4", "Municipal Planning Data, waiting at Pre-Prod for a change-board reference."], ["Sample: Release 0.3", "Housing & Homelessness, live since 29 Sep 2026."]]) },
      detail("pages/releases.html", "releases & gates") ] },
    { id: "iac", nav: "IaC guide", steps: [
      { nav: "What it is", html: slide("Infrastructure-as-code guide", "How the platform is built from code: build the foundation, agree the rules, move data from source to insight.", [
        ["Foundation", "Accounts, access and networking set up once, the same way everywhere."], ["Rules", "Who can do what, written down and reviewed."], ["Data flow", "The services that carry data from source to report."]]) },
      detail("pages/iac-guide.html", "IaC guide") ] }
  ];
  function byId(id) { return DECKS.filter(function (d) { return d.id === id; })[0]; }
  function idx(id) { return DECKS.indexOf(byId(id)); }
  SLIDES.run({
    decks: DECKS,
    deck: function () { var d = SLIDES.param("deck"); return byId(d) ? d : DECKS[0].id; },
    steps: function (d) { return byId(d).steps; },
    nextDeck: function (d) { var n = DECKS[idx(d) + 1]; return n && n.id; },
    prevDeck: function (d) { var n = DECKS[idx(d) - 1]; return n && n.id; }
  });
})();
