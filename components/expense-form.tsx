"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Expense } from "./expense-tracker"

type ExpenseFormProps = {
  onAddExpense: (expense: Omit<Expense, "id">) => void
  initialExpense?: Expense
  onCancel?: () => void
  isEditing?: boolean
}

export function ExpenseForm({ onAddExpense, initialExpense, onCancel, isEditing = false }: ExpenseFormProps) {
  const [date, setDate] = useState(initialExpense?.date || "")
  const [title, setTitle] = useState(initialExpense?.title || "")
  const [amount, setAmount] = useState(initialExpense?.amount.toString() || "")

  useEffect(() => {
    if (!isEditing) {
      setDate(new Date().toISOString().split("T")[0])
    } else if (initialExpense?.date) {
      setDate(initialExpense.date)
    }
  }, [isEditing, initialExpense])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !amount) {
      return
    }

    onAddExpense({
      date,
      title,
      amount: Number.parseFloat(amount),
    })

    if (!isEditing) {
      // 폼 초기화 시 날짜도 현재 날짜로 재설정
      setDate(new Date().toISOString().split("T")[0])
      setTitle("")
      setAmount("")
    }

    if (onCancel) {
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label htmlFor="date">날짜</Label>
          <Input 
            id="date" 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
            onFocus={(e) => {
              if (!date) {
                setDate(new Date().toISOString().split("T")[0])
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="title">항목</Label>
          <Input
            id="title"
            type="text"
            placeholder="지출 항목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="amount">금액</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
          />
        </div>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" className="flex-1">
          {isEditing ? "수정하기" : "추가하기"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
        )}
      </div>
    </form>
  )
}
