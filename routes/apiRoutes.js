const express = require("express");
const axios = require("axios");
const lodash = require("lodash");

const router = express.Router();


//  analyzing the data fecthed

function analyze(blogs) {
  // 1 find no of blogs available /// normally array.length

  const length = lodash.size(blogs);

  //  2. find the longest title amongst blogs

  const longest_title = lodash.reduce(
    blogs,
    (result, item) => {
      const currentLength = item.title.length;
      // console.log(currentLength);
      if (currentLength > result.length) result = item.title;
      return result;
    },
    ""
  );

  //  3. title containing the word privacy

  const containsPrivacy = lodash.filter(blogs, (item) => {
    const title = item.title;
    return title.toLowerCase().indexOf("privacy") !== -1;
  });

  // 4.  no duplicate array
  const uniqueBlogs = lodash.uniqBy(blogs, "title");

  // console.log(
  //   length,
  //   longest_title,
  //   longest_title.length,
  //   containsPrivacy,
  //   uniqueBlogs,
  //   uniqueBlogs.length
  // );


  return [
    {
      total_length: length,
      longest_title: longest_title,
      contains_privacy: containsPrivacy.length,
      unique_blogs_title: uniqueBlogs,
    },
  ];
}

router.get("/blogs", async (req, res) => {

  const blogs = req.data.blogs;

  if(blogs)
      res.status(200).json({ blogs });
  else 
      res.status(400).json({ error : "Couldnot get memoized data" });
      
});

router.get("/blog-stats", async (req, res) => {

  const blogs = req.data.blogs;

  //  analyze
  const analyzedData = analyze(blogs);

  if(!analyzedData)
      res.status(400).json({ error : "Couldnot Get Analyzed Data" });

  const memoizedData = lodash.memoize(() => analyzedData, () => Date.now(), 3600000); 
 
  if(memoizedData())
      res.status(200).json({ result : memoizedData() });
  else 
      res.status(400).json({ error : "Couldnot get memoized data" });
      
});

router.get("/blog-search", async (req, res) => {
  
  const blogs = req.data.blogs;

  // entered keyword in search box
  const query = req.query.query;

  if(!query)
     res.status(400).json({error : "cannot get the search keyword"})

  // console.log(query);

  const data = blogs.filter((item) => {
    return item.title.toLowerCase().indexOf(query) !== -1;
  });

  res.status(200).json({
    data,
  });
});

module.exports = router;
