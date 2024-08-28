const printHelp = (): void => {
    console.log(`
        Usage: task-cli <command> [options]
        Commands:
        add <task>                          Add new task
        update <index> <task>               Update existing task at a specific index.
        delete <index>                      Delete existing task at a specific index.
        mark-in-progress <index>            Update status of existing task at a specific index to in progress.
        mark-done <index>                   Update status of existing task at a specific index to done.
        mark-todo <index>                   Update status of existing task at a specific index to not done.
        list                                List all tasks.
        list in-progress                    List in progress tasks.
        list done                           List all done tasks.
        list todo                           List all todo tasks.
    `);
};

export { printHelp };