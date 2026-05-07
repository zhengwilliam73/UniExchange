# UniExchange
A student-to-student marketplace where university students can buy and sell items like textbooks, electronics, furniture, and more. Built as a full-stack web app with secure user authentication and image uploads.

## Description
UniExchange is a campus marketplace that lets students post items for sale and browse listings from other students. Users can create an account, log in, and post items with photos, descriptions, prices, conditions, and categories. Only the author of a post can edit or delete it. The app is built with Node.js, Express, EJS, and MongoDB Atlas.
Categories supported: Textbooks, Electronics, Furniture, Clothing, School Supplies, Tickets, Other

## Installation
Requirements

Node.js v18+
A MongoDB Atlas account and cluster

**Steps**

**1. Clone the repository:**
git clone https://gitlab.cci.drexel.edu/cid/2526/fw1023/b6/uniexchange.git
cd uniexchange

**2. Install dependencies:**

npm install
**3. In app.js, update the database URI and session secret with your own values:**

const dbURI = "your-mongodb-atlas-uri";
SESSION_SECRET = "your-secret-key";

**4.Start the server:**

_node app.js_
Or with auto-reload:
_npx nodemon app.js_

**5.Visit http://localhost:3001 in your browser.**

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Roadmap
Search and filter listings by category or keyword
In-app messaging between buyers and sellers
University email verification for account creation
Saved/favorited listings

## License
ISC

## Project status
The project is still being developed. We plan to incorporate React, so the website looks more polished. In addition, we want to deploy this project
in the future, once we add the core features listed in the Roadmap. 

