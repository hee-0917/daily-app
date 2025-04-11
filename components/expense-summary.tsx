"use client"

import { useMemo } from "react"
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { ko } from "date-fns/locale"
import type { Expense, TimeFrame } from "./expense-tracker"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type ExpenseSummaryProps = {
  expenses: Expense[]
  timeFrame: TimeFrame
}

export function ExpenseSummary({ expenses, timeFrame }: ExpenseSummaryProps) {
  const filteredExpenses = useMemo(() => {
    const today = new Date()
    let filteredByTime: Expense[] = []

    // Filter by time frame
    if (timeFrame === "daily") {
      const todayStr = format(today, "yyyy-MM-dd")
      filteredByTime = expenses.filter((expense) => expense.date === todayStr)
    } else if (timeFrame === "weekly") {
      const weekStart = startOfWeek(today, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
      filteredByTime = expenses.filter((expense) => {
        const expenseDate = parseISO(expense.date)
        return isWithinInterval(expenseDate, { start: weekStart, end: weekEnd })
      })
    } else if (timeFrame === "monthly") {
      const monthStart = startOfMonth(today)
      const monthEnd = endOfMonth(today)
      filteredByTime = expenses.filter((expense) => {
        const expenseDate = parseISO(expense.date)
        return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd })
      })
    }

    return filteredByTime
  }, [expenses, timeFrame])

  const totalAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [filteredExpenses])

  // Group expenses by date for chart
  const chartData = useMemo(() => {
    const dateMap = new Map<string, number>()

    filteredExpenses.forEach((expense) => {
      const date = expense.date
      const formattedDate = format(parseISO(date), "M/d")

      if (dateMap.has(formattedDate)) {
        dateMap.set(formattedDate, dateMap.get(formattedDate)! + expense.amount)
      } else {
        dateMap.set(formattedDate, expense.amount)
      }
    })

    return Array.from(dateMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => {
        // Sort by date
        const dateA = a.date.split("/").map(Number)
        const dateB = b.date.split("/").map(Number)
        if (dateA[0] !== dateB[0]) return dateA[0] - dateB[0] // Month
        return dateA[1] - dateB[1] // Day
      })
  }, [filteredExpenses])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const timeFrameTitle = {
    daily: "오늘",
    weekly: "이번 주",
    monthly: "이번 달",
  }[timeFrame]

  return (
    <div className="space-y-4">
      <div className="text-center py-4">
        <div className="text-sm text-muted-foreground">{timeFrameTitle} 총 지출</div>
        <div className="text-3xl font-bold mt-1">{formatCurrency(totalAmount)}</div>
      </div>

      {filteredExpenses.length > 0 ? (
        <div className="h-[200px] mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ left: 0, right: 16, top: 10, bottom: 10 }}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickMargin={5} />
              <YAxis tickFormatter={(value) => `${Math.floor(value / 1000)}K`} width={40} />
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                labelFormatter={(label) => `${label}`}
                cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              />
              <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">{timeFrameTitle} 지출 내역이 없습니다.</div>
      )}

      {/* Recent expenses list */}
      {filteredExpenses.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium text-sm mb-2">최근 지출 내역</h3>
          <div className="space-y-2">
            {filteredExpenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((expense) => (
                <div key={expense.id} className="flex items-center justify-between py-2 border-b">
                  <div className="flex-1">
                    <div className="font-medium">{expense.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(parseISO(expense.date), "M월 d일", { locale: ko })}
                    </div>
                  </div>
                  <div className="text-sm font-medium">{formatCurrency(expense.amount)}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}