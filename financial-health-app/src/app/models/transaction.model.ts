export interface Transaction {
  id: string; // or number, using string for potential UUIDs
  date: Date;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}
