import express, { response } from "express";
import users from "./utils/listusers.mjs";
import router from "./routes/users.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
// import path from "node:path";

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cookieParser("helloWorld"));
app.use(
    session({
        secret: "aiman",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
        },
    })
);
app.use(router);

app.listen(port, () => {
    console.log(`server running on port:${port}`);
});
app.get("/products", (request, response) => {
    console.log(request.cookies);
    console.log(request.headers.cookie);
    console.log(request.signedCookies);
    request.session.visited = true;
    request.sessionStore.get(request.session.id, (err, session_data) => {
        if (err) {
            console.log("EEERRROOORR", err);
            throw err;
        }

        console.log("session_dataaaaaaaaaaaaaaaaaaaaaaaa\n", session_data);
    });
    console.log(request.session);
    console.log(request.session.id);
    if (request.cookies.hello && request.cookies.hello == "world")
        return response.send(users);
    response.sendStatus(200);
});
const loginMiddleware = (request, response, next) => {
    const {
        params: { id },
    } = request;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) return response.sendStatus(400);
    const finduserIndex = users.findIndex((user) => user.id === parsedId);

    if (finduserIndex === -1) return response.sendStatus(404);
    request.index = finduserIndex;
    next();
};
// app.use(loginMiddleware);

app.route("/hello")
    .get((req, res) => {
        res.send("hi");
    })
    .post((req, res) => {
        res.send("hohoho");
    });
app.post("/auth", (request, response) => {
    const {
        body: { user_name, password },
    } = request;
    const findUser = users.find((user) => user.user_name == user_name);
    if (!findUser)
        return response.status(401).send({ msg: "Wrong Credentials!" });
});
