// Calculate cart totals including product and first-order discounts
export const calculateCartTotals = (
  cartProducts: any[],
  isFirstOrder: boolean
) => {
  const subtotal = cartProducts.reduce((total, item) => {
    const price = item.product?.unit_price ?? 0

    return total + price * item.quantity
  }, 0)

  // Discount from product sale prices
  const productDiscount = cartProducts.reduce((total, item) => {
    const unitPrice = item.product?.unit_price ?? 0
    const discountPrice =
      item.product?.discount_price ?? unitPrice

    return (
      total +
      (unitPrice - discountPrice) * item.quantity
    )
  }, 0)

  // 20% first-order discount after product discount
  const saleTotal = subtotal - productDiscount

  const firstOrderDiscount = isFirstOrder
    ? saleTotal * 0.2
    : 0

  const discount =
    productDiscount + firstOrderDiscount

  // Free delivery for orders of 500 or more
  const deliveryFee = subtotal >= 500 ? 0 : 25

  const total =
    subtotal - discount + deliveryFee

return {
  subtotal,
  discount,
  productDiscount,
  firstOrderDiscount,
  deliveryFee,
  total,
}
}