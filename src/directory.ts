export class Directory {
  name: string;
  parent: Directory | null;
  children: Directory[];

  constructor(path: Array<string>, parent: Directory | null = null) {
    this.parent = parent;
    this.children = [];

    if (!path.length)
      throw new Error("Directory::constructor failed: Invalid path");

    this.name = path[0];
    this.createChild(path.slice(1));
  }

  /**
   * Creates a child Directory and inserts it into the path.
   * @param path The path of the directory to be added as a child.
   */
  createChild(path: Array<string>) {
    if (!path.length) return;

    // Attempt to add the directory as a subpath of an existing directory
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].name == path[0]) {
        this.children[i].createChild(path.slice(1));
        return;
      }
    }

    // Create the new child directory
    const child = new Directory(path, this);
    this.insertChild(child);
  }

  /**
   * Finds a reference to a child directory.
   * @param path The path of the directory to be located.
   */
  findChild(path: Array<string>): Directory | null {
    if (!path.length) return null;

    // Attempt to find the directory as a subpath of an existing directory
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].name == path[0]) {
        // Found the target dir
        if (path.length === 1) return this.children[i];
        // Search children for target
        return this.children[i].findChild(path.slice(1));
      }
    }

    return null;
  }

  /**
   * Adds a child directory to the current directory in alphabetical order.
   * @param child The Directory object to be inserted into our tree.
   */
  insertChild(child: Directory) {
    child.parent = this;

    // Insert the new child in the correct alphabetical order
    for (let i = 0; i < this.children.length; i++) {
      if (child.name < this.children[i].name) {
        this.children.splice(i, 0, child);
        return;
      }
    }
    // Otherwise add to end
    this.children.push(child);
  }

  /**
   * Recursively prints the directory and its children with indentation.
   * @param indentLevel The current level of indentation.
   * @param skipSelf Used if the caller doesn't want to see this level
   */
  print(indentLevel: number = 0, skipSelf: boolean = false) {
    if (!skipSelf) {
      const indent = "  ".repeat(indentLevel);
      console.log(`${indent}${this.name}`);
    }

    for (const child of this.children) {
      child.print(indentLevel + 1);
    }
  }

  /**
   * Removes a child directory based on the provided path.
   * @param path The path of the directory to remove.
   * @returns A reference to a deleted child,
   * a string which corresponds to a child path that did not exist,
   * or null following an invalid path
   */
  removeChild(path: Array<string>): Directory | string | null {
    if (!path.length) return null;

    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].name == path[0]) {
        if (path.length === 1) {
          return this.children.splice(i, 1)[0]; // Remove the child
        }
        return this.children[i].removeChild(path.slice(1)); // Continue recursively
      }
    }

    return path[0];
  }
}
