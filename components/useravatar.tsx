"use client";

import { useProfile } from "@/components/profileprovider";

export default function UserAvatar({ name }: { name?: string }) {
  const { imageUrl } = useProfile();

  if (!imageUrl) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-bold text-blue-600">
        {name ? name[0].toUpperCase() : "U"}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${imageUrl}-/scale_crop/80x80/smart/`}
      alt="Profile"
      className="h-10 w-10 rounded-full object-cover"
    />
  );
}