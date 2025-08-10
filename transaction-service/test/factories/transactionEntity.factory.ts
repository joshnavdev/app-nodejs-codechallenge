import { TransactionEntity } from '../../src/transaction/domain/entities/transaction.entity';
import {
  TransactionTypeEntity,
  TransactionTypeEnum,
} from '../../src/transaction/domain/entities/transactionType.entity';
import {
  TransactionStatusEntity,
  TransactionStatusEnum,
} from '../../src/transaction/domain/entities/transactionStatus.entity';

export function createMockTransactionEntity(): TransactionEntity {
  const transactionType = new TransactionTypeEntity(1, TransactionTypeEnum.TRANSFER);
  const transactionStatus = new TransactionStatusEntity(1, TransactionStatusEnum.PENDING);

  return new TransactionEntity(
    'accounting-external-id-debit',
    'accounting-external-id-credit',
    transactionType,
    transactionStatus,
    100.0,
    new Date(),
  );
}
