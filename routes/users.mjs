import Router from "express";
const router = Router();
import {
    query,
    validationResult,
    checkSchema,
    matchedData,
} from "express-validator";
import createUserValidationSchema from "../checkvulneb.mjs";
import users from "../utils/listusers.mjs";
import loginMiddleware from "../utils/middleware.mjs";
// routers.use(express.json);
router.get("/", (request, response) => {
    response.cookie("hello", "world", {
        maxAge: 60000,
        signed: true,
        // httpOnly: true,
    });
    response.send("type /users after port number");
});
router.post(
    "/users",
    checkSchema(createUserValidationSchema),
    (request, response) => {
        const result = validationResult(request);
        console.log(result);

        if (!result.isEmpty())
            return response.status(400).send({ error: result.array() });
        const a = matchedData(request);
        console.log(a);
        // const data = request.body;
        const user = { id: users[users.length - 1].id + 1, ...a };
        // console.log(data);
        users.push(user);
        response.statusCode = 201;
        response.send();
    }
);
router.get(
    "/users",
    query("filter")
        .isString()
        .notEmpty()
        .withMessage("filter should not be Empty")
        .isLength({ min: 3, max: 12 })
        .withMessage("string should be 3-12 length"),
    (request, response) => {
        // response.json(users);
        const result = validationResult(request);
        console.log(result);
        const {
            query: { filter, value },
        } = request;

        if (!filter && !value) return response.send(users);

        const userfetched = users.filter((user) =>
            user[filter]?.includes(value)
        );

        if (!userfetched) return response.send("invalid username");

        response.send(userfetched);
        // response.sendFile(path.join(__dirname,'index.html'));
    }
);
router.patch("/users/:id", loginMiddleware, (request, response) => {
    const { body, index } = request;

    users[index] = { ...users[index], ...body };
    return response.sendStatus(200);
});
router.get("/users/:id", (request, response) => {
    console.log(request.params);
    const userId = parseInt(request.params.id);
    if (isNaN(userId)) return response.status(400).send("Invalid ID.");
    const findUser = users.find((user) => user.id === userId);
    if (!findUser) return response.sendStatus(404);
    return response.json(findUser);
});
router.put("/users/:id", (request, response) => {
    const {
        body,
        params: { id },
    } = request;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return response.sendStatus(400);
    const finduserIndex = users.findIndex((user) => user.id === parsedId);

    if (finduserIndex === -1) return response.sendStatus(404);

    users[finduserIndex] = { id: parsedId, ...body };
    return response.sendStatus(200);
});

router.delete("/users/:id", (request, response) => {
    const {
        params: { id },
    } = request;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) return response.sendStatus(400);

    const finduserIndex = users.findIndex((user) => user.id === parsedId);

    if (finduserIndex === -1) return response.sendStatus(404);

    users.splice(users[finduserIndex], 1);
    response.sendStatus(200);
});
export default router;
