//Require Modules
const express = require("express");
const ejs = require("ejs");
const posts = [];
const _ = require("lodash");
const mongoose = require("mongoose");
const app = express();

//Connect to DB
mongoose.connect(
    "mongolink", { useNewUrlParser: true }
);

//Create DB Schema
const blogSchema = {
    title: String,
    body: String,
};

//Create the model (table) based on that Schema
const Blog = mongoose.model("Blog", blogSchema);

//Starting Content

const home = "Daily Blog";


const about = "Made with: HTML, CSS, NODE, EJS & MONGO";

const contact = "bascur62@gmail.com";

const defaultContent = [about, contact];


//Set the views folder
app.set("view engine", "ejs");

//Parse the body
app.use(express.urlencoded({ extended: true }));

//Set the static files folder
app.use(express.static("public"));



//Render Home
app.get("/", function(req, res) {
    Blog.find({}, function(err, foundItems) {
        if (err) {
            console.log(err);
        } else {
            res.render("home", {
                home_starting_content: home,
                sent_posts: foundItems
            })

        }
    })
})

//Render about
app.get("/about", function(req, res) {
        res.render("about", {
            about_content: about
        })
    })
    //Render contact
app.get("/contact", function(req, res) {
    res.render("contact", {
        contact_content: contact
    })
})


//Render compose

app.get("/compose", function(req, res) {
    res.render("compose");
});

//Get the data from compose

app.post("/compose", function(req, res) {
    //Store the stuff inside an json
    const post = new Blog({
        title: req.body.postTitle,
        body: req.body.postBody
    });
    post.save();
    //Push post into posts
    posts.push(post);
    res.redirect("/");
});

//Render the post page dinamically

app.get("/posts/:postId", function(req, res) {
    const requestedPostId = req.params.postId;
    Blog.findOne({ _id: requestedPostId }, function(err, post) {
        res.render("post", {
            title: post.title,
            content: post.body
        });
    });

});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});