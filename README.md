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

bash   git clone https://gitlab.cci.drexel.edu/cid/2526/fw1023/b6/uniexchange.git
cd uniexchange

**2. Install dependencies:**

bash npm install
**3. In app.js, update the database URI and session secret with your own values:**

const dbURI = "your-mongodb-atlas-uri";
SESSION_SECRET = "your-secret-key";

**4.Start the server:**

bash   node app.js
Or with auto-reload:
bash npx nodemon app.js

**5.Visit http://localhost:3001 in your browser.**

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
=======
Marketplace for students
>>>>>>> a92bd966f3b7c7edbdc4889b1a9239342e845890
