"use client";

import { useState } from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import { useProfile } from "@/components/profileprovider";
import "@uploadcare/react-uploader/core.css";

export default function ProfilePage() {
  // imageUrl = the SAVED image (what the header shows)
  const { imageUrl, setImageUrl } = useProfile();

  // draftUrl = the new image after upload, but NOT saved yet
  const [draftUrl, setDraftUrl] = useState("");
  const [name, setName] = useState("");

  // Show the new image if there is one, otherwise the saved image
  const previewUrl = draftUrl || imageUrl;

  function handleSave() {
    // Only now the header image changes
    if (draftUrl) {
      setImageUrl(draftUrl);
      setDraftUrl("");
    }

    console.log("Name:", name);
    alert("Profile saved!");
  }

  return (
    <div className="m-4 max-w-lg rounded-xl border bg-white p-5">
      <h1 className="mb-4 text-xl font-bold">My Profile</h1>

      <div className="mb-4 flex flex-col items-center gap-4 sm:flex-row">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Profile Picture"
            className="h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
            No Image
          </div>
        )}

        <FileUploaderRegular
          pubkey={
            process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY ||
            "demopublickey"
          }
          multiple={false}
          imgOnly
          onFileUploadSuccess={(file) => {
            setDraftUrl(file.cdnUrl); // preview only, header does NOT change yet
          }}
        />
      </div>

      {draftUrl && (
        <p className="mb-4 text-sm text-gray-500">
          Yahoo uploadcare milao..... lallalllaa.....
        </p>
      )}

      

      <button
        onClick={handleSave}
        className="h-11 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700"
      >
        Save Profile
      </button>
    </div>
  );
}