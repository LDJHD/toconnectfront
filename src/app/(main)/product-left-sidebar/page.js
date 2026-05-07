"use client"

import { Suspense } from 'react'
import { Row } from 'react-bootstrap'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'
import ProductPage from '@/components/product-page/ProductPage'

const page = () => {
    return (
        <>
            <Breadcrumb title={"Détail produit"} />
            <section className="gi-single-product padding-tb-40">
                <div className="container">
                    <Row>
                        <Suspense fallback={<div>Chargement...</div>}>
                            <ProductPage
                                order={"order-lg-last order-md-first"}
                                lg={12}
                            />
                        </Suspense>
                    </Row>
                </div>
            </section>
        </>
    )
}

export default page
