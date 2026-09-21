import crypto from "crypto";
import { promisify } from "util";
import { siteConfig } from "@/lib/config";

const pbkdf2 = promisify(crypto.pbkdf2);
const baseUrl = siteConfig.webUrl;

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await pbkdf2(password, salt, 1000, 64, "sha512");
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, key] = hash.split(":");
  const derivedKey = await pbkdf2(password, salt, 1000, 64, "sha512");
  return key === derivedKey.toString("hex");
}

export function generateSlug(name: string) {
  const baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const randomId = crypto.randomBytes(3).toString("hex"); // 6 chars

  return `${baseSlug}-${randomId}`;
}

export function getShareUrl(slug: string) {
  return `${baseUrl}/item/${slug}`;
}