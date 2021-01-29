require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mongoDB = process.env.MONGO_URI;

mongoose.connect(mongoDB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: true,
	useCreateIndex: true,
});

const PostSchema = new Schema({
	title: { type: String, required: true },
	body: { type: String, required: true },
});

const Post = mongoose.model("Post", PostSchema);

const homeStartingContent =
	"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
	"Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
	"Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
	Post.find({}, (err, posts) => {
		res.render("home", {
			homeText: homeStartingContent,
			posts: posts,
		});
	});
});

app.get("/compose", (req, res) => {
	res.render("compose");
});

app.post("/compose", (req, res) => {
	const { postTitle, postBody } = req.body;

	const post = new Post({
		title: postTitle,
		body: postBody,
	});

	post.save((err) => {
		if (!err) {
			res.redirect("/");
		}
	});
});

app.get("/posts/:postId", (req, res) => {
	const postId = req.params.postId;

	Post.findOne({ _id: postId }, (err, post) => {
		res.render("post", {
			title: post.title,
			body: post.body,
		});
	});
});

app.get("/about", (req, res) => {
	res.render("about", { aboutText: aboutContent });
});

app.get("/contact", (req, res) => {
	res.render("contact", { contactText: contactContent });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
	console.log("Server started on port 3000");
});
