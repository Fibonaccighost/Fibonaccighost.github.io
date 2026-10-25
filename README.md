# Portfolio + resume

One page that works as a portfolio site and prints as a one-page resume.

## Files

- `data.js`: all your content (profile, companies, projects, skills, education). Usually the only file you edit.
- `index.html`, `styles.css`, `app.js`: layout, design and rendering.
- `figures.js`: the line drawings: the hero product, the About figures, and one abstract figure per kind of project (clipper, brain, ranking, pareto, gauge…). Pick one with `figure:` in `data.js`.
- `draw.js`: puts each drawing on its canvas and plays its draw-in reveal; also the intro's flowing line ribbons.

## Add a project

1. Open `data.js` and find the company.
2. Copy an existing `{ ... }` project block inside its `projects` list and edit it.
3. Pick a `figure` that fits what the project does (the list is at the top of `data.js`).
4. Save and refresh. It appears in Past projects at the right point in the timeline, sorted by year.

To add a new company, copy a whole block in `experience` (put the newest first).

Fields that matter for the resume:
- `resumeLine`: the one-line version printed on the resume. Lead with the result.
- `resume: false`: keeps a project on the website but leaves it off the resume.

## Download the resume

Click **Download resume** (or press Cmd+P) and choose **Save as PDF**. The file is named `Your-Name-Resume`.
**Preview resume** shows the exact layout on screen first.

## Preview locally

Open `index.html` in a browser. No install or build needed.

## Put it online (free)

- **Netlify Drop**: drag this folder onto https://app.netlify.com/drop
- **GitHub Pages**: push the folder to a repo, then Settings → Pages → deploy from the main branch.
- **Vercel**: `npx vercel` in this folder.
