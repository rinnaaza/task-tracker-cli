class OutOfRangeError extends Error {
    constructor() {
        super("Index is out of range !");
    }
};
class NotValidStatusError extends Error {
    constructor() {
        super("Status must be 'todo', 'in progress' or 'done'");
    }
};

class EmptyTaskInputError extends Error {
    constructor() {
        super("Empty string in invalid as task input.");
    }
};

class EmptyTaskListError extends Error {
    constructor() {
        super("There are no tasks");
    }
};

export { OutOfRangeError, NotValidStatusError, EmptyTaskInputError, EmptyTaskListError };