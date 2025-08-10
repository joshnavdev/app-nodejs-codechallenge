export class AppError extends Error {
  statusCode: number;
  type: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.type = 'BusinessException';
  }
}
