const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { DBConnection } = require("./database/db.js");
const User = require("./model/User.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;


//middlewares

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Connects to the MongoDB database.
DBConnection();

//A simple route to check if the server is running.
app.get("/", (req, res) => {
    res.send("Hello, world!");
});

/*
Gets user data from the request body.
Checks if all required data is provided.
Checks if the user already exists.
Hashes the password for security.
Saves the new user in the database.
Creates a token for the user.
Sends back a success message and the user data (excluding the password).
*/
app.post("/register", async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        if (!(firstname, lastname, email, password)) {
            return res.status(400).send("Please enter all the information");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).send("User already exists!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        user.token = token;
        user.password = undefined;
        res.status(200).json({ message: "You have successfully registered!", user });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
});

/*
Gets login data from the request body.
Checks if all required data is provided.
Finds the user in the database.
Compares the provided password with the stored hashed password.
If correct, generates a token for the user.
Sends back a success message and sets a cookie with the token.
*/
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email, password)) {
            return res.status(400).send("Please enter all the information");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not found!");
        }

        const enteredPassword = await bcrypt.compare(password, user.password);
        if (!enteredPassword) {
            return res.status(401).send("Password is incorrect");
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        res.status(200).cookie("token", token, options).json({
            message: "You have successfully logged in!",
            success: true,
            token,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});

const Problem = require('./model/Problem');

app.post('/problems', async (req, res) => {
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).send(problem);
});

app.get('/problems', async (req, res) => {
    const problems = await Problem.find();
    res.send(problems);
});

// app.get('/problems/:id', async (req, res) => {
//     const problem = await Problem.findById(req.params.id);
//     res.send(problem);
// });
app.get('/problems/:id', async (req, res) => {
    try {
      const problem = await Problem.findById(req.params.id);
      if (!problem) {
        return res.status(404).json({ message: 'Problem not found' });
      }
      res.json(problem);
    } catch (error) {
      console.error('Error fetching problem:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.put('/problems/:id', async (req, res) => {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(problem);
});

app.delete('/problems/:id', async (req, res) => {
    await Problem.findByIdAndDelete(req.params.id);
    res.status(204).send();
});




// Get all test cases for a problem
app.get('/problems/:id/testcases', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).send('Problem not found');
        }
        res.json(problem.testCases);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Add a test case to a problem
app.post('/problems/:id/testcases', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).send('Problem not found');
        }
        const { input, output } = req.body;
        problem.testCases.push({ input, output });
        await problem.save();
        res.status(201).send(problem.testCases);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete a test case from a problem
app.delete('/problems/:id/testcases/:testCaseId', async (req, res) => {
    try {
      const problem = await Problem.findById(req.params.id);
      if (!problem) {
        return res.status(404).send('Problem not found');
      }
      
      const testCase = problem.testCases.find(tc => tc._id.toString() === req.params.testCaseId);
      if (!testCase) {
        return res.status(404).send('Test case not found');
      }
      
      // Remove the test case from the problem's testCases array
      problem.testCases.pull(testCase);
      
      await problem.save();
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
    

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
