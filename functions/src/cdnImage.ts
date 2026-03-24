import { onRequest } from "firebase-functions/v2/https";
import { getStorage } from "firebase-admin/storage";

/**
 * Proxies files from Storage through Firebase Hosting CDN.
 * URL: /cdn/{projectKey}/images/{memoryId}/{file}
 *      /cdn/{projectKey}/audio/{memoryId}/{file}
 * Maps to storage: project/{projectKey}/images/... or project/{projectKey}/audio/...
 * Hosting CDN caches the response (1 year, immutable — filenames are timestamped).
 */
export const cdnImage = onRequest(
  { cors: true, memory: "256MiB" },
  async (req, res) => {
    if (req.method !== "GET") {
      res.status(405).send("Method not allowed");
      return;
    }

    const path = req.path.replace(/^\/cdn\//, "");
    if (!path || path.includes("..")) {
      res.status(400).send("Invalid path");
      return;
    }

    const storagePath = `project/${path}`;
    const bucket = getStorage().bucket();
    const file = bucket.file(storagePath);

    try {
      const [exists] = await file.exists();
      if (!exists) {
        res.status(404).send("Not found");
        return;
      }

      const [metadata] = await file.getMetadata();
      const contentType = metadata.contentType || "application/octet-stream";

      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.set("Content-Type", contentType);

      const stream = file.createReadStream();
      stream.pipe(res);
      stream.on("error", () => {
        if (!res.headersSent) {
          res.status(500).send("Stream error");
        }
      });
    } catch {
      res.status(500).send("Internal error");
    }
  }
);
