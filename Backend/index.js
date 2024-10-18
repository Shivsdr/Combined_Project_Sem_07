import puppeteer from "puppeteer-extra";
import stealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import bodyParser from "body-parser";
import scrapper from "./amazonScrapper.js";
import { executablePath } from "puppeteer";
import express from "express";
import axios from "axios";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import connectDB from "./Database/dbConnection.js";
import User from "./Database/user.js";
import ProductDetails from "./Database/productDetails.js";
import cors from "cors";
import { stringify } from "querystring";
import web3Functions from "./web3.js";

const app = express();
const port = 3000;
const saltRounds = 10;

const { check, addProductDetails, getProductDetails } = web3Functions;

connectDB();

// Middleware for parsing json
app.use(express.json());

// Enable CORS
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(
  session({
    // secret: process.env.SESSION_SECRET,
    secret: "TOPSECRET",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

puppeteer.use(stealthPlugin());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.render("index.ejs");
// });

app.post("/search", async (req, res) => {
  const search_term = req.body.searchQuery.toLowerCase();
  const date = req.body.date;
  // console.log(req.user);
  const email = req.user.email;
  console.log("search_term:", search_term);

  // res.send("Invalid Search");
  // if (search_term == "" || !search_term) {
  // }
  let result;

  try {
    const chk = await check(search_term);

    if (chk) {
      console.log("Already Exists");
      const products = await getProductDetails(search_term);
      // console.log(products);

      result = products;
    } else {
      console.log("Sraping Reviews...");
      result = await scrapper(search_term);

      let temp = {};
      temp["product"] = result;
      console.log("waiting for model's response");
      const response = await axios.post("http://localhost:8000/getInp", temp);

      // console.log(response.data);
      let data = response.data.product;

      result = data.sort((a, b) => {
        const rateA = parseFloat(a.result.positive_rate) / 100;
        const rateB = parseFloat(b.result.positive_rate) / 100;
        return rateB - rateA;
      });

      result.map((d) => {
        console.log(d.result);
      });

      let for_blch = [];
      let for_db = [];

      result.map((i) => {
        let temp = {};
        temp["title"] = i.title ? i.title : "";
        temp["nextUrl"] = i.nextUrl ? i.nextUrl : "";
        temp["price"] = i.price ? i.price : "";
        temp["link"] = i.link ? i.link : "";
        temp["image_url"] = i.image_url ? i.image_url : "";

        for_blch.push(temp);

        temp["result"] = i.result;
        for_db.push(temp);
      });

      let dataToAdd = {
        email: email,
        searchedTerm: search_term,
        date: date,
        products: for_db,
      };

      const newSearch = new ProductDetails(dataToAdd);
      await newSearch.save();
      // console.log(for_blch);

      console.log("Adding to blockchain");
      await addProductDetails(search_term, for_blch);
    }

    let data = JSON.stringify(result);

    res.status(200).json({ result: data });
  } catch (e) {
    console.log("Error in /search route: ", e);
  }
  // fs.writeFile("data.json", data, (err) => {
  //   if (err) console.log(err);
  //   else {
  //     console.log("File written successfully\n");
  //   }
  // });

  // res.render("index.ejs", { result: result });
});

app.get("/pastSearches", async (req, res) => {
  if (req.isAuthenticated()) {
    const email = req.user.email;
    // console.log("email: ", email);

    try {
      const productDetails = await ProductDetails.find({ email });

      // console.log(productDetails);

      return res.status(200).json({ result: productDetails });
    } catch (e) {
      console.log("Error in /pastSearches: \n", e);
      throw err;
    }
  }

  return res.status(401).json({ message: "Bhag bsdk login kar phele" });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }

    if (!user) {
      // Authentication failed, send failure message
      return res
        .status(200)
        .json({ success: false, message: "Invalid username or password" });
    }

    // Manually log in the user
    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Login failed" });
      }

      // Login successful, send success message
      return res
        .status(200)
        .json({ success: true, message: "Login successful", user });
    });
  })(req, res, next);
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      const hash = await bcrypt.hash(password, saltRounds);
      const newUser = new User({ email, password: hash });
      await newUser.save();
      res
        .status(200)
        .json({ message: "Registration successful", isRegistered: true });
    } else {
      res
        .status(200)
        .json({ message: "Email already Registered", isRegistered: false });
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Registration Failed" });
  }
});

app.get("/isAuth", (req, res) => {
  // console.log("Session before isAuth:", req.session);
  // console.log("Authenticated user:", req.user); // Log the authenticated user

  if (req.isAuthenticated()) {
    res.status(200).json({ isAuth: true });
  } else {
    res.status(200).json({ isAuth: false });
  }
});

app.post("/logout", async (req, res, next) => {
  console.log("logout starting");

  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid"); // Clear the cookie

      console.log("after deleting:", req.session);
      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    });
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error details for debugging
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message, // Optionally include the error message
  });
});

passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, cb) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return cb(null, false, { message: "User not found" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return cb(null, user);
      } else {
        return cb(null, false, { message: "Invalid password" });
      }
    } catch (err) {
      return cb(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user); // Successfully found the user
  } catch (err) {
    done(err); // Handle error
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
