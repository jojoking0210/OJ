const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const { DBConnection } = require("./database/db.js");
const User = require("./model/User.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {generateFile}= require("./generateFile");
const {executeCpp}=require("./executeCpp");
const {generateInputFile} = require("./generateInputFile");
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

app.post("/run", async (req, res) => {
    // const language = req.body.language;
    // const code = req.body.code;

    const { language = 'cpp', code, input } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }
    try {
        const filePath = await generateFile(language, code);
        const inputPath = await generateInputFile(input);
        const output = await executeCpp(filePath,inputPath);
        res.json({ filePath, inputPath, output });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: error });
    }
});


//Post user
app.post('/users', async (req, res) => {
    try {
      const { firstname, lastname, email, role, password } = req.body;
  
      // Log the request body to verify the role field
      console.log('Request Body:', req.body);
  
      const newUser = new User({ firstname, lastname, email, role, password });
      await newUser.save();
      res.status(201).send(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  });

  //updating user
  app.put('/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { firstname, lastname, email, role, password } = req.body;
  
      // Log the request body to verify the role field
      console.log('Request Body:', req.body);
  
      const updatedUser = await User.findByIdAndUpdate(id, { firstname, lastname, email, role, password }, { new: true });
      res.status(200).send(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  });
  
  app.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

app.get('/users/:id', async (req, res) => {
    try {
      const users = await User.findById(req.params.id);
      if (!users) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(users);
    } catch (error) {
      console.error('Error fetching problem:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

    
app.get('users/:id/profile',async(req,res)=>{
    try {
        const user =await User.findById(req.params.id);
        if(!user){
            return res.status(404).send('User not found');
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.put('users/:id/profile',async(req,res)=>{
    try {
        const { username, profilePhoto, questionsSolved } = req.body;
        const user = await User.findByIdAndUpdate(
          req.params.id,
          { username, profilePhoto, questionsSolved },
          { new: true, runValidators: true }
        );
        if (!user) {
          return res.status(404).send('User not found');
        }
        res.status(200).send(user);
      } catch (error) {
        res.status(500).send(error.message);
      }
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
        const { firstname, lastname, email,role, password } = req.body;

        if (!(firstname, lastname, email, role, password)) {
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
            role,
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

        //stoer cookies
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true, //only manipulated by server not by client/user
        };
        //send the token
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

// Auth middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Access Denied. You do not have the required permissions.');
  }
  next();
};

module.exports = { authMiddleware, isAdmin };


// Add this route to get the current user's information
app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).send('User not found.');
        }
        res.send({ user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Logout route
app.post('/api/auth/logout', authMiddleware, (req, res) => {
    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    res.send({ message: 'Successfully logged out' });
});

//problem route

const Problem = require('./model/Problem');

app.post('/problems',async (req, res) => {
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).send(problem);
});

app.get('/problems', async (req, res) => {
    const problems = await Problem.find();
    res.send(problems);
});

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

app.delete('/problems/:id',async (req, res) => {
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
