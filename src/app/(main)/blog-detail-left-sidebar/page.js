"use client";

import Breadcrumb from "@/components/breadcrumb/Breadcrumb";

export default function Page() {
  return (
    <>
      <Breadcrumb title={"Blog"} />
      <section className="padding-tb-40">
        <div className="container">
          <p>Article indisponible pour le moment.</p>
        </div>
      </section>
    </>
  );
}
