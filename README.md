## Employee record management API.
This is a simple API that supports functionality to manage Employee records and 
### Features
 - Create Employee record.
 - Delete employee record.
 - Query employee record.

### Requirements
 - NodeJS >= 18
 - MySQL.

### How to run.

### Notes.

If we were to have many employee records that needed to be sharded, using a key that can be easily sharded will be of great help. For instance using ULID instead of UUID to make sure we can partition data and easily search for the shard a record belongs to.