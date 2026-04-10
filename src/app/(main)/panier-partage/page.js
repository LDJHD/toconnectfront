import CartPreview from '@/components/cart/CartPreview'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb'

const page = () => {
  return (
    <>
      <Breadcrumb title={"Aperçu du panier"} />
      <CartPreview />
    </>
  )
}

export default page
