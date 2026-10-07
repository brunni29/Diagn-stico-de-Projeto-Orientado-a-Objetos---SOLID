class OrderSummaryBuilder {
  build(order, subtotal, discount, freight, paymentFee) {
    const total = Number((subtotal - discount + freight + paymentFee).toFixed(2));
    if (total <= 0) {
      throw new Error("Total do pedido invalido.");
    }

    return {
      id: order.id,
      customerName: order.customer.getName(),
      customerEmail: order.customer.getEmail(),
      city: order.customer.getAddress().city,
      state: order.customer.getAddress().state,
      items: order.items.map((item) => ({
        productId: item.getProductId(),
        name: item.getProductName(),
        quantity: item.getQuantity(),
        subtotal: item.getSubtotal()
      })),
      subtotal,
      discount: Number(discount.toFixed(2)),
      freight: Number(freight.toFixed(2)),
      paymentFee: Number(paymentFee.toFixed(2)),
      total,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt
    };
  }
}

module.exports = OrderSummaryBuilder;
