class FreightCalculator {
  constructor(rates) {
    this.rates = rates || {
      "sudeste": { base: 20, perWeight: 4 },
      "sul": { base: 28, perWeight: 5 },
      "centro-oeste": { base: 35, perWeight: 6 },
      "nordeste": { base: 45, perWeight: 7 },
      "norte": { base: 60, perWeight: 9 },
      default: { base: 50, perWeight: 8 }
    };
  }

  calculate(order) {
    if (order.couponCode === "FRETEGRATIS") return 0;

    const region = order.customer.getAddress().region;
    const rate = this.rates[region] || this.rates.default;
    return rate.base + order.getTotalWeight() * rate.perWeight;
  }
}

module.exports = FreightCalculator;
