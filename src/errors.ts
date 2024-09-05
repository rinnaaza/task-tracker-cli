class OutOfRangeError extends Error {
    constructor() {
        super("Index is out of range !");
    }
};
class invalidInputError extends Error {
    constructor() {
        super("invalid input");
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

export { OutOfRangeError, invalidInputError, EmptyTaskInputError, EmptyTaskListError };