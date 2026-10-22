"use client";

import Services from "@/components/service/Services";
import Trending from "@/components/trending/Trending";
import HeroStreaming from "@/components/hero/HeroStreaming";
import SubscriptionPlans from "@/components/subscriptions/SubscriptionPlans";
import FeaturedProducts from "@/components/arrivals/FeaturedProducts";
import CtaBanner from "@/components/banner/CtaBanner";

const page = () => {
    return (
        <>
            <HeroStreaming />
            <SubscriptionPlans />
            <CtaBanner />
            <FeaturedProducts />
            <Services />
            <Trending />
        </>
    )
}

export default page
