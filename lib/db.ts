// lib/db.ts
import { db } from './firebase';
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  query, where, orderBy, getDocs, Timestamp 
} from 'firebase/firestore';
import type { Expense } from '@/components/expense-tracker';

// 사용자 ID (인증 구현 전까지는 고정값 사용)
const USER_ID = 'default-user';

// 지출 내역 추가
export async function addExpense(expense: Omit<Expense, 'id'>) {
  try {
    const expensesRef = collection(db, 'users', USER_ID, 'expenses');
    const docRef = await addDoc(expensesRef, {
      ...expense,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...expense };
  } catch (error) {
    console.error('Error adding expense: ', error);
    throw error;
  }
}

// 지출 내역 가져오기
export async function getExpenses() {
  try {
    const expensesRef = collection(db, 'users', USER_ID, 'expenses');
    const q = query(expensesRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const expenses: Expense[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      expenses.push({
        id: doc.id,
        date: data.date,
        title: data.title,
        amount: data.amount
      });
    });
    
    return expenses;
  } catch (error) {
    console.error('Error getting expenses: ', error);
    throw error;
  }
}

// 지출 내역 수정
export async function updateExpense(expense: Expense) {
  try {
    const expenseRef = doc(db, 'users', USER_ID, 'expenses', expense.id);
    await updateDoc(expenseRef, {
      date: expense.date,
      title: expense.title,
      amount: expense.amount,
      updatedAt: Timestamp.now()
    });
    return expense;
  } catch (error) {
    console.error('Error updating expense: ', error);
    throw error;
  }
}

// 지출 내역 삭제
export async function deleteExpense(id: string) {
  try {
    const expenseRef = doc(db, 'users', USER_ID, 'expenses', id);
    await deleteDoc(expenseRef);
    return id;
  } catch (error) {
    console.error('Error deleting expense: ', error);
    throw error;
  }
}