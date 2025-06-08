import TransactionOrmEntity from '../../src/transaction/infrastructure/database/entitties/transactionOrm.entity';
import TransferTypeOrmEntity from '../../src/transaction/infrastructure/database/entitties/transferTypeOrm.entity';
import { TransferTypeEnum } from '../../src/transaction/domain/entities/transferType.entity';
import TransactionTypeOrmEntity from '../../src/transaction/infrastructure/database/entitties/transactionTypeOrm.entity';
import { TransactionTypeEnum } from '../../src/transaction/domain/entities/transactionType.entity';
import TransactionStatusOrmEntity from '../../src/transaction/infrastructure/database/entitties/transactionStatusOrm.entity';
import { TransactionStatusEnum } from '../../src/transaction/domain/entities/transactionStatus.entity';

export function createMockTransactionOrmEntity(): TransactionOrmEntity {
  const transferTypeOrm = new TransferTypeOrmEntity();
  transferTypeOrm.id = 1;
  transferTypeOrm.name = TransferTypeEnum.EXTERNAL;

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
  transactionOrm.transferType = transferTypeOrm;
  transactionOrm.transactionType = transactionTypeOrm;
  transactionOrm.transactionStatus = transactionStatusOrm;
  transactionOrm.amount = 100.0;
  transactionOrm.createdAt = new Date();

  return transactionOrm;
}
