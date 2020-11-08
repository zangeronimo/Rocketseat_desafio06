import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let income = 0;
    let outcome = 0;

    const incomes = await this.find({
      where: {
        type: 'income',
      },
    });

    const outcomes = await this.find({
      where: {
        type: 'outcome',
      },
    });

    const incomesValues = incomes.map(item => item.value);
    if (incomesValues.length > 0) {
      income = incomesValues.reduce((total, value) => total + value);
    }

    const outcomesValues = outcomes.map(item => item.value);
    if (outcomesValues.length > 0) {
      outcome = outcomesValues.reduce((total, value) => total + value);
    }

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
