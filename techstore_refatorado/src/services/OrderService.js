class OrderService {
  constructor({ validator, discountCalculator, freightCalculator, paymentProcessor, inventoryService, orderRepository, notificationService, logger, summaryBuilder }) {
    this.validator = validator;
    this.discountCalculator = discountCalculator;
    this.freightCalculator = freightCalculator;
    this.paymentProcessor = paymentProcessor;
    this.inventoryService = inventoryService;
    this.orderRepository = orderRepository;
    this.notificationService = notificationService;
    this.logger = logger;
    this.summaryBuilder = summaryBuilder;
  }

  process(order) {
    this.logger.info(`Iniciando processamento do pedido ${order.id}.`);
    this.validator.validate(order);

    const subtotal = order.getSubtotal();
    const discount = this.discountCalculator.calculate(order);
    const freight = this.freightCalculator.calculate(order);
    const payment = this.paymentProcessor.process(order, subtotal);
    const totalDiscount = discount + payment.discount;

    if (payment.status === "approved") order.markConfirmed();
    else order.markWaitingPayment();

    this.inventoryService.reserve(order);

    const summary = this.summaryBuilder.build(
      order,
      subtotal,
      totalDiscount,
      freight,
      payment.fee
    );

    this.orderRepository.save(summary);

    if (order.status === "confirmed") {
      this.notificationService.sendOrderConfirmation(order.customer, order.id, summary.total);
    } else {
      this.logger.warn(`Pedido ${order.id} aguardando pagamento.`);
    }

    this.logger.info(`Resumo do pedido ${order.id}: ${summary.total.toFixed(2)}.`);
    return summary;
  }
}

module.exports = OrderService;
