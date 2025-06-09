# Transaction Service

## Description
This service is responsible for managing financial transactions within the system. It is part of a microservices-based architecture and communicates asynchronously with other services, such as the Anti-Fraud Service, using Kafka.

## Overview
- Creates transactions with an initial status of `PENDING`.
- Emits a `transaction_created` event to `Kafka` upon transaction creation.
- Listens to `approve_transaction` and `reject_transaction` events to update the status of transactions.
- Listens to `transaction_get_by_id` event to retrieve transaction details by ID.

## Tech Stack
- Node.js - using the NestJS framework
- ProstgreSQL - with TypeORM as ORM
- Kafka - for event-driven communication
- Jest - for unit testing

## Kafka Topics
- **Produces:**
  - `transaction_created`: Published after a new transaction is saved.
- **Consumes**:
  - `approve_transaction`: Consumed to update the status of a transaction to `APPROVED`.
  - `reject_transaction`: Consumed to update the status of a transaction to `REJECTED`.
  - `transaction_get_by_id`: Consumed to retrieve a transaction by its ID.


## Environment Variables
| Variable                   | Description                  |
| -------------------------- | ---------------------------- |
| `PORT`                     | Application port             |
| `DB_HOST`                  | Database host                |
| `DB_PORT`                  | Database port                |
| `DB_USER`                  | Database user                |
| `DB_PASS`                  | Database password            |
| `DB_NAME`                  | Database name                |
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
