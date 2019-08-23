const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const [auth, superadmin] = require("../middleware/auth");
const jwt = require("jsonwebtoken");

// Create new user
router.post("/users", async (req, res) => {
  const newUser = new User(req.body);

  // If it's the first user, set the userlevel to "0" (superadmin)
  const users = await User.find();
  let userLevel = 1;
  if (users.length === 0) {
    userLevel = 0;
    try {
      newUser.userlevel = userLevel;
      await newUser.save();
      const token = await newUser.generateAuthToken();
      res.status(201).send({ newUser, token });
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    // If there already are users in the collection, then only the superadmin (userlevel=0) can create users
    try {
      const token = req.header("Authorization").replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({
        _id: decoded._id,
        "tokens.token": token,
        userlevel: 0
      });

      if (!user) {
        res
          .status(401)
          .send({ error: "Only the superadmin can create users!" });
      }

      try {
        // Only the superadmin can create new users
        newUser.userlevel = userLevel;
        await newUser.save();
        res.status(201).send({ newUser, token });
      } catch (e) {
        res.status(400).send(e);
      }
    } catch (e) {
      res.status(401).send(e.toString());
    }
  }
});

// Get the current user
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

// Update the current user
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];

  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({
      error: "Invalid updates!"
    });
  }

  try {
    const user = req.user;

    updates.forEach(update => {
      return (user[update] = req.body[update]);
    });

    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

// Log in a user
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

// Log out the current user of the current session
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// Log out the current user - all sessions
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500);
  }
});

// Superadmin operations

// Get all users
router.get("/users", superadmin, async (req, res) => {
  if (req.user.userlevel !== 0) {
    res.status(400).send({
      error: "Not enough privileges!"
    });
  }

  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    res.status(500).send();
  }
});

// Get a user by id
router.get("/users/:id", superadmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

// Update a user by id
router.patch("/users/:id", superadmin, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];

  const isValidOperation = updates.every(update => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({
      error: "Invalid updates!"
    });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).send(user);
    }

    updates.forEach(update => {
      return (user[update] = req.body[update]);
    });

    await user.save();

    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

// Delete a user by id
router.delete("/users/:id", superadmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.send(user);
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
