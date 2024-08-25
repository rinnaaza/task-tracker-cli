import { v4 as uuidv4 } from "uuid";

const generateId = () :string => {
    return uuidv4();
}

const inRange = (index: number, min: number, max: number) : boolean => (
    (index >= 0) && (index <= max)
);

const notInRange = (index: number, min: number, max: number) : boolean => !(inRange(index, min, max));

export { generateId, inRange, notInRange };