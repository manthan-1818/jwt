const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

const secretKey = "yourSecretKey";
const accessTokenExpiration = "2m";
const refreshTokenExpiration = "7d";

const user = {
  id: 1,
  username: "example_user",
  email: "user@example.com",
};

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
    secretKey,
    { expiresIn: accessTokenExpiration }
  );
  const refreshToken = jwt.sign({ id: user.id }, secretKey, {
    expiresIn: refreshTokenExpiration,
  });
  return { accessToken, refreshToken };
}

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, secretKey);
    req.decodedToken = decoded;
    next();
  } catch (error) { 
    res.status(401).json({ error: "Token is invalid or expired" });
  }
}

app.post("/login", (req, res) => {
  const tokens = generateTokens(user);
  res.json(tokens);
});

app.post("/refreshToken", (req, res) => {
  const tokens = generateTokens(user); 
  res.json(tokens);
});

app.get("/verifyToken/:token", verifyToken, (req, res) => {
  res.json({ decoded: req.decodedToken });
});

app.get("/", (req, res) => {
  res.send("Welcome to the JWT token generation and verification API.");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
