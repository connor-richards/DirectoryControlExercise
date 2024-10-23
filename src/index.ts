import * as fs from "fs";
import * as readline from "readline";
import { DirectoryManager } from "./directoryManager";

// Function to process file input or enter interactive mode
function main() {
  const manager = new DirectoryManager();
  const filePath = process.argv[2];

  if (filePath) {
    // Process commands from a file if a file path is provided
    try {
      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      rl.on("line", (line) => {
        manager.processInputLine(line);
      });
    } catch {
      console.error("Error reading file.");
    }
  } else {
    // Enter interactive mode if no file is provided
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on("line", (input) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
        process.exit(0);
      } else manager.processInputLine(input);
    });
  }
}

// Call the main function to run the program
main();
