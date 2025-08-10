import AppDataSource from './data-source';
import { TransactionTypeEnum } from '../src/transaction/domain/entities/transactionType.entity';
import { TransactionStatusEnum } from '../src/transaction/domain/entities/transactionStatus.entity';
import { TransactionTypeOrmEntity } from '../src/transaction/infrastructure/database/entities/transactionTypeOrm.entity';
import { TransactionStatusOrmEntity } from '../src/transaction/infrastructure/database/entities/transactionStatusOrm.entity';

async function seed() {
  const dataSource = await AppDataSource.initialize();

  const trxTypeRepo = dataSource.getRepository(TransactionTypeOrmEntity);
  const trxStatusRepo = dataSource.getRepository(TransactionStatusOrmEntity);

  await trxTypeRepo.save([
    { id: 1, name: TransactionTypeEnum.TRANSFER },
    { id: 2, name: TransactionTypeEnum.PAYMENT },
  ]);

  await trxStatusRepo.save([
    { id: 1, name: TransactionStatusEnum.PENDING },
    { id: 2, name: TransactionStatusEnum.APPROVED },
    { id: 3, name: TransactionStatusEnum.REJECTED },
  ]);

  console.log('Seeding complete!');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
