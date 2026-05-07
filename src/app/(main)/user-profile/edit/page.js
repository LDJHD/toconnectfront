"use client";

import ProfileEdit from "@/components/profile-Edit/ProfileEdit";
import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default function Page() {
  return (
    <>
      <Breadcrumb title={"Edit Profile"} />
      <ProfileEdit />
    </>
  );
}
