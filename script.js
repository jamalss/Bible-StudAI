// Bible Stud-AI — homepage interactions
// 1) Scroll-reveal for study entries and about columns
// 2) Alphabet strip jump-to-letter
// 3) Live search filter across the study index

document.addEventListener("DOMContentLoaded", function () {
  var prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------- Scroll reveal ---------------- */
  var revealTargets = document.querySelectorAll(".study-entry, .reveal");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) {
      el.classList.add("in-view");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------------- Alphabet strip ---------------- */
  var alphaLetters = document.querySelectorAll(".alpha-strip .letter.is-active");
  alphaLetters.forEach(function (letterEl) {
    letterEl.addEventListener("click", function () {
      var target = document.getElementById("letter-" + letterEl.dataset.letter);
      if (target) {
        target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
      }
    });
    letterEl.setAttribute("tabindex", "0");
    letterEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        letterEl.click();
      }
    });
  });

  /* ---------------- Live search filter ---------------- */
  var searchInput = document.getElementById("studySearch");
  var entries = document.querySelectorAll(".study-entry");
  var groups = document.querySelectorAll(".letter-group");
  var noResults = document.getElementById("noResults");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      var query = searchInput.value.trim().toLowerCase();
      var anyVisible = false;

      groups.forEach(function (group) {
        var groupHasVisible = false;
        var groupEntries = group.querySelectorAll(".study-entry");

        groupEntries.forEach(function (entry) {
          var haystack = (
            entry.dataset.title +
            " " +
            entry.dataset.thesis +
            " " +
            entry.dataset.tags
          ).toLowerCase();

          var match = query === "" || haystack.indexOf(query) !== -1;
          entry.style.display = match ? "flex" : "none";
          if (match) {
            groupHasVisible = true;
            anyVisible = true;
          }
        });

        group.style.display = groupHasVisible ? "" : "none";
      });

      if (noResults) {
        noResults.classList.toggle("is-visible", !anyVisible);
      }
    });
  }
});
