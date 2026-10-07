const Address = require("./domain/Address");
const Customer = require("./domain/Customer");
const Order = require("./domain/Order");
const OrderItem = require("./domain/OrderItem");
const ProductRepository = require("./repositories/ProductRepository");
const OrderRepository = require("./repositories/OrderRepository");
const OrderService = require("./services/OrderService");
const OrderValidator = require("./services/OrderValidator");
const DiscountCalculator = require("./services/DiscountCalculator");
const FreightCalculator = require("./services/FreightCalculator");
const PaymentProcessor = require("./services/PaymentProcessor");
const InventoryService = require("./services/InventoryService");
const NotificationService = require("./services/NotificationService");
const OrderSummaryBuilder = require("./services/OrderSummaryBuilder");
const Logger = require("./utils/Logger");

function createOrderService() {
  const productRepository = new ProductRepository();
  const logger = new Logger();

  return new OrderService({
    validator: new OrderValidator(productRepository),
    discountCalculator: new DiscountCalculator(),
    freightCalculator: new FreightCalculator(),
    paymentProcessor: new PaymentProcessor(),
    inventoryService: new InventoryService(productRepository),
    orderRepository: new OrderRepository(),
    notificationService: new NotificationService(logger),
    logger,
    summaryBuilder: new OrderSummaryBuilder()
  });
}

const customer = new Customer(
  "c1",
  "Ana Souza",
  "ana.souza@example.com",
  "18999990000",
  "vip",
  new Address("Rua das Palmeiras", "120", "Presidente Prudente", "SP", "19000-000", "sudeste")
);

const productRepository = new ProductRepository();
const notebook = productRepository.findById("p1");
const mouse = productRepository.findById("p2");

const order = new Order(
  "o1001",
  customer,
  [new OrderItem(notebook, 1), new OrderItem(mouse, 2)],
  "TECH10",
  "credit_card",
  3
);

const service = createOrderService();
const result = service.process(order);

console.log(JSON.stringify(result, null, 2));

module.exports = { createOrderService };
