import { TransactionOrmEntity } from '../../src/transaction/infrastructure/database/entities/transactionOrm.entity';
import { TransactionTypeOrmEntity } from '../../src/transaction/infrastructure/database/entities/transactionTypeOrm.entity';
import { TransactionTypeEnum } from '../../src/transaction/domain/entities/transactionType.entity';
import { TransactionStatusOrmEntity } from '../../src/transaction/infrastructure/database/entities/transactionStatusOrm.entity';
import { TransactionStatusEnum } from '../../src/transaction/domain/entities/transactionStatus.entity';

export function createMockTransactionOrmEntity(): TransactionOrmEntity {
  const transactionTypeOrm = new TransactionTypeOrmEntity();
  transactionTypeOrm.id = 1;
  transactionTypeOrm.name = TransactionTypeEnum.TRANSFER;

  const transactionStatusOrm = new TransactionStatusOrmEntity();
  transactionStatusOrm.id = 1;
  transactionStatusOrm.name = TransactionStatusEnum.PENDING;

  const transactionOrm = new TransactionOrmEntity();
  transactionOrm.id = 'transaction-id';
  transactionOrm.accountingExternalIdDebit = 'accounting-external-id-debit';
  transactionOrm.accountingExternalIdCredit = 'accounting-external-id-credit';
  transactionOrm.transactionType = transactionTypeOrm;
  transactionOrm.transactionStatus = transactionStatusOrm;
  transactionOrm.amount = 100.0;
  transactionOrm.createdAt = new Date();

  return transactionOrm;
}
