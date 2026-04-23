import { auth } from "@/backend/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  resumeUploader: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req: _req }) => {
      const session = await auth();
      if (!session) throw new UploadThingError("Unauthorized");
      // Return userId so client callback can use it
      return { userId: (session.user as any).id ?? "unknown" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // NOTE: This callback is called by UploadThing's servers as a webhook.
      // In local dev (localhost), UT servers cannot reach your machine, so this
      // may fail — that is expected. The file IS uploaded successfully.
      // The client receives the URL via onClientUploadComplete instead.
      console.log("[UploadThing] Upload complete for userId:", metadata.userId);
      console.log("[UploadThing] File URL:", file.ufsUrl ?? file.url);

      // Return url to client's onClientUploadComplete
      return { uploadedBy: metadata.userId, url: file.ufsUrl ?? file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
