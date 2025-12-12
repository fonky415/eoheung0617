# eoheung0617

A website for Jinny featuring interactive quizzes, personality tests, and letter collection pages.

## Project Structure

### Root Directory
- `index.html` - Main landing page and entry point for the website
- `README.md` - This file

### `/html/` - HTML Pages
Contains all the website pages organized by feature:

#### Main Pages
- `home.html` - Home page
- `imnotarobot.html` - Robot verification page

#### Letter Pages
- `letter1.html` through `letter5.html` - Five sequential letter pages

#### Quiz Pages
- `composerQuiz.html` - Classical composer identification quiz
- `textGuess.html` - Text guessing game landing page
- `textGuess-question2.html` through `textGuess-question11.html` - Individual text guess questions
- `trivia.html` - General trivia quiz
- `personality.html` - Personality test/quiz

### `/css/` - Stylesheets
Contains all CSS files for styling the website pages.

### `/javascript/` - JavaScript Files
Contains all JavaScript files for interactive functionality and quiz logic.

### `/photos/` - Images
Contains all image assets used throughout the website.

### `/.vscode/` - VS Code Configuration
IDE-specific settings (can be ignored by other editors).

## Editing Instructions

### Adding New Pages
1. Create new HTML files in the `/html/` directory
2. Follow the naming convention of existing files
3. Link stylesheets from `/css/` and scripts from `/javascript/` as needed
4. Update navigation links in relevant pages

### Modifying Existing Pages
1. **HTML files** - Located in `/html/` directory
2. **Styles** - Edit corresponding CSS files in `/css/` directory
3. **Interactivity** - Edit JavaScript files in `/javascript/` directory

### Adding Images
1. Place new images in the `/photos/` directory
2. Reference them in HTML using relative paths: `../photos/filename.ext`

### Quiz Modifications
- Text Guess questions follow a numbered sequence (question2-question11)
- When adding new Text Guess questions, follow the naming pattern
- Quiz logic is likely handled in JavaScript files - check `/javascript/` directory

## File Organization Best Practices
- Keep HTML files in `/html/`
- Keep CSS files in `/css/`
- Keep JavaScript files in `/javascript/`
- Keep images in `/photos/`
- Maintain consistent naming conventions
- Use relative paths when linking between files

## Deployment
This site uses GitHub Pages. Changes pushed to the main branch will automatically deploy.
