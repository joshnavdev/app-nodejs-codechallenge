export enum TransactionStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class TransactionStatusEntity {
  constructor(
    public readonly id: number,
    public readonly name: TransactionStatusEnum,
  ) {}
}
