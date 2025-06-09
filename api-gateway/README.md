# API Gateway (REST)

## Description

This service was created exclusively for demonstration purposes to showcase RESTful API development using the NestJS
framework. Unlike the GraphQL Gateway, this API Gateway exposes traditional HTTP endpoints to interact with the backend
transaction service via Kafka.

It is not required for the core functionality of the system, but demonstrates how the same microservices can be exposed
via REST instead of GraphQL.

## Features

- Exposes RESTful API endpoints for:
    - Creating a new transaction.
    - Retrieving transaction details by ID.
- Sends events via `Kafka` to other services.
- Handles asynchronous communication using Kafka's request-response pattern.

## Tech Stack

- **Node.js** - using the NestJS framework
- **Express.js** - used internally by Nest for REST endpoints
- **Kafka** - for event-driven communication
- **Jest** - for unit testing

## REST Endpoints

### POST `/transactions`

Creates a new transaction by sending a Kafka event.

#### Request Body:

```json
{
  "accountExternalIdDebit": "28dbd0c5-4ea0-4d05-8fd9-39e8f76aaf13",
  "accountExternalIdCredit": "d6cd54da-8ce3-4f79-abda-bd5be9b19e68",
  "transferTypeId": 1,
  "value": 1000
}
```

#### Response Example:

```json
{
  "transactionExternalId": "11c954f6-c6bd-4ea5-937a-76954c686d56",
  "transactionType": {
    "name": "TRANSFER"
  },
  "transactionStatus": {
    "name": "PENDING"
  },
  "value": 1000,
  "createdAt": "2025-06-09T01:46:41.021Z"
}
```

### GET `/transactions/:transactionId`

Retrieves transaction details by ID by sending a Kafka event.

#### Path Parameter:

```plaintext
transactionId: UUID of the transaction to retrieve
```

#### Response Example:

```json
{
  "transactionType": {
    "name": "TRANSFER"
  },
  "transactionStatus": {
    "name": "APPROVED"
  },
  "createdAt": "2025-06-09T01:46:41.021Z",
  "transactionExternalId": "11c954f6-c6bd-4ea5-937a-76954c686d56",
  "value": "1000.00"
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

## Running Tests

To execute the test suite:

```bash
yarn test
```

## Notes

- This gateway is not required by the core system but demonstrates how the same microservices can be consumed using REST
  instead of GraphQL.
- Designed following NestJS best practices and modular architecture.
