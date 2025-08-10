import { CreateTransactionDto } from '../../src/transaction/interface/dtos/createTransaction.dto';

export function createMockCreateTransactionDto(): CreateTransactionDto {
  const createTransactionDto = new CreateTransactionDto();
  createTransactionDto.accountExternalIdDebit = '123e4567-e89b-12d3-a456-426614174000';
  createTransactionDto.accountExternalIdCredit = '123e4567-e89b-12d3-a456-426614174001';
  createTransactionDto.transferTypeId = 1;
  createTransactionDto.value = 100.0;

  return createTransactionDto;
}
