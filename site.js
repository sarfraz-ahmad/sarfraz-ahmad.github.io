"use strict";

(() => {
  const profile = window.PORTFOLIO;
  if (!profile) return; // The HTML remains readable if scripts are unavailable.

  const themeToggle = document.getElementById("theme-toggle");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  function isDark() { return document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : systemTheme.matches; }
  function updateThemeLabel() {
    themeToggle.setAttribute("aria-label", `Switch to ${isDark() ? "light" : "dark"} theme`);
    document.querySelector('meta[name="theme-color"]').content = isDark() ? "#171d1a" : "#f8f9f6";
  }
  themeToggle.addEventListener("click", () => {
    const theme = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("portfolio-theme", theme); } catch (_) { /* Optional preference. */ }
    updateThemeLabel();
  });
  themeToggle.hidden = false;
  systemTheme.addEventListener("change", updateThemeLabel);
  updateThemeLabel();

  const navToggle = document.getElementById("nav-toggle");
  const navigation = document.getElementById("primary-nav");
  function closeNavigation() {
    navigation.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.textContent = "Menu";
  }
  navToggle.addEventListener("click", () => {
    const open = navigation.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.textContent = open ? "Close" : "Menu";
  });
  navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", closeNavigation));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) { closeNavigation(); navToggle.focus(); }
  });
  window.matchMedia("(min-width: 721px)").addEventListener("change", closeNavigation);
  navToggle.hidden = false;
  document.querySelector(".site-header").classList.add("navigation-ready");

  document.querySelectorAll("[data-profile]").forEach(element => {
    const key = element.dataset.profile;
    if (typeof profile[key] !== "string") return;
    element.textContent = profile[key];
    if (element.tagName === "H1") {
      const period = document.createElement("span");
      period.className = "name-period";
      period.textContent = ".";
      element.append(period);
    }
    if (key === "headline") element.style.whiteSpace = "pre-line";
  });

  document.title = `${profile.name} · Academic & professional portfolio`;
  document.querySelector(".brand").setAttribute("aria-label", `${profile.name}, home`);
  const initials = profile.name.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join("").toLowerCase();
  if (initials) document.querySelector(".brand-mark").textContent = `${initials}.`;
  document.querySelector('meta[name="description"]').content = `${profile.name} — ${profile.degreeShort}, CGPA ${profile.cgpa}, and ${profile.experience} of web development experience. Academic background, selected work, CV, and academic records.`;
  document.querySelector('meta[property="og:title"]').content = document.title;

  const institution = [profile.institution, profile.studyDates].filter(Boolean).join(" · ");
  if (institution) document.getElementById("institution").textContent = institution;

  // Reject executable URL schemes and keep document paths relative to this site.
  function externalUrl(value) {
    try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:" ? url.href : null; }
    catch { return null; }
  }
  function documentUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    if (/^https?:\/\//i.test(value)) return externalUrl(value);
    if (/^(?:[a-z][a-z\d+.-]*:|[\\/])|(?:^|[\\/])\.\.(?:[\\/]|$)/i.test(value)) return null;
    try { const url = new URL(value, location.href); return url.origin === location.origin ? value : null; }
    catch { return null; }
  }
  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  const github = externalUrl(profile.github);
  document.querySelectorAll(".github-link").forEach(link => {
    if (github) link.href = github;
    else link.hidden = true;
  });
  const email = typeof profile.email === "string" ? profile.email.trim() : "";
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const link = document.getElementById("email-link");
    link.href = `mailto:${email}`;
    link.querySelector("span").textContent = email;
    link.hidden = false;
    document.getElementById("contact-note").hidden = true;
  }
  const linkedin = externalUrl(profile.linkedin);
  if (linkedin) {
    const link = document.getElementById("linkedin-link");
    link.href = linkedin;
    link.hidden = false;
  }

  const documentList = document.getElementById("document-list");
  const originalIcons = new Map([...documentList.children].map((row, index) => [["cv", "transcript", "certificate"][index], row.querySelector(".document-icon").cloneNode(true)]));
  if (Array.isArray(profile.documents) && profile.documents.length) {
    documentList.replaceChildren();
    let added = 0;
    profile.documents.forEach(record => {
      const row = makeElement("article", "document-row");
      row.append((originalIcons.get(record.icon) || originalIcons.get("cv")).cloneNode(true));
      const copy = makeElement("div", "document-copy");
      copy.append(makeElement("h3", "", record.title), makeElement("p", "", record.description));
      row.append(copy);
      const url = documentUrl(record.file);
      if (url) {
        added++;
        const link = makeElement("a", "document-action", "View document");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", `View ${record.title} (opens in a new tab)`);
        const icon = makeElement("span", "", "↗");
        icon.setAttribute("aria-hidden", "true");
        link.append(icon);
        row.append(link);
      } else row.append(makeElement("span", "document-status", "Not added yet"));
      documentList.append(row);
    });
    if (added === profile.documents.length) document.querySelector(".records-section .section-note").hidden = true;
  }

  if (Array.isArray(profile.projects) && profile.projects.length) {
    const list = document.getElementById("project-list");
    const fragment = document.createDocumentFragment();
    profile.projects.forEach((project, index) => {
      const url = externalUrl(project.url);
      const row = makeElement(url ? "a" : "article", "project-row");
      if (url) { row.href = url; row.target = "_blank"; row.rel = "noopener noreferrer"; }
      const number = makeElement("span", "project-index", String(index + 1).padStart(2, "0"));
      number.setAttribute("aria-hidden", "true");
      const copy = makeElement("div", "project-copy");
      copy.append(makeElement("h3", "", project.title), makeElement("p", "", project.description));
      row.append(number, copy, makeElement("span", "project-tag", project.tag || "PROJECT"));
      if (url) {
        const arrow = makeElement("span", "project-arrow", "↗");
        arrow.setAttribute("aria-hidden", "true");
        row.append(arrow, makeElement("span", "sr-only", " (opens in a new tab)"));
      }
      fragment.append(row);
    });
    list.replaceChildren(fragment);
    document.getElementById("work-note").hidden = true;
  }

  const navLinks = [...document.querySelectorAll("nav a")];
  function markCurrent(id) {
    navLinks.forEach(link => {
      if (link.hash === `#${id}`) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  navLinks.forEach(link => link.addEventListener("click", () => markCurrent(link.hash.slice(1))));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) markCurrent(entry.target.id); });
    }, { rootMargin: "-5% 0px -60% 0px", threshold: 0 });
    document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
  }
  const year = new Date().getFullYear();
  document.getElementById("year").textContent = String(year);
})();
