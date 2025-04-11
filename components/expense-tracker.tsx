// components/expense-tracker.tsx
"use client"

import { useState, useEffect } from "react"
import { ExpenseList } from "./expense-list"
import { ExpenseSummary } from "./expense-summary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuickExpense } from "./quick-expense"
import { addExpense, getExpenses, updateExpense, deleteExpense } from "@/lib/db"
import { 
  collection, addDoc, updateDoc, deleteDoc, doc, 
  query, orderBy, getDocs, Timestamp 
} from 'firebase/firestore';

export type Expense = {
  id: string
  date: string
  title: string
  amount: number
}

export type TimeFrame = "daily" | "weekly" | "monthly"

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  // Firebase에서 지출 내역 가져오기
  useEffect(() => {
    async function fetchExpenses() {
      try {
        setLoading(true)
        const data = await getExpenses()
        setExpenses(data)
      } catch (error) {
        console.error("Failed to fetch expenses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  // 지출 내역 추가
  const handleAddExpense = async (expense: Omit<Expense, "id">) => {
    try {
      const newExpense = await addExpense(expense)
      setExpenses((prev) => [...prev, newExpense])
    } catch (error) {
      console.error("Failed to add expense:", error)
    }
  }

  // 지출 내역 삭제
  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id)
      setExpenses((prev) => prev.filter((expense) => expense.id !== id))
    } catch (error) {
      console.error("Failed to delete expense:", error)
    }
  }

  // 지출 내역 수정
  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      await updateExpense(updatedExpense)
      setExpenses((prev) => 
        prev.map((expense) => 
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      )
    } catch (error) {
      console.error("Failed to update expense:", error)
    }
  }

  return (
    <div className="container max-w-md mx-auto px-4 pb-20">
      <header className="sticky top-0 z-10 bg-background pt-4 pb-2">
        <h1 className="text-2xl font-bold text-center mb-4">소비요정</h1>
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">지출 내역</TabsTrigger>
            <TabsTrigger value="summary">지출 요약</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-2">
            {loading ? (
              <div className="text-center py-8">데이터를 불러오는 중...</div>
            ) : (
              <ExpenseList 
                expenses={expenses} 
                onDeleteExpense={handleDeleteExpense} 
                onUpdateExpense={handleUpdateExpense} 
              />
            )}
          </TabsContent>
          <TabsContent value="summary" className="mt-2">
            <Tabs defaultValue="daily">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">일별</TabsTrigger>
                <TabsTrigger value="weekly">주간</TabsTrigger>
                <TabsTrigger value="monthly">월별</TabsTrigger>
              </TabsList>
              <TabsContent value="daily" className="mt-4">
                <ExpenseSummary expenses={expenses} />
              </TabsContent>
              <TabsContent value="weekly" className="mt-4">
                <ExpenseSummary expenses={expenses} />
              </TabsContent>
              <TabsContent value="monthly" className="mt-4">
                <ExpenseSummary expenses={expenses} />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </header>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg">
        <QuickExpense onAddExpense={handleAddExpense} />
      </div>
    </div>
  )
}