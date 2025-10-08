document.addEventListener("DOMContentLoaded", function () {
  (function () {
    var file = [
      "https://c.afiliacioneseps.com/wp-content/et-cache/7/et-divi-dynamic-7-late.css"
    ];
    var handle = document.getElementById("divi-style-inline-inline-css");

    if (handle && handle.parentNode) {
      var location = handle.parentNode;

      if (
        document.querySelectorAll('link[href="' + file + '"]').length === 0
      ) {
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.id = "et-dynamic-late-css";
        link.href = file;

        location.insertBefore(link, handle.nextSibling);
      }
    }
  })();
});
