import { DirectoryManager } from "../src/directoryManager";
import * as fs from "fs";
import * as path from "path";

let outputData: string[] = [];

// Run jest to test/read console output given the test inputs
beforeEach(() => {
  outputData = [];
  jest.spyOn(console, "log").mockImplementation((msg) => outputData.push(msg));
  jest
    .spyOn(console, "error")
    .mockImplementation((msg) => outputData.push(`Error: ${msg}`));
});

describe("DirectoryManager", () => {
  const expectedOutput = [
    "fruits",
    "  apples",
    "    fuji",
    "grains",
    "vegetables",
    "foods",
    "  fruits",
    "    apples",
    "      fuji",
    "  grains",
    "  vegetables",
    "    squash",
    "Cannot delete fruits/apples - fruits does not exist",
    "foods",
    "  fruits",
    "  grains",
    "  vegetables",
    "    squash",
  ];

  it("should take input from a file", () => {
    const manager = new DirectoryManager();

    // Read the input commands from the test file
    const filePath = path.join(__dirname, "test1.txt");
    const commands = fs
      .readFileSync(filePath, "utf-8")
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);

    // Process each command
    commands.forEach((command) => manager.processInputLine(command));

    // Verify the output matches the expected output
    expect(outputData).toEqual(expectedOutput);
  });

  it("should take commands from a user", () => {
    const manager = new DirectoryManager();

    const commands = [
      "CREATE fruits",
      "CREATE vegetables",
      "CREATE grains",
      "CREATE fruits/apples",
      "CREATE fruits/apples/fuji",
      "LIST",
      "CREATE grains/squash",
      "MOVE grains/squash vegetables",
      "CREATE foods",
      "MOVE grains foods",
      "MOVE fruits foods",
      "MOVE vegetables foods",
      "LIST",
      "DELETE fruits/apples",
      "DELETE foods/fruits/apples",
      "LIST",
    ];

    // Process each command as simulated user input
    commands.forEach((command) => manager.processInputLine(command));

    // Verify the output matches the expected output
    expect(outputData).toEqual(expectedOutput);
  });
});
