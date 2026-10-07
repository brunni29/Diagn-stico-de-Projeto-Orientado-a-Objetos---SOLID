## Como executar

```bash
npm install
npm start
```

## Como executar os testes

```bash
npm test
```

## Principais refatorações

- Separação da validação do pedido.
- Separação do cálculo de descontos.
- Separação do cálculo de frete.
- Separação do processamento de pagamentos.
- Separação do controle de estoque.
- Separação da construção do resumo do pedido.
- Injeção de dependências no `OrderService`.
- Uso de composição para montar o fluxo de processamento.
- Redução de acesso encadeado às estruturas internas, aplicando o Princípio de Demeter.
- Inclusão de `NotificationService`, ausente no projeto-base enviado.
- Inclusão de testes automatizados.

## Estrutura

```text
src/
├── domain/
├── repositories/
├── services/
└── utils/
test/
└── OrderService.test.js
```
