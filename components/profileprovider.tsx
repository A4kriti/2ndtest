"use client";

import { createContext, useContext, useEffect, useState } from "react";

// This shares the profile image between pages (Profile page + header)
type ProfileContextType = {
  imageUrl: string;
  setImageUrl: (url: string) => void;
};

const ProfileContext = createContext<ProfileContextType>({
  imageUrl: "",
  setImageUrl: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [imageUrl, setImageUrlState] = useState("");

  // When the app opens, load the saved image link
  useEffect(() => {
    const saved = localStorage.getItem("profile-image");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setImageUrlState(saved);
  }, []);

  // Update the image everywhere and remember it
  function setImageUrl(url: string) {
    setImageUrlState(url);
    localStorage.setItem("profile-image", url);
  }

  return (
    <ProfileContext.Provider value={{ imageUrl, setImageUrl }}>
      {children}
    </ProfileContext.Provider>
  );
}

// Use this in any component: const { imageUrl } = useProfile();
export function useProfile() {
  return useContext(ProfileContext);
}