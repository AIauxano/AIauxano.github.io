# GRC Portfolio

A one-page GitHub Pages site that shows your progress through the 14-week Hands-On GRC Training Program and links to the work you produced.

Everything you change lives in one file: `data/portfolio.js`. The page reads it and builds the progress bars, timeline, featured work and skills list.

## Publish it (about 10 minutes)

1. Sign in to GitHub and create a new public repository.
   - Name it `yourusername.github.io` to get the address `https://yourusername.github.io`.
   - Or use any name, such as `grc-portfolio`, to get `https://yourusername.github.io/grc-portfolio`.
2. On the new repository's page, choose **Add file > Upload files**. Drag in everything from this folder (`index.html`, `README.md`, `.nojekyll`, and the `assets`, `data` and `portfolio` folders). Commit.
3. Go to **Settings > Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main** and folder to **/ (root)**. Save.
4. Wait a minute or two, then open the address GitHub shows at the top of the Pages settings.

If you use Git on your computer instead:

```bash
git init
git add .
git commit -m "GRC portfolio"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/REPO.git
git push -u origin main
```

Then do step 3.

## Projects

- `projects/*.html`: twelve GRC project write-ups, one per program module. Each page shows "In progress" until every lab it covers is marked `complete` in `data/portfolio.js`, then switches to "Complete" by itself.
- `projects/files/`: the runnable code and data behind them (`fair_simulation.py`, `check_evidence.py`, the CSV exports) and the lab workbook.
- `data/projects.js`: the project list. Under `otherProjects`, set `"link"` to a repository URL once you make that repository public; until then the card says "Private repository".

When you finish a project's labs, replace or extend its write-up with your own findings and link your own deliverable files in the Artifacts list.

## Update your progress

Open `data/portfolio.js` (on GitHub, click the file, then the pencil icon to edit in the browser).

Profile: replace `Your Name`, and fill `email`, `linkedin`, `github` and `resume` (a link, such as `portfolio/resume.pdf`). Empty fields are hidden.

Each lab looks like this:

```js
{
  "id": "4.3",
  "title": "Test the offboarding control",
  "status": "complete",          // "complete", "in-progress" or "not-started"
  "completed": "2027-01-09",     // date you finished
  "link": "portfolio/LKP-AC-04_Offboarding_Workpaper_v1.0.pdf",
  "summary": "Tested all 10 October terminations: 3 exceptions, including an IT admin still active a week later; population excluded contractors. Concluded not effective; root cause was a manual HR-to-IT handoff."
}
```

- `status` drives every progress bar and badge.
- `link` turns the deliverable name into a link. Put your files in the `portfolio` folder, or link to a Google Drive or OneDrive file shared as view-only.
- `summary` appears on the featured cards. Write two or three sentences: what you tested or built, what you found, what you recommended.

Skills use `"learning"`, `"practicing"` or `"confident"`. Certifications use `"planned"`, `"studying"` or `"earned"`, with an optional `target` such as `"Exam booked March 2027"`.

`featured` lists the five lab IDs shown as cards. Swap in your strongest work.

## Before you publish a work product

- Export to PDF so anyone can open it without Office.
- Keep the note that Larkspur Pay is a fictional training company. Never present lab work as work for a real employer.
- Only mark a lab complete when you have finished it. Interviewers will open the files and ask about them.

## Preview on your computer

Open `index.html` in a browser. The site has no build step and no dependencies beyond a web font.
