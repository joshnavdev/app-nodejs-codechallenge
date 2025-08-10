export enum TransactionTypeEnum {
  TRANSFER = 'TRANSFER',
  WITHDRAWAL = 'WITHDRAWAL',
  DEPOSIT = 'DEPOSIT',
  PAYMENT = 'PAYMENT',
}

export class TransactionTypeEntity {
  constructor(
    public readonly id: number,
    public readonly name: TransactionTypeEnum,
  ) {}
}
