document.addEventListener("DOMContentLoaded", function () {
  // --- Ahrefs Analytics Injection ---
  (function() {
    var ahrefsScript = document.createElement("script");
    ahrefsScript.src = "https://analytics.ahrefs.com/analytics.js";
    ahrefsScript.setAttribute("data-key", "bMrtnWH63YDM36/GpGorrA");
    ahrefsScript.async = true;
    document.head.appendChild(ahrefsScript);
    console.log("✅ Ahrefs script loaded");
  })();

  // --- Giscus Comments Injection ---
  var pathname = window.location.pathname;

  if (pathname.startsWith("/blog/")) {
    var container = document.createElement("div");
    container.id = "giscus-comments";
    container.style.maxWidth = "720px";
    container.style.margin = "3rem auto 0 auto";

    var mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.appendChild(container);

      var script = document.createElement("script");
      script.src = "https://giscus.app/client.js";
      script.setAttribute("data-repo", "sandipan1/sandipan1.github.io");
      script.setAttribute("data-repo-id", "R_kgDOOCqlng");
      script.setAttribute("data-category", "Blog comments");
      script.setAttribute("data-category-id", "DIC_kwDOOCqlns4CotKq");
      script.setAttribute("data-mapping", "pathname");
      script.setAttribute("data-strict", "0");
      script.setAttribute("data-reactions-enabled", "1");
      script.setAttribute("data-emit-metadata", "0");
      script.setAttribute("data-input-position", "bottom");
      script.setAttribute("data-theme", "preferred_color_scheme");
      script.setAttribute("data-lang", "en");
      script.setAttribute("crossorigin", "anonymous");
      script.async = true;

      container.appendChild(script);
      console.log("✅ Giscus script loaded");
    }
  }
});