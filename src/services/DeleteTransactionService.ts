import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id);

    // * Verifying if transaction exists
    if (!transaction) {
      throw new AppError('Transaction does not exists', 400);
    }

    // * Deleting transaction
    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
