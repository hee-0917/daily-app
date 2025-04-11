"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Expense } from "./expense-tracker"

type QuickExpenseProps = {
  onAddExpense: (expense: Omit<Expense, "id">) => void
}

export function QuickExpense({ onAddExpense }: QuickExpenseProps) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !amount) {
      return
    }

    onAddExpense({
      date: new Date().toISOString().split("T")[0],
      title,
      amount: Number.parseFloat(amount),
    })

    setTitle("")
    setAmount("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="항목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1"
        required
      />
      <Input
        type="number"
        placeholder="금액"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-24"
        required
        min="0"
      />
      <Button type="submit" size="sm">
        추가
      </Button>
    </form>
  )
}