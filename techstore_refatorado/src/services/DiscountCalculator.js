class DiscountCalculator {
  calculate(order) {
    const subtotal = order.getSubtotal();
    let discount = 0;
    const customerType = order.customer.type;

    if (customerType === "vip") discount += subtotal * 0.08;
    if (customerType === "employee") discount += subtotal * 0.15;
    if (order.couponCode === "TECH10") discount += subtotal * 0.1;
    if (subtotal > 8000) discount += 250;

    return discount;
  }
}

module.exports = DiscountCalculator;
