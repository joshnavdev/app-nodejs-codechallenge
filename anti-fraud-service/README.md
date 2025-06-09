# Anti-Fraude Service

## Description

The Anti-Fraud Service is responsible for validating financial transactions based on predefined business rules. It is
part of a distributed, event-driven architecture and communicates asynchronously with other services using Kafka.

## Features

- Listen for `transaction_created` events to validate transactions.
- Applies anti-fraud validates logic (e.g., rejecting transaction over a certain threshold).
- Emits either `approve_transaction` or `reject_transaction` events based on validation results.

## Tech Stack

- Node.js - using the NestJS framework
- Kafka - for event-driven communication
- Jest - for unit testing

## Validation Rules

- Transactions with a `value > 1000` are automatically **rejected**.
- All other transactions are **approved**.

## Kafka Topics

- **Produces:**
    - `approve_transaction` - emitted to update the status of a transaction to `APPROVED`.
    - `reject_transaction` - emitted to update the status of a transaction to `REJECTED`.
- **Consumes**:
    - `transaction_created` - Received when a new transaction is created, to validate it.

## Environment Variables

| Variable                   | Description                  |
|----------------------------|------------------------------|
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

## Running Tests

To execute the test suite:

```bash
yarn test
```

test 4
