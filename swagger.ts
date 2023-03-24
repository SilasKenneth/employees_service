import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/employees.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, {
    schemes: ["http", "https"],
    info: {
        title: "Employee record service",
        description: "Just some simple service",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local Server",
        },
        {
            url: "https://employee-records-service.onrender.com",
            description: "Hosted Service(Render)",
        },
    ],
    securityDefinitions: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
        },
    },
});
