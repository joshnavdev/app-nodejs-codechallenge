export enum TransferTypeEnum {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  OWN = 'OWN',
}

export default class TransferTypeEntity {
  constructor(
    public readonly id: number,
    public readonly name: TransferTypeEnum,
  ) {}
}
