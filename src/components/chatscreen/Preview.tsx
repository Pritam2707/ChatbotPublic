import React from "react";
export default function Preview({ fileUrl, type }: {
  fileUrl: string,
  type: string
}) {
  return (
    <div className="max-h-full max-h-full flex justify-center items-center">
      {type.includes("image") ? (
        <img src={fileUrl} className="w-full h-full" alt="Preview" />
      ) : (
        <p className="text-white">File type not supported</p>
      )}
    </div>
  );
}
