import { generateId, inRange } from "../src/helpers";

// Mock uuidv4 to have predictable output
jest.mock("uuid", () => ({
    v4: jest.fn(() => "1234-5678-9012-3456"),
}));

describe("helpers: generateId", () => {
    it("should generate a UUID", () => {
      const id = generateId();
      expect(id).toBe("1234-5678-9012-3456");
    });
  
    it("should return a string", () => {
      const id = generateId();
      expect(typeof id).toBe("string");
    });
});

describe("helpers: inRange", () => {
  test("should return true if index is within range", () => {
    expect(inRange(5, 1, 10)).toBe(true);
    expect(inRange(1, 1, 10)).toBe(true);
    expect(inRange(10, 1, 10)).toBe(true);
  });

  test("should return false if index is below the range", () => {
    expect(inRange(0, 1, 10)).toBe(false);
    expect(inRange(-1, 1, 10)).toBe(false);
  });

  test("should return false if index is above the range", () => {
    expect(inRange(11, 1, 10)).toBe(false);
    expect(inRange(100, 1, 10)).toBe(false);
  });

  test("should return false if min is greater than max", () => {
    expect(inRange(5, 10, 1)).toBe(false);
    expect(inRange(10, 20, 5)).toBe(false);
  });
});