/* Kawis — catalogue page: category filter, reads data/products.json */
(function () {
  "use strict";
  function start() {
    var K = window.kawisCatalogue;
    var box = document.querySelector("[data-catalogue]");
    var bar = document.querySelector("[data-filters]");
    if (!K || !box || !bar) return;

    K.getData().then(function (data) {
      data.categories.forEach(function (c) {
        var b = document.createElement("button");
        b.type = "button"; b.className = "filter";
        b.setAttribute("data-filter", c.id); b.setAttribute("aria-pressed", "false");
        b.textContent = c.name;
        bar.appendChild(b);
      });
      var params = new URLSearchParams(location.search);
      var current = params.get("cat") || "all";
      if (!data.categories.some(function (c) { return c.id === current; })) current = "all";

      function apply(id, push) {
        current = id;
        var btns = bar.querySelectorAll(".filter");
        for (var i = 0; i < btns.length; i++) btns[i].setAttribute("aria-pressed", String(btns[i].getAttribute("data-filter") === id));
        K.renderInto(box, data, id, 0);
        // Page-level WhatsApp buttons ask about the selected category
        var name = null;
        data.categories.forEach(function (c) { if (c.id === id) name = c.name; });
        var pageWa = document.querySelectorAll(".page-hero a[data-wa], .sticky-bar a[data-wa][data-wa-context]");
        for (var j = 0; j < pageWa.length; j++) {
          if (name) pageWa[j].setAttribute("data-wa-category", name); else pageWa[j].removeAttribute("data-wa-category");
        }
        K.wireLinks(document.querySelector(".page-hero"));
        K.wireLinks(document.querySelector(".sticky-bar"));
        if (push) {
          var u = new URL(location.href);
          if (id === "all") u.searchParams.delete("cat"); else u.searchParams.set("cat", id);
          history.replaceState(null, "", u.pathname + u.search);
        }
      }
      bar.addEventListener("click", function (e) {
        var b = e.target.closest(".filter");
        if (b) apply(b.getAttribute("data-filter"), true);
      });
      apply(current, false);
    }).catch(function () {
      box.innerHTML = '<p class="empty">The catalogue could not be loaded. Please see our Telegram channel.</p>';
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
