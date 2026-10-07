# Sarfraz Ahmad's portfolio

A minimal, responsive academic and professional website for GitHub Pages.
Built with HTML, CSS, and JavaScript, with local assets and system fonts.
No dependencies, account setup, or build step are required.
Includes light/dark themes, mobile navigation, active-section highlighting,
keyboard focus styles, a skip link, reduced-motion support, and print styling.

## Content

Edit `profile.js` to update your name, biography, degree, institution, dates,
public email, profile links, projects, and documents.

The supplied facts are BS Computer Science, CGPA 3.37, and seven years of web
development experience. A CGPA scale, university, study dates, employers,
publications, and project details have not been invented.

Place real documents in `documents/` and add their paths in `profile.js`.
Until then, the site displays “Not added yet” instead of a broken file link.
See `documents/README.md` for examples.

## Preview

Open `index.html` directly in a browser. All asset paths are relative, so the
site works without a local server and also in a GitHub Pages subdirectory.

For a local HTTP preview with Node.js:

```powershell
node preview-server.cjs
```

Open `http://127.0.0.1:4173`. The server binds only to the local computer,
serves only the public website files, and is not part of the deployed site.

## Publish at sarfraz-ahmad.github.io

1. Open your `sarfraz-ahmad/sarfraz-ahmad.github.io` repository on GitHub.
2. Replace the demo with `index.html`, `styles.css`, `profile.js`, and `site.js`.
3. Include `assets/`, `documents/`, and `.nojekyll`.
4. In Settings → Pages, select “Deploy from a branch”, your publishing branch
   (usually `main`), and `/ (root)`, then click Save.
5. Commit the files and allow GitHub Pages to finish publishing.

Your live website has not been changed by creating these local files.

Official publishing instructions:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
