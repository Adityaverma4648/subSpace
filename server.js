const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const axios = require("axios");

//  importing lodash and handlebars
var lodash = require("lodash");
const hbs = require('hbs');

hbs.registerPartials(__dirname + '/views/partials');


// creating app instance-----------------------------------------------------------------------------------------------
const app = express();
app.use(express.json()); // to accept json data
app.use(express.urlencoded({ extended: false }));

// Serve static files (e.g., CSS and JavaScript) from the 'public' directory
app.use(express.static(__dirname + '/public'));




// --------------------------------------------------------------------------------------------------------
//  importing Routes
const apiRoutes = require("./routes/apiRoutes");
 





//  middleware for fetching data ----------------------------------------------------------------------------------------------------------------------

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

//  using middleware to fetch data in all routes -----------------------------------------------------------------------------------------------------------------------
app.use(fetchDataMiddleware); 



//  default home route --------------------------------------------------------------------------------------------------
app.get("/", async (req, res) => {
   res.render('index.hbs');
});




//  creating api routes--------------------------------------------------------------------------------------------
app.use("/api", apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


