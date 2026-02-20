import { Layout } from "@/components/layout";
import { StatCard } from "@/components/stat-card";
import { TransactionForm } from "@/components/transaction-form";
import { useTransactions } from "@/hooks/use-transactions";
import { useAuth } from "@/hooks/use-auth";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  Trash2,
  CalendarDays,
  Tag
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { transactions, isLoading, deleteTransaction } = useTransactions();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  // Calculate totals
  const income = transactions
    ?.filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

  const expenses = transactions
    ?.filter((t) => t.type === "expense")
    .reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

  const balance = income - expenses;

  // Recent transactions (last 5)
  const recentTransactions = transactions?.slice(0, 5) || [];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.username}. Here's what's happening today.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Record a new income or expense entry.
              </DialogDescription>
            </DialogHeader>
            <TransactionForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Balance"
          value={`$${balance.toFixed(2)}`}
          icon={Wallet}
          className="border-primary/20 bg-primary/5"
          delay={0}
        />
        <StatCard
          title="Total Income"
          value={`$${income.toFixed(2)}`}
          icon={ArrowUpCircle}
          className="text-green-600"
          delay={100}
        />
        <StatCard
          title="Total Expenses"
          value={`$${expenses.toFixed(2)}`}
          icon={ArrowDownCircle}
          className="text-red-600"
          delay={200}
        />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden animate-in" style={{ animationDelay: '300ms' }}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent Transactions</h2>
        </div>
        
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-medium">No transactions yet</p>
            <p className="text-sm">Add your first transaction to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 hover:bg-secondary/30 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
                  `}>
                    {transaction.type === 'income' ? <ArrowUpCircle className="w-5 h-5" /> : <ArrowDownCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{transaction.category}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="w-3 h-3" />
                      <span>{format(new Date(transaction.date), "MMM d, yyyy")}</span>
                      {transaction.description && (
                        <>
                          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                          <span className="truncate max-w-[150px]">{transaction.description}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`font-bold font-mono ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-foreground'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toFixed(2)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    onClick={() => deleteTransaction.mutate(transaction.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
