"use client";

import * as LR from "@uploadcare/blocks";
import { PACKAGE_VERSION } from "@uploadcare/blocks";
import { useEffect, useRef, useContext } from "react";
import { UPLOAD_CARE_KEY } from "@/lib/utils";
import { Context } from "@/context";

LR.registerBlocks(LR);

function ImageUpload() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("ImageUpload must be used within a Context Provider");
  }
  const { setImage } = context;
  const ctxProviderRef = useRef<any>(null);

  useEffect(() => {
    const ctxProvider = ctxProviderRef.current;
    if (!ctxProvider) return;

    const handleChangeEvent = (event: UploadEvent) => {
      const successFiles = event.detail.allEntries.filter(
        (file: UploadFile) => file.status === "success"
      );
      const imageUrls = successFiles.map((file) => file.url);
      setImage(imageUrls[0] || ""); // Set the first image URL or empty string
    };

    ctxProvider.addEventListener("change", handleChangeEvent);

    return () => {
      ctxProvider.removeEventListener("change", handleChangeEvent);
    };
  }, [setImage]);

  return (
    <div>
      <lr-config
        ctx-name="my-uploader"
        pubkey={UPLOAD_CARE_KEY}
        maxLocalFileSizeBytes={10000000}
        imgOnly={true}
        multiple={false}
        sourceList="local, url, camera, gdrive"
      />
      <lr-file-uploader-regular
        ctx-name="my-uploader"
        css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@${PACKAGE_VERSION}/web/lr-file-uploader-regular.min.css`}
      />
      <lr-upload-ctx-provider ref={ctxProviderRef} ctx-name="my-uploader" />
    </div>
  );
}

export default ImageUpload;

interface UploadFile {
  status: string;
  uuid: string;
  url: string;
}

interface UploadEvent {
  detail: {
    allEntries: UploadFile[];
  };
}
