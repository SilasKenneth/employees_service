![](https://github.com/SilasKenneth/employees_service/actions/workflows/check-pr.yaml/badge.svg)
## Employee record management API.
This is a simple API that supports functionality to manage Employee records and 
### Features
 - Create Employee record.
 - Delete employee record.
 - Query employee record.

### Requirements
 - NodeJS >= 18
 - PostgreSQL.

### Tools Used
- Express as the framework.
- Winston for logging(Because logging is important in production especially to diagnose root cause for errors.)
- Sequelize as the ORM.
- Rome - A fast tool for code formatting and linting.
- express-jwt for authentication using JWT.
- JsonSchema for Validation Request bodies to make sure they are valid.
### How to run.
- Create a .env file and populate the file with the contents from .env.example.
- Replace the config with your own machine specific config.
- Install dependencies using npm install(You can also use yarn).
- Run `npm run build` to build the application.
- Run `npm run dev` to start the application server in development mode.
- Open the url displayed on the console then navigate to `http://URL/api-docs` to view the API documentation and find out everything you can do with the application.

### Notes.

If we were to have many employee records that needed to be sharded, using a key that can be easily sharded will be of great help. For instance using ULID instead of UUID to make sure we can partition data and easily search for the shard a record belongs to.

### Assumptions made.

- The application is going to be used by just one company to manage employee records.
- The data on employees can fit on a single database server.

### Possible issues with the application.
- Logging includes sensitive information like the user personal details passed in the post body when creating an employee.

### Areas of improvement.
- Make a robust permission system using oauth2.0 to support more complex use scenarios for multiple users who should have different permissions on the system.
- Make error handling more precise.