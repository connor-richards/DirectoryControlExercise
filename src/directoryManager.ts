import { Directory } from "./directory";

export class DirectoryManager {
  rootDir: Directory;

  constructor() {
    this.rootDir = new Directory(["ROOT"], null);
  }

  /**
   * Moves a directory from the source path to the destination path.
   * @param sourcePath The path of the directory to move.
   * @param destPath The path to move the directory to.
   */
  moveDirectory(sourcePath: string, destPath: string) {
    try {
      const sourceParts = sourcePath.trim().split("/");
      const destParts = destPath.trim().split("/");

      if (
        !sourceParts ||
        !sourceParts.length ||
        !destParts ||
        !destParts.length
      ) {
        console.log("Invalid paths for MOVE command.");
        return;
      }

      // Find the directory to move
      const sourceDir = this.rootDir.removeChild(sourceParts);
      if (!sourceDir || typeof sourceDir === "string") {
        console.log(`Source directory ${sourcePath} not found.`);
        return;
      }

      // Find destination directory
      const destDir = this.rootDir.findChild(destParts);
      if (!destDir) {
        console.log(`Destination directory ${destPath} not found.`);
        return;
      }

      destDir.insertChild(sourceDir);
    } catch {
      console.error("Error moving directory.");
    }
  }

  /**
   * Creates a new directory on the root
   * @param path The path of the directory to create.
   */
  createDirectory(path: string) {
    try {
      const parts = path.trim().split("/");
      if (!parts || !parts.length) return;

      this.rootDir.createChild(parts);
    } catch {
      console.error("Error creating directory.");
    }
  }

  /**
   * Deletes a directory based on the provided path.
   * @param path The path of the directory to delete.
   */
  deleteDirectory(path: string) {
    try {
      const parts = path.trim().split("/");
      if (!parts || !parts.length) return;

      const deletedChild = this.rootDir.removeChild(parts);
      if (!deletedChild) {
        console.log(`Delete target directory ${path} not found.`);
      } else if (typeof deletedChild === "string") {
        console.log(
          `Cannot delete ${path} - ${deletedChild} does not exist`
        );
      }
    } catch {
      console.error("Error deleting directory.");
    }
  }

  /**
   * Lists all directories by printing them recursively.
   */
  listDirectories() {
    this.rootDir.print(-1, true);
  }

  /**
   * Processes the command from the user or file input.
   * @param command The command string (e.g., 'CREATE fruits/apples').
   */
  processCommand(command: string) {
    const parts = command.trim().split(" ");
    const action = parts[0].toUpperCase();

    switch (action) {
      case "CREATE":
        const path = parts.slice(1).join(" ");
        if (path) this.createDirectory(path);
        break;

      case "LIST":
        this.listDirectories();
        break;

      case "DELETE":
        const deletePath = parts.slice(1).join(" ");
        if (deletePath) this.deleteDirectory(deletePath);
        break;

      case "MOVE":
        const [sourcePath, destPath] = parts.slice(1).join(" ").split(" ");
        if (sourcePath && destPath) this.moveDirectory(sourcePath, destPath);
        else console.log("MOVE command requires two paths.");
        break;

      default:
        console.log(`Unknown command: ${action}`);
    }
  }

  /**
   * Processes a single line of input.
   * @param line The input line to process.
   */
  processInputLine(line: string) {
    try {
      this.processCommand(line);
    } catch {
      console.error("Error processing input line.");
    }
  }
}
