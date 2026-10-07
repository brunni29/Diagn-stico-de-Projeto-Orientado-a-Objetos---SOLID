class InventoryService {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  reserve(order) {
    for (const item of order.items) {
      this.productRepository.updateStock(item.getProductId(), item.getQuantity());
    }
  }
}

module.exports = InventoryService;
