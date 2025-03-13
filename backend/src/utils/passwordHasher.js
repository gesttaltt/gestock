// File: /backend/src/utils/passwordHasher.js

import crypto from "crypto";
import bcrypt from "bcrypt";

let argon2;
try {
  const module = await import("argon2");
  argon2 = module.default;
} catch (e) {
  console.warn("Argon2 module not installed. To use Argon2id, run: npm install argon2");
}

const FIPS_REQUIRED = process.env.FIPS_REQUIRED === "true";

async function hashPassword(password) {
  if (FIPS_REQUIRED) {
    // Use PBKDF2 with HMAC-SHA-256, 600,000 iterations
    const salt = crypto.randomBytes(16);
    const iterations = 600000;
    const keylen = 32;
    const hash = crypto.pbkdf2Sync(password, salt, iterations, keylen, "sha256");
    return {
      hash: hash.toString("hex"),
      salt: salt.toString("hex"),
      method: "pbkdf2",
    };
  } else {
    // Try Argon2id first if available
    if (argon2) {
      try {
        const hash = await argon2.hash(password, {
          type: argon2.argon2id,
          memoryCost: 19 * 1024, // 19MB in KiB
          timeCost: 2,
        });
        return { hash, method: "argon2id" };
      } catch (error) {
        console.warn("Argon2id hashing failed, falling back to scrypt:", error.message);
      }
    }
    // Next, try scrypt (using Node's built-in crypto.scrypt)
    try {
      const salt = crypto.randomBytes(16);
      const keylen = 64;
      return new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, keylen, { cost: 217, blockSize: 8 }, (err, derivedKey) => {
          if (err) return reject(err);
          resolve({
            hash: salt.toString("hex") + ":" + derivedKey.toString("hex"),
            method: "scrypt",
          });
        });
      });
    } catch (error) {
      console.warn("scrypt hashing failed, falling back to bcrypt:", error.message);
    }
    // Finally, fall back to bcrypt with a minimum work factor of 10
    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);
      return { hash, method: "bcrypt" };
    } catch (error) {
      throw new Error("All password hashing algorithms failed: " + error.message);
    }
  }
}

export { hashPassword };
