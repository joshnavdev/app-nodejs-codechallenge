import AppDataSource from './data-source';
import TransactionTypeOrmEntity from '../src/transaction/infrastructure/database/entitties/transactionTypeOrm.entity';
import TransactionStatusOrmEntity from '../src/transaction/infrastructure/database/entitties/transactionStatusOrm.entity';
import TransferTypeOrmEntity from '../src/transaction/infrastructure/database/entitties/transferTypeOrm.entity';
import { TransactionTypeEnum } from '../src/transaction/domain/entities/transactionType.entity';
import { TransactionStatusEnum } from '../src/transaction/domain/entities/transactionStatus.entity';
import { TransferTypeEnum } from '../src/transaction/domain/entities/transferType.entity';

async function seed() {
  const dataSource = await AppDataSource.initialize();

  const trxTypeRepo = dataSource.getRepository(TransactionTypeOrmEntity);
  const trxStatusRepo = dataSource.getRepository(TransactionStatusOrmEntity);
  const transferTypeRepo = dataSource.getRepository(TransferTypeOrmEntity);

  await trxTypeRepo.save([
    { id: 1, name: TransactionTypeEnum.TRANSFER },
    { id: 2, name: TransactionTypeEnum.PAYMENT },
  ]);

  await trxStatusRepo.save([
    { id: 1, name: TransactionStatusEnum.PENDING },
    { id: 2, name: TransactionStatusEnum.APPROVED },
    { id: 3, name: TransactionStatusEnum.REJECTED },
  ]);

  await transferTypeRepo.save([
    { id: 1, name: TransferTypeEnum.INTERNAL },
    { id: 2, name: TransferTypeEnum.EXTERNAL },
  ]);

  console.log('Seeding complete!');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
