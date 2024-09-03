class OutOfRangeError extends Error {
    constructor() {
        super("Index is out of range !");
    }
};
class invalidInput extends Error {
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

export { OutOfRangeError, invalidInput, EmptyTaskInputError, EmptyTaskListError };