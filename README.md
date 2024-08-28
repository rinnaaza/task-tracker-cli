## Task Tracker CLI

### Description:
A command line interface (CLI) to track what you need to do, what you have done and what you are currently working on.

Examples:
```shell
    # Adding a new task
    task-cli add "Buy groceries"
    # Output: Task added successfully (Id: 1)

    # Updating and deleting tasks
    task-cli update 1 "Buy groceries and cook dinner"
    task-cli delete 1

    # Marking a task as in progress or done or back to to do
    task-cli mark-in-progress 1
    task-cli mark-done 1


    # Listing all tasks
    task-cli list

    # Listing tasks by status
    task-cli list done
    task-cli list todo
    task-cli list in-progress

    # Print all the options
    task-cli
```

These tasks are either stored in a generated json file or in MongoDb document (in MyTasks collection) under this format (**exercice to apply dependency inversion principle**):
```javascript
    {
        "title": "my-tasks",
        "tasks": [
            {
            "id": "7e9e3b9b-3758-4dba-9204-a4bab85b3097",
            "description": "finish project",
            "status": "to do",
            "createdAt": "00:04:25 29/08/2024",
            "updatedAt": ""
            }
        ]
    }
```

### Installation:
Type in cmd:
```shell
    git clone https://github.com/rinnaaza/task-tracker-cli.git
```

Once you have the repository locally:
```
    cd <local-repository-name>
    npm intall
```

Compile:
```
    npm run build
```

### Configuration:
If you would like to store the tasks list in MongoDb, uncomment code in index.ts:

create .env file in the root that will have the following environment variables following .env.example:
```
    DATABSE_URI=""
    DATABASE_NAME=""
```
