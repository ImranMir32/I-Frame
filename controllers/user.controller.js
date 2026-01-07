const userModel = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    console.log("re",req.body);
    const { error, value } = userModel.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = value;

    const { resources } = await req.usersContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.email = @email",
        parameters: [{ name: "@email", value: email }],
      })
      .fetchAll();

    if (resources.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      role: "user",
      savedPhotos: [],
      createdAt: new Date().toISOString(),
    };

    const { resource: newUser } = await req.usersContainer.items.create(user);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { resources } = await req.usersContainer.items
      .query({
        query: "SELECT * FROM c WHERE c.email = @email",
        parameters: [{ name: "@email", value: email }],
      })
      .fetchAll();

    if (resources.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = resources[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const currentUser = async (req, res) => {
  res.json(req.user);
};

const savePhoto = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return res.status(400).json({ message: "Photo URL required" });
    }

    const { resource: user } = await req.usersContainer.item(userId, userId).read();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.savedPhotos.includes(photoUrl)) {
      user.savedPhotos.push(photoUrl);
      await req.usersContainer.items.upsert(user);
    }

    res.status(200).json({
      message: "Photo saved successfully",
      savedPhotos: user.savedPhotos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  savePhoto,
};