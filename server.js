const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const axios = require("axios");

//  importing lodash
// Load the full build.
var lodash = require("lodash");

//  importing Routes
const apiRoutes = require("./routes/apiRoutes");
 
const app = express();
app.use(express.json()); // to accept json data
app.use(express.urlencoded({ extended: false }));

//  middleware for fetching data

const fetchDataMiddleware = async (req, res, next) => {
  try {
    const url = 'https://intent-kit-16.hasura.app/api/rest/blogs';
    const headers = {
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
    };

    const response = await axios.get(url, { headers });
    console.log("Fetch Data",response.data);

    req.data = response.data;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while making the request" });
  }
};

//  using middleware to fetch data in all routes 
app.use(fetchDataMiddleware); 



//  default home route
app.get("/", async (req, res) => {
  const data = req.data.blogs[0];
  res.status(200).json(data);
});

//  creating routes
app.use("/api", apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


