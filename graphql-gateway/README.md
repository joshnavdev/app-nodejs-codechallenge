# GraphQL API Gateway

## Description

The GraphQL Gateway acts as the unified entry point for client applications to interact with backend services. It
exposes a GraphQL API and communicates with internal microservices—such as the Transaction Service—via Kafka. This
gateway decouples the frontend from the backend logic while enabling an efficient, flexible querying interface.

## Features

- Exposes a GraphQL API for client applications.
- Emit a `transaction_create` event to Kafka when on create transaction mutation.
- Emit a `transaction_get_by_id` event to Kafka when on get transaction query.
- Waits for responses from other services using Kafka request-response pattern.
- Supports UUID-based queries for fetching transaction details.
- Uses Redis for caching transaction data to improve performance.

## Tech Stack

- Node.js - using the NestJS framework
- GraphQL - as the API layer
- Kafka - for event-driven communication
- Jest - for unit testing
- Apollo Server - for GraphQL server implementation
- Redis - for caching transaction data

## GraphQL Endpoints

### Create Transaction Mutation

```graphql
mutation createTransaction($createTransactionInput: CreateTransactionInput!) {
  createTransaction(createTransactionData: $createTransactionInput) {
    transactionExternalId
    transactionStatus { id name }
    transactionType { id name }
    transferType { id name }
    value
    createdAt
  }
}
```

**Sample variables:**

```json
{
  "createTransactionInput": {
    "accountExternalIdDebit": "28dbd0c5-4ea0-4d05-8fd9-39e8f76aaf13",
    "accountExternalIdCredit": "d6cd54da-8ce3-4f79-abda-bd5be9b19e68",
    "transferTypeId": 1,
    "value": 1000
  }
}
```

### Get Transaction Query

```graphql
query getTransaction($transactionId: UUID!) {
  getTransaction(id: $transactionId) {
    transactionExternalId
    transactionStatus { id name }
    transactionType { id name }
    transferType { id name }
    value
    createdAt
  }
}
```

**Sample variables:**

```json
{
  "transactionId": "28dbd0c5-4ea0-4d05-8fd9-39e8f76aaf13"
}
```

## Kafka Topics

- **Produces:**
    - `transaction_create`: Emitted when a new transaction request is made.
    - `transaction_get_by_id`: Emitted when a transaction retrieval request is made.

## Environment Variables

| Variable                   | Description                  |
|----------------------------|------------------------------|
| `PORT`                     | Application port             |
| `KAFKA_BROKER_0`           | Kafka broker address         |
| `KAFKA_CLIENT_ID_CONSUMER` | Kafka client ID for consumer |
| `KAFKA_CLIENT_ID_PRODUCER` | Kafka client ID for producer |
| `KAFKA_GROUP_ID`           | Kafka consumer group ID      |

## Running the Service

To run the service in **development** mode:

```bash
yarn start:dev
```

To run the service in **production** mode:

```bash
yarn start:prod
```

## Accessing the API

After starting the service, the GraphQL playground will be available
at [http://localhost:3005/graphql](http://localhost:3005/graphql). You can use this interface to test the GraphQL
queries and mutations.

## Running Tests

To execute the test suite:

```bash
yarn test
```
