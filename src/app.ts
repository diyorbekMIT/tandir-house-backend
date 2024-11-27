import { strict } from "assert";
import express from "express"
import mongoose from "mongoose";
import path from "path"
import router from "./router";
import routerAdmin from "./routerAdmin";
import morgan from "morgan";

import session from "express-session";
import ConnectMongoDb from "connect-mongodb-session";
import { T } from "./libs/types/common";

const MongoDbStore = ConnectMongoDb(session);
const store = new MongoDbStore({
    uri: String(process.env.MONGO_URL),
    collection: "sessions",
})


/** 1-ENTRANCE */
const app = express();


app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads",express.static("./uploads"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan(":method :url :response-time [:status] \n"));


/** 2- SESSIONS */
app.use(session({
    secret: String(process.env.SECRET_KEY),
    resave: true,
    store: store,
    cookie: { maxAge: 1000 * 3600 * 3 },
    saveUninitialized: true,  
}))

app.use(function (req, res, next) {
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member;
    next();
});





/** 3- VIEWS */
app.set("views", path.join(__dirname,"views"))
app.set("view engine", "ejs");
mongoose.set("strictQuery", true);

/** 4- ROUTES */

app.use('/admin',routerAdmin ); // BSSR 
app.use("/", router); //SPA: REACT

export default app;

