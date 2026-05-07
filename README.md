# UniExchange

A student-to-student marketplace where university students can buy and sell items (textbooks, electronics, furniture, and more).

> **Status:** In active development

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Run the App](#run-the-app)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [License](#license)

## About

**UniExchange** is a campus marketplace that lets students post items for sale and browse listings from other students. Users can create an account, log in securely, and create listings with photos, descriptions, prices, and categories.

Supported categories:

- Textbooks
- Electronics
- Furniture
- Clothing
- School Supplies
- Tickets
- Other

## Features

- Secure user authentication
- Create and browse listings
- Item photos, descriptions, and pricing
- Category-based organization

## Tech Stack

- **Backend:** Node.js (Express)
- **Database:** MongoDB (Atlas)
- **Views:** EJS
- **Frontend:** HTML/CSS/JavaScript

> Repo language composition: EJS (51.1%), JavaScript (27.2%), HTML (17.8%), CSS (3.9%).

## Getting Started

### Prerequisites

- Node.js **v18+**
- A MongoDB Atlas account + cluster

### Installation

1. **Clone the repository**

   ```bash
   git clone https://gitlab.cci.drexel.edu/cid/2526/fw1023/b6/uniexchange.git
   cd uniexchange
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

### Configuration

In `app.js`, update the database URI and session secret with your own values:

```js
const dbURI = "your-mongodb-atlas-uri";
SESSION_SECRET = "your-secret-key";
```

> Tip: Consider moving secrets into environment variables (e.g., using a `.env` file) to avoid committing credentials.

### Run the App

Start the server:

```bash
node app.js
```

Or with auto-reload:

```bash
npx nodemon app.js
```

Then visit:

- http://localhost:3001

## Usage

1. Create an account and log in.
2. Browse existing listings by category.
3. Post a new item with an image, description, price, and category.

## Roadmap

- Search and filter listings by category or keyword
- In-app messaging between buyers and sellers
- University email verification for account creation
- Saved/favorited listings

## Future plans
Currently, our frontend is only CSS, so we plan to add React in the future to make our website look more polished. In addition, we have plans of deploying this.

## License

ISC
