const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Post = require("./models/post");
const upload = require("./gridfs");
const { GridFSBucket } = require("mongodb");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const User = require("./models/user");
const bcrypt = require("bcrypt");

// express app
const app = express();
const ITEM_CATEGORIES = [
  "Textbooks",
  "Electronics",
  "Furniture",
  "Clothing",
  "School Supplies",
  "Tickets",
  "Other",
];
const normalizeCategories = (rawCategories) => {
  if (!rawCategories) return [];

  const categoryList = Array.isArray(rawCategories)
    ? rawCategories
    : [rawCategories];

  return [...new Set(
    categoryList
      .map((category) => String(category).trim())
      .filter((category) => ITEM_CATEGORIES.includes(category)),
  )];
};

// connect to mongodb & listen for requests
const dbURI =
  "mongodb+srv://zhengwilliam73_db_user:1yok67HMYsyQCA9x@uniexchange-cluster.fbmonai.mongodb.net/?appName=uniexchange-cluster";

// Used to sign the session cookie
SESSION_SECRET = "test";

mongoose
  .connect(dbURI)
  .then(() => app.listen(3001))
  .catch((err) => console.log(err));

//Written by Frank Yang, 2/27/26
//Middleware for logging in; prepares the incoming data so the routes can use it
app.use(express.static("public"));

//Reads the raw text from the username and password and converts it into a JS object. So now the code
// can do req.body.username and get teh username back.
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev")); //Every time a request hits the server it prints a line in the terminal

//Middleware for checking if the user is logged in
const requireGuest = (req, res, next) => {
  if (req.session.userId) {
    return res.render("signup", {
      title: "Signup Page",
      error: "You are already logged in. Log out to make a new account.",
    });
  }
  next();
};

//Middleware for checking if the user is logged in so that they can make a post
const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/login?error=login_required");
  }
  next();
};

//Written by Jacky Jiang
let bucket;

mongoose.connection.once("open", () => {
  bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "images",
  });
});

// Written by William Zheng, 2/19/26
// Session middleware
app.use(
  session({
    secret: SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: dbURI,
    }),

    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

// Written by Jaden Nguyen, 3/4/26
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!req.session.userId;
  res.locals.username = req.session.username;
  next();
});


//Written by Jacky Jiang
app.get("/image/:id", (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id);
  bucket.openDownloadStream(id).pipe(res);
});

//register view engine, this is for ejs
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/hub", requireLogin, (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("hub", { title: "All Posts", posts: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

//Updated by Jacky Jiang
// Handles image uploading when a post is created
app.post("/", requireLogin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");
    if (!bucket) return res.status(500).send("GridFS not ready");

    const uploadFile = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStream(req.file.originalname, {
          contentType: req.file.mimetype,
        });

        uploadStream.end(req.file.buffer);

        uploadStream.on("error", reject);

        uploadStream.on("finish", () => {
          resolve(uploadStream.id);
        });
      });
    };

    const fileId = await uploadFile();

    const post = new Post({
      imageId: fileId,
      title: req.body.title,
      description: req.body.description,
      condition: req.body.condition,
      categories: normalizeCategories(req.body.categories),
      price: req.body.price,
      location: req.body.location,
      author: req.session.username,
    });

    await post.save();
    res.redirect("/hub");
  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
});


// The following get routes are only used to render in ejs files, 
// The only exception is the /logout route, which also destroys the user's session
app.get("/post", requireLogin, (req, res) => {
  res.render("post", { title: "Post", categories: ITEM_CATEGORIES });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});

app.get("/blog", (req, res) => {
  res.render("blog", { title: "Blogs" });
});

app.get("/support", (req, res) => {
  res.render("support", { title: "Support" });
});

app.get("/login", (req, res) => {
  res.render("login", { title: "Login Page", error: null });
});

app.get("/signup", requireGuest, (req, res) => {
  res.render("signup", { title: "Signup Page", error: null });
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.get("/userGuide", (req, res) => {
  res.render("userGuide", { title: "User Guide" });
});

app.get("/systemGuide", (req, res) => {
  res.render("systemGuide", { title: "System Guide" });
});
// End of basic rendering middleware


//3/3/26 Made by Frank
//3/5/26 Updated by Frank. When the User finds the post in the database using the ID from url, it checks if there is an author
//and if the author is different from the currently logged in user. If the check fails, it displays an error message.
app.get('/posts/:id/edit', requireLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.author !== req.session.username) {
       return res.redirect(`/${req.params.id}?error=not_allowed`);
    }

    res.render('edit', { title: 'Edit Post', post: post, categories: ITEM_CATEGORIES });
  } catch (err) {
    console.log(err);
  }
});


// Originally made by Frank on 2/6
// William made additions and bug fixes on 2/12
// Handles uploading of images when a post is being updated
app.post('/posts/:id', requireLogin, upload.single('image'), async (req, res) => {
  const id = req.params.id;

  try {
    const existingPost = await Post.findById(id);

    if (existingPost.author && existingPost.author !== req.session.username) {
      return res.status(403).send('You are not allowed to edit this post');
    }

    if (!req.file) return res.status(400).send('No file uploaded');
    if (!bucket) return res.status(500).send('GridFS not ready');

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('error', (err) => {
      console.error(err);
      return res.status(500).send('Upload failed');
    });

    uploadStream.on('finish', async () => {
      await Post.findByIdAndUpdate(id, {
        imageId: uploadStream.id,
        title: req.body.title,
        description: req.body.description,
        condition: req.body.condition,
        categories: normalizeCategories(req.body.categories),
        price: req.body.price,
        location: req.body.location,
      });

      res.redirect('/hub');
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Update failed');
  }
});

//Made by Jacky Jiang 2/20/26
//Additions made by William Zheng 2/23
//This function originally lets a user sign up for a new account
//Now, this function encrypts the password when the user submits their password
app.post("/signup", requireGuest, async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Code to encrypt the user's password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      password: hashedPassword, // Storing the hash instead of the plaintext
    });

    await newUser.save();

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.status(500).send("Signup failed");
  }
});

// Written by Frank, 2/27/26
// Checks submitted credentials against the database and logs the user in
app.post("/login", async (req, res) => {
  //When the form is submitted these lines of code run
  try {
    const { username, password } = req.body; //Unpacks the data from when the middleware turned the data into JS object

    // Look up the user by username
    const user = await User.findOne({ username });

    //First check
    if (!user) {
      // Username not found
      return res.status(401).render("login", {
        title: "Login Page",
        error: "Invalid username or password",
      });
    }

    //Second checkpoint to see if password is right
    // Compare submitted password against the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password); //Takes the plain text password and scrambles it in the exact way

    //Checks if the result matches what's stored
    if (!passwordMatch) {
      // Password is wrong
      return res.status(401).render("login", {
        title: "Login Page",
        error: "Invalid username or password",
      });
    }

    // Credentials are correct — save user info to session
    req.session.userId = user._id;
    req.session.username = user.username;

    res.redirect("/hub");
  } catch (err) {
    console.error(err);
    res.status(500).send("Login failed");
  }
});

// Made by William Zheng, 3/3
// Logout route
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Logout failed");
    }

    // Clear cookie from browser
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
});

// Handles getting the details page for an individual post
app.get("/:id", requireLogin, (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).render("404", { title: "Post not found" });
  }

  Post.findById(id)
    .then((result) => {
      if (!result) {
        return res.status(404).render("404", { title: "Post not found" });
      }
      res.render("details", { post: result, title: "Post Details", query: req.query });
    })
    .catch((err) => console.log(err));
});

// Handles deleting a post
//Updated by Frank 3/5/26. IF a user isn't allowed to delete we send back an error message.
app.delete('/:id', requireLogin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.author !== req.session.username) {
       return res.json({ error: 'not_allowed', id: req.params.id });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ redirect: '/hub' });
  } catch (err) {
    console.log(err);
  }
});

// 404 page, this is the final page seen buy a user if all other routes are not satisfactory
app.use((req, res) => {
  res.render("404", { title: "404!" });
  res.status(404);
});
