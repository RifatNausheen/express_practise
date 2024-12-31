const createUserValidationSchema = {
    user_name: {
        isLength: {
            options: {
                min: 2,
                max: 15,
            },
            errorMessage: "username should be 2-15 characters long",
        },
        notEmpty: {
            errorMessage: "User name must be included",
        },
    },
};
export default createUserValidationSchema;
