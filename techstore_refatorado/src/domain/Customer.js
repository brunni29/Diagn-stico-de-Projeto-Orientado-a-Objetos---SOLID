class Customer {
  constructor(id, name, email, phone, type, address) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.type = type;
    this.address = address;
  }

  isEmailValid() {
    return Boolean(this.email && this.email.includes("@"));
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getAddress() {
    return this.address;
  }
}

module.exports = Customer;
