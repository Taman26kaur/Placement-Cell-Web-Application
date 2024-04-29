const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv").config();
const cors = require("cors");

const expressLayouts = require("express-ejs-layouts");
const ejs = require("ejs");
const sassMiddleware = require("node-sass-middleware");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("connect-flash");
const viewHelpers = require("./config/view-helpers")(app);
const env = require("./config/environment");

//Requires MongoDB
const db = require("./config/mongoose");
const route = require("./routes/index");
//Requires the Custom Middleware
const customMiddleware = require("./config/middleware");
const passportLocal = require("./config/passport-local-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");

//Middleware - CORS
app.use(cors());
if (env.name == "development") {
	app.use(
		sassMiddleware({
			src: path.join(__dirname, env.asset_path, "scss"),
			dest: path.join(__dirname, env.asset_path, "css"),
			debug: false,
			outputStyle: "extended",
			prefix: "/css",
		})
	);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(env.asset_path));
app.use("/storage", express.static(__dirname + "/storage"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(expressLayouts);
app.use(logger(env.morgan.mode, env.morgan.options));

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
	session({
		name: "PlacementCellApplication",
		secret: env.session_cookie_key,
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 1000 * 60 * 100,
		},
		//MongoStore is used to store the Session Cookies in the MongoDB
		store: MongoStore.create(
			{
				//DB Connection URL
				mongoUrl: `${env.db}`,
				//Interacts with the mongoose to connect to the MongoDB
				mongooseConnection: db,
				//To auto remove the store
				autoRemove: "disabled",
			},
			(err) => {
				if (err) {
					console.log(err || "connect-mongodb setup ok");
				}
			}
		),
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
//Middleware - Uses the Custom Middleware to set the Flash Message in the Response
app.use(customMiddleware.setFlash);
app.use(customMiddleware.createFolders);
app.use("/", route);

//Run the ExpressJS Server
app.listen(port, (err) => {
	if (err) return console.log("Error: ", err);
	console.log(`Server is running successfully on port ${port}`);
});
