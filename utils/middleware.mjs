import users from "../utils/listusers.mjs";
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
export default loginMiddleware;
