// preinstall.js
import { execSync } from "child_process";

if (process.platform === "win32") {
  console.log("Windows detected. Installing Windows-specific Tailwind package...");
  execSync("npm install @tailwindcss/oxide-win32-x64-msvc@^4.0.14", { stdio: "inherit" });
} else if (process.platform === "linux") {
  console.log("Linux detected. Installing Linux-specific Tailwind packages...");
  execSync("npm install @tailwindcss/oxide-linux-x64-gnu@^4.0.14 lightningcss-linux-x64-gnu@^1.29.1", { stdio: "inherit" });
} else {
  console.log("No OS-specific installation needed.");
}
