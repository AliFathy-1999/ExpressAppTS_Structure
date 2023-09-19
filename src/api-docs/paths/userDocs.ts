export default {
    "/users/register": {
        post: {
        summary: "Register a new user.",
        tags: ["User"],
        requestBody: {
            required: true,
            content: {
            "multipart/form-data": {
                schema: {
                type: "object",
                properties: {
                    firstName: {
                    type: "string",
                    },
                    lastName: {
                    type: "string",
                    },
                    userName: {
                    type: "string",
                    },
                    email: {
                    type: "string",
                    },
                    password: {
                    type: "string",
                    },
                    pImage: {
                    type: "file",
                    },
                },
                },
            },
            },
        },
        responses: {
            "201": {
            description: "User registered successfully.",
            content: {
                "application/json": {
                schema: {
                    type: "object",
                    properties: {
                    status: {
                        type: "string",
                    },
                    data: {
                        $ref: "#/components/schemas/User",
                    },
                    },
                },
                },
            },
            },
        },
        },
},
    "/users/login": {
        post: {
        summary: "Sign in with email and password.",
        tags: ["Authentication"],
        requestBody: {
            required: true,
            content: {
            "application/json": {
                schema: {
                type: "object",
                properties: {
                    email: {
                    type: "string",
                    },
                    password: {
                    type: "string",
                    },
                },
                },
            },
            },
        },
        responses: {
            "200": {
            description: "User signed in successfully.",
            content: {
                "application/json": {
                schema: {
                    type: "object",
                    properties: {
                    status: {
                        type: "string",
                    },
                    token: {
                        type: "string",
                    },
                    data: {
                        $ref: "#/components/schemas/User",
                    },
                    },
                },
                },
            },
            },
            "401": {
            description: "Invalid email or password.",
            },
        },
        },
},
    "/users/": {
    patch: {
        summary: "Update user information.",
        tags: ["User"],
        security: [
            {
                bearerAuth: [],
            },
        ],
        requestBody: {
            required: true,
            content: {
            "multipart/form-data": {
                schema: {
                type: "object",
                properties: {
                    firstName: {
                        type: "string",
                    },
                    lastName: {
                        type: "string",
                    },
                    pImage: {
                        type: "string",
                        format: "binary",
                    },
                },
                },
            },
            },
        },
        responses: {
            "200": {
            description: "User information updated successfully.",
            content: {
                "application/json": {
                schema: {
                    type: "object",
                    properties: {
                    status: {
                        type: "string",
                    },
                    data: {
                        $ref: "#/components/schemas/User",
                    },
                    },
                },
                },
            },
            },
            "401": {
            description: "Unauthorized - User not authenticated.",
            },
            "500": {
            description: "Internal Server Error.",
            },
        },
        },
    },
    "/users/{id}": {
        delete: {
        summary: "Delete a user by ID",
        tags: ["User"],
        security: [
            {
                bearerAuth: [],
            },
        ],
        parameters: [{
            name: "id",
            in: "path",
            description: "ID of the user to delete",
            required: true,
            schema: {
                type: "string",
            },
        }],
        requestBody: {
            required: false,
        },
        responses: {
            "200": {
            description: "User deleted successfully",
            content: {
                "application/json": {
                schema: {
                    type: "object",
                    properties: {
                    status: {
                        type: "string",
                        example: "success",
                    },
                    },
                },
                },
            },
            },
            "400": {
            description: "Bad request, user not found",
            content: {
                "application/json": {
                schema: {
                    type: "object",
                    properties: {
                    status: {
                        type: "string",
                        example: "error",
                    },
                    message: {
                        type: "string",
                        example: "No User with ID {id}",
                    },
                    },
                },
                },
            },
            },
            "403": {
                description: "Unauthorized - User not authenticated",
            },
            "500": {
                description: "Internal Server Error",
            },
        },
        },
    },
};
