import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  resumeUploader: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      console.log("=== UPLOADTHING MIDDLEWARE TRIGGERED ===");
      return { debug: true };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("=== UPLOADTHING SERVER ONUPLOADCOMPLETE ===");
      console.log("File Name:", file.name);
      console.log("File URL:", file.url);
      console.log("File Key:", file.key);
      console.log("Metadata:", metadata);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: "user_1", url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
