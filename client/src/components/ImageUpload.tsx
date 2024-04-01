"use client";

import * as LR from "@uploadcare/blocks";
import { PACKAGE_VERSION } from "@uploadcare/blocks";
import { useEffect, useRef, useContext } from "react";
import { UPLOAD_CARE_KEY } from "@/lib/utils";
import { Context } from "@/context";

LR.registerBlocks(LR);

function ImageUpload() {
  const { setImage } = useContext(Context);
  const ctxProviderRef = useRef(null);

  useEffect(() => {
    const ctxProvider: any = ctxProviderRef.current;
    if (!ctxProvider) return;

    const handleChangeEvent = (event: any) => {
      setImage([
        ...event.detail.allEntries.filter(
          (file: any) => file.status === "success"
        ),
      ]);
    };

    ctxProvider.addEventListener("change", handleChangeEvent);

    return () => {
      ctxProvider.removeEventListener("change", handleChangeEvent);
    };
  }, []);

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
