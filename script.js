/* National Interiors — script.js
   No backend, no database. WhatsApp is the only "submission" mechanism. */
(function () {
  "use strict";

  var WHATSAPP_NUMBER = "917904645877"; // country code + number, no +/spaces

  function waLink(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  function openWhatsApp(message) {
    var url = waLink(message);
    var win = window.open(url, "_blank", "noopener");
    if (!win) {
      // Popup blocked (common on some mobile browsers) — fall back to direct navigation
      window.location.href = url;
    }
  }

  /* ---------------- Mobile navigation ---------------- */
  var hamburger = document.querySelector("[data-hamburger]");
  var mobilePanel = document.querySelector("[data-mobile-panel]");

  if (hamburger && mobilePanel) {
    hamburger.addEventListener("click", function () {
      var isOpen = mobilePanel.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    mobilePanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobilePanel.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Service card WhatsApp buttons ---------------- */
  document.querySelectorAll("[data-wa-service]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var service = btn.getAttribute("data-wa-service");
      var message =
        "Hi National Interiors, I'm interested in your " +
        service +
        " service. I'd like to get a quotation.";
      openWhatsApp(message);
    });
  });

  /* ---------------- Generic WhatsApp CTA buttons (hero, featured, floating, footer) ---------------- */
  document.querySelectorAll("[data-wa-generic]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var message =
        "Hi National Interiors, I'm interested in your interior / UPVC / modular kitchen services. I'd like to get a quotation.";
      openWhatsApp(message);
    });
  });

  document.querySelectorAll("[data-wa-featured]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var message =
        "Hi National Interiors, I saw your recent UPVC partition with double door project in Ayangudi. I'd like to know more and get a quotation for a similar project.";
      openWhatsApp(message);
    });
  });

  /* ---------------- Quote form ---------------- */
  var quoteForm = document.getElementById("quote-form");

  if (quoteForm) {
    var statusBox = quoteForm.querySelector("[data-form-status]");

    function setFieldError(row, hasError) {
      row.classList.toggle("has-error", hasError);
    }

    quoteForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = quoteForm.querySelector("#qf-name");
      var phone = quoteForm.querySelector("#qf-phone");
      var service = quoteForm.querySelector("#qf-service");
      var location = quoteForm.querySelector("#qf-location");
      var message = quoteForm.querySelector("#qf-message");

      var requiredFields = [name, phone, service, location];
      var firstInvalid = null;
      var allValid = true;

      requiredFields.forEach(function (field) {
        var row = field.closest(".form-row");
        var isEmpty = !field.value || !field.value.trim();
        setFieldError(row, isEmpty);
        if (isEmpty) {
          allValid = false;
          if (!firstInvalid) firstInvalid = field;
        }
      });

      // Light phone sanity check (digits, spaces, +, - only, at least 7 digits)
      var phoneRow = phone.closest(".form-row");
      var digitCount = (phone.value.match(/\d/g) || []).length;
      if (phone.value.trim() && digitCount < 7) {
        setFieldError(phoneRow, true);
        allValid = false;
        if (!firstInvalid) firstInvalid = phone;
      }

      if (!allValid) {
        if (statusBox) {
          statusBox.classList.add("is-visible");
          statusBox.textContent = "Please fill in all required fields marked with * before continuing.";
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (statusBox) {
        statusBox.classList.remove("is-visible");
      }

      var lines = [
        "Hi National Interiors,",
        "",
        "I would like to get a quotation.",
        "",
        "Name: " + name.value.trim(),
        "Phone: " + phone.value.trim(),
        "Service: " + service.value,
        "Project Location: " + location.value.trim(),
        "Requirements: " + (message.value.trim() || "-"),
        "",
        "Please get back to me regarding the quotation.",
      ];

      openWhatsApp(lines.join("\n"));
    });

    // Clear error state as the user fixes a field
    quoteForm.querySelectorAll("input, select, textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        var row = field.closest(".form-row");
        if (row) setFieldError(row, false);
      });
    });
  }

  /* ---------------- Gallery filtering ---------------- */
  var filterButtons = document.querySelectorAll("[data-filter]");
  var galleryItems = document.querySelectorAll("[data-category]");

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var filter = btn.getAttribute("data-filter");

      galleryItems.forEach(function (item) {
        var matches = filter === "all" || item.getAttribute("data-category") === filter;
        item.classList.toggle("is-hidden", !matches);
      });
    });
  });

  /* ---------------- Lightbox ---------------- */
  var lightbox = document.querySelector("[data-lightbox]");
  var lightboxImg = lightbox ? lightbox.querySelector("[data-lightbox-img]") : null;
  var lightboxCaption = lightbox ? lightbox.querySelector("[data-lightbox-caption]") : null;
  var lightboxClose = lightbox ? lightbox.querySelector("[data-lightbox-close]") : null;
  var lastFocused = null;

  function openLightbox(src, alt, caption) {
    if (!lightbox || !lightboxImg) return;
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    if (lightboxCaption) lightboxCaption.textContent = caption || "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lightboxImg) lightboxImg.src = "";
    if (lastFocused) lastFocused.focus();
  }

  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () {
      var img = item.querySelector("img");
      var caption = item.getAttribute("data-caption") || (img ? img.alt : "");
      if (img) openLightbox(img.src, img.alt, caption);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });

  /* ---------------- Footer year ---------------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
