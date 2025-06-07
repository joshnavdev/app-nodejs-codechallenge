export enum TransactionStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export default class TransactionStatusEntity {
  constructor(
    public readonly id: number,
    public readonly name: TransactionStatusEnum,
  ) {}
}
