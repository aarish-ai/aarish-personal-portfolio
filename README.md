# Aarish's Night Study Portfolio (V5)

Welcome to the Night Study portfolio! This site is built with **Next.js 14 (App Router)**, **React Three Fiber** (for WebGL 3D graphics), **Tailwind CSS**, and **Framer Motion**.

This document serves as your definitive guide to personalizing and updating your portfolio. 

---

## 📂 Where to Edit Your Content

Here is exactly where all of your personal data lives and how to change it.

### 1. The Home Page (Name & One-Liner)
**File:** `src/app/page.tsx`
- Open this file to change the massive "AARISH" title. 
- You can also edit the sub-headline ("Crafting immersive digital experiences through engineering and alchemy").

### 2. The About Page (Bio & Skills)
**File:** `src/app/about/page.tsx`
- **Bio (Chapter I):** Scroll down to line `~66` to find the text for your biography. You can edit the paragraphs directly here. The massive golden "I" drop-cap is hardcoded as the first letter.
- **Skills (Chapter II):** Scroll down to line `~88`. You will find arrays of strings like `['TypeScript', 'Python', 'Go']`. Simply add, remove, or modify the text in these arrays, and the UI will automatically generate the glassmorphism pill badges for them!

### 3. The Work Page (Projects & Constellation)
**File:** `data/projects.json`
- This is the easiest file to edit. It is a simple JSON array.
- To add a new project, simply copy an existing project object and paste it into the array.
- **Fields:**
  - `id`: Keep this unique (e.g., "1", "2").
  - `name`: The title of the project.
  - `oneLiner`: The short description under the title.
  - `tech`: An array of technologies used (e.g., `["React", "Three.js"]`).
  - `problem`, `approach`, `outcome`: The detailed paragraphs for the project card.
  - `url`: The link to the live project (or GitHub repo).

### 4. The Contact Links (Footer)
**File:** `src/components/FooterBar.tsx`
- Scroll down to the `<a>` tags.
- Here you can update your email address (`aarish.ai@example.com`) in both the `href="mailto:..."` and the visible text.
- You can update your GitHub and LinkedIn URLs in their respective `href` attributes.

### 5. Your Resume (CV)
**File:** `public/CV.pdf`
- Your resume is served statically from the `public` folder.
- To update your resume, simply drag and drop your new PDF into the `public/` folder, replacing the existing `CV.pdf`. Make sure the filename remains exactly `CV.pdf` so the download link continues to work.

### 6. Website Metadata (SEO)
**File:** `src/app/layout.tsx`
- At the top of this file, you will find the `metadata` object.
- Change the `title` and `description` to update what shows up in browser tabs and when you share your website link on social media.

---

## 🚀 How to Run Locally

If you ever want to preview your changes on your own computer before pushing to GitHub:

1. Open your terminal in the project directory.
2. Run `npm install` (only needed the first time).
3. Run `npm run dev`.
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

When you're happy with your edits, simply commit and push your changes to the `main` branch, and Vercel will automatically deploy them to `aarishportfolio.vercel.app`!
