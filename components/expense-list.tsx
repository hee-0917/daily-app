"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import type { Expense } from "./expense-tracker"
import { ExpenseForm } from "./expense-form"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type ExpenseListProps = {
  expenses: Expense[]
  onDeleteExpense: (id: string) => void
  onUpdateExpense: (expense: Expense) => void
}

export function ExpenseList({ expenses, onDeleteExpense, onUpdateExpense }: ExpenseListProps) {
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)

  // Group expenses by date
  const groupedExpenses = expenses.reduce<Record<string, Expense[]>>((groups, expense) => {
    const date = expense.date
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(expense)
    return groups
  }, {})

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setIsEditSheetOpen(true)
  }

  const handleUpdate = (updatedExpenseData: Omit<Expense, "id">) => {
    if (editingExpense) {
      onUpdateExpense({
        ...updatedExpenseData,
        id: editingExpense.id,
      })
      setEditingExpense(null)
      setIsEditSheetOpen(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      {sortedDates.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">지출 내역이 없습니다.</div>
      ) : (
        sortedDates.map((date) => {
          const dayExpenses = groupedExpenses[date]
          const dayTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)

          return (
            <div key={date} className="mb-4">
              <div className="flex justify-between items-center mb-2 sticky top-[120px] bg-background py-2 z-10 border-b">
                <h3 className="text-sm font-medium">{format(parseISO(date), "M월 d일 (EEE)", { locale: ko })}</h3>
                <span className="font-semibold text-sm">{formatCurrency(dayTotal)}</span>
              </div>

              <div className="space-y-2">
                {dayExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between py-3 px-2 border-b last:border-0 hover:bg-muted/50 rounded-md"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{expense.title}</div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <div className="text-right font-medium whitespace-nowrap">{formatCurrency(expense.amount)}</div>
                      <div className="flex">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(expense)}>
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">수정</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onDeleteExpense(expense.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">삭제</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}

      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent side="bottom" className="h-[90%] rounded-t-xl">
          <SheetHeader>
            <SheetTitle>지출 내역 수정</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {editingExpense && (
              <ExpenseForm
                onAddExpense={handleUpdate}
                initialExpense={editingExpense}
                onCancel={() => setIsEditSheetOpen(false)}
                isEditing
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}