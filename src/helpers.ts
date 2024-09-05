import { v4 as uuidv4 } from "uuid";

const generateId = () :string => uuidv4();

const inRange = (index: number, min: number, max: number) : boolean => (
    (index >= min) && (index <= max)
);

export { generateId, inRange };