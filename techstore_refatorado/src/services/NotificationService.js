class NotificationService {
  constructor(logger) {
    this.logger = logger;
  }

  sendOrderConfirmation(customer, orderId, total) {
    this.logger.info(`Notificacao enviada para ${customer.getEmail()} sobre o pedido ${orderId}. Total: R$ ${total.toFixed(2)}.`);
  }
}

module.exports = NotificationService;
