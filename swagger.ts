import swaggerAutogen from "swagger-autogen";

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/employees.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, {
    schemes: ["http"],
    securityDefinitions: {
        bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
        },
    },
});
