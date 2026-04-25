# Express-React Assignment
## DEADLINE: 21st April EOD

---

## Option 1: The Movie Puzzler
**The Concept:** A mini-game where users are presented with extremely literal (and often cynical) descriptions of movies and must guess the correct title.
> *Example:* "A billionaire beats up the mentally ill while wearing a rubber suit" → **The Dark Knight**

### Required Features
* **Puzzle Fetching:** * API to fetch a random puzzle.
    * Ability to filter and fetch puzzles based on difficulty levels (e.g., Easy, Medium, Hard).
* **User System:** * Full user authentication (Signup/Login).
    * Persistence: Track which puzzles a user has already solved to show their progress.
* **Frontend Logic:** * A **Hint Button** that remains disabled/hidden until a user has made a certain number of failed attempts.

### Brownie Points
* **Leaderboard/Analytics:** A page displaying user rankings based on the total number of puzzles solved.

---

## Option 2: The "Wall of Shame"
**The Concept:** A single-page, anonymous "shame wall" where developers can post snippets of code they are embarrassed by or that went horribly wrong.

### Required Features
* **Global Wall:** A shared space where all users see the same snippets in real-time or upon page refresh.
* **Community Interaction:** Users can click on a specific snippet to view/leave remarks or comments.
* **Anonymity & Ownership:** * No formal account system is required (keep it anonymous).
    * **Logic:** Only the person who posted a specific comment should be able to delete it.
* **Frontend UI:** * A "single large screen" layout where code snippets appear as distinct, interactable components (like cards or sticky notes).

### Brownie Points
* **Profile History:** A local profile screen where a user can view a history of all snippets and comments they have posted from their browser.

---

## Tech Stack Requirements
* **Frontend:** React.js
* **Backend:** Express.js
* **Database:** Your choice (MongoDB, PostgreSQL, or even a local JSON file for persistence).

## Submission Guidelines
1.  Initialize a Git repository.
2.  Ensure your code is well-commented and the folder structure is clean (e.g., `/client` and `/server`).
3.  Include a brief `README` on how to install dependencies and run the project locally.
4. Make a pull request to this repository.
