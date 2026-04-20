"use client";
import { Suspense } from 'react';
import Shop from '@/components/shop-sidebar/Shop';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb';
import Spinner from '@/components/button/Spinner';

const page = () => {
  return (
    <>
      <Breadcrumb title={"Boutique"} />
      <section className="gi-shop">
        <div className="container">
          <Suspense fallback={<Spinner />}>
            <Shop
              order={"order-lg-last order-md-first"}
              lg={9}
              xl={4}
            />
          </Suspense>
        </div>
      </section>
    </>
  )
}

export default page;
