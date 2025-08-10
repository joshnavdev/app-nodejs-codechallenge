export default class TransactionDto {
  constructor(
    public readonly id: string,
    public readonly amount: number,
  ) {}
}
