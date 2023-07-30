import { OurFileRouter, ourFileRouter } from "@/app/api/uploadthing/core";
import { generateReactHelpers } from "@uploadthing/react/hooks";

export const { uploadFiles } = generateReactHelpers<OurFileRouter>();
