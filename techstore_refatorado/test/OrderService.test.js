const test = require("node:test");
const assert = require("node:assert/strict");
const Address = require("../src/domain/Address");
const Customer = require("../src/domain/Customer");
const Order = require("../src/domain/Order");
const OrderItem = require("../src/domain/OrderItem");
const Product = require("../src/domain/Product");
const ProductRepository = require("../src/repositories/ProductRepository");
const OrderRepository = require("../src/repositories/OrderRepository");
const OrderService = require("../src/services/OrderService");
const OrderValidator = require("../src/services/OrderValidator");
const DiscountCalculator = require("../src/services/DiscountCalculator");
const FreightCalculator = require("../src/services/FreightCalculator");
const PaymentProcessor = require("../src/services/PaymentProcessor");
const InventoryService = require("../src/services/InventoryService");
const OrderSummaryBuilder = require("../src/services/OrderSummaryBuilder");

function silentLogger() {
  return { info() {}, warn() {}, error() {} };
}

function createService(products) {
  const productRepository = new ProductRepository(products);
  return new OrderService({
    validator: new OrderValidator(productRepository),
    discountCalculator: new DiscountCalculator(),
    freightCalculator: new FreightCalculator(),
    paymentProcessor: new PaymentProcessor(),
    inventoryService: new InventoryService(productRepository),
    orderRepository: new OrderRepository(),
    notificationService: { sendOrderConfirmation() {} },
    logger: silentLogger(),
    summaryBuilder: new OrderSummaryBuilder()
  });
}

function createCustomer(type = "vip", region = "sudeste") {
  return new Customer(
    "c1", "Ana Souza", "ana@example.com", "18999990000", type,
    new Address("Rua A", "10", "Presidente Prudente", "SP", "19000-000", region)
  );
}

test("processa pedido com desconto, frete, taxa e atualizacao de estoque", () => {
  const notebook = new Product("p1", "Notebook", "notebook", 6200, 2.1, 8);
  const mouse = new Product("p2", "Mouse", "peripheral", 120, 0.2, 30);
  const service = createService([notebook, mouse]);
  const order = new Order("o1", createCustomer(), [new OrderItem(notebook, 1), new OrderItem(mouse, 2)], "TECH10", "credit_card", 3);

  const result = service.process(order);

  assert.equal(result.subtotal, 6440);
  assert.equal(result.discount, 1159.2);
  assert.equal(result.freight, 30);
  assert.equal(result.paymentFee, 161);
  assert.equal(result.total, 5471.8);
  assert.equal(result.status, "confirmed");
  assert.equal(notebook.stock, 7);
  assert.equal(mouse.stock, 28);
});

test("mantem pedido aguardando pagamento para boleto", () => {
  const product = new Product("p1", "Notebook", "notebook", 6200, 2.1, 8);
  const service = createService([product]);
  const order = new Order("o2", createCustomer(), [new OrderItem(product, 1)], null, "boleto", 1);

  const result = service.process(order);

  assert.equal(result.status, "waiting_payment");
  assert.equal(product.stock, 7);
});

test("aplica frete gratis quando o cupom FRETEGRATIS e usado", () => {
  const product = new Product("p1", "Notebook", "notebook", 6200, 2.1, 8);
  const service = createService([product]);
  const order = new Order("o3", createCustomer("normal", "norte"), [new OrderItem(product, 1)], "FRETEGRATIS", "pix", 1);

  const result = service.process(order);

  assert.equal(result.freight, 0);
});

test("rejeita quantidade invalida", () => {
  const product = new Product("p1", "Notebook", "notebook", 6200, 2.1, 8);
  const service = createService([product]);
  const order = new Order("o4", createCustomer(), [new OrderItem(product, 0)], null, "pix", 1);

  assert.throws(() => service.process(order), /Quantidade invalida/);
});

test("rejeita pagamento desconhecido", () => {
  const product = new Product("p1", "Notebook", "notebook", 6200, 2.1, 8);
  const service = createService([product]);
  const order = new Order("o5", createCustomer(), [new OrderItem(product, 1)], null, "cartao_desconhecido", 1);

  assert.throws(() => service.process(order), /Forma de pagamento invalida/);
});
