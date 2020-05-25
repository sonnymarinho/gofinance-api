import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

const transactionsTypes = ['income', 'outcome'];

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category = 'Without Category 📎',
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    // Verifying outcome creation withow a valid balance
    if (type === 'outcome' && value > total) {
      throw new AppError('Outcome value exceeds balance.', 400);
    }

    // * Verifying if type is valid
    if (!transactionsTypes.includes(type)) {
      throw new AppError('Transaction type invalid', 400);
    }

    // * Creating the category ->

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    //    - if not exists
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
