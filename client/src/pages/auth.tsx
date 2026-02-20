import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, isLoggingIn, isRegistering, user } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/");
    return null;
  }

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: InsertUser) => {
    if (isLogin) {
      login(data);
    } else {
      register(data);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Form */}
      <div className="flex items-center justify-center p-8 bg-background animate-in">
        <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <span className="font-display font-bold text-xl">FinanceFlow</span>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">
              {isLogin ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-base">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Enter your information to create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="johndoe" 
                          {...field} 
                          className="h-11 px-4 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary transition-all" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          className="h-11 px-4 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full h-11 mt-6 rounded-xl text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all"
                  disabled={isLoggingIn || isRegistering}
                >
                  {(isLoggingIn || isRegistering) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLogin ? "Sign In" : "Sign Up"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button
              variant="link"
              className="w-full text-muted-foreground hover:text-primary"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary/5 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <h2 className="text-4xl font-display font-bold text-foreground mb-4">
            Master your money with confidence.
          </h2>
          <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
            Track expenses, visualize your spending habits, and reach your financial goals with our intuitive platform.
          </p>
        </div>

        {/* Feature Cards Mockup */}
        <div className="relative z-10 grid gap-4">
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 transform translate-x-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <ArrowRight className="w-5 h-5 -rotate-45" />
              </div>
              <div>
                <p className="font-bold text-foreground">Income Received</p>
                <p className="text-xs text-muted-foreground">Today, 9:41 AM</p>
              </div>
              <div className="ml-auto font-bold text-green-600">+$2,450.00</div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 transform -translate-x-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <ArrowRight className="w-5 h-5 rotate-45" />
              </div>
              <div>
                <p className="font-bold text-foreground">Grocery Shopping</p>
                <p className="text-xs text-muted-foreground">Yesterday, 5:23 PM</p>
              </div>
              <div className="ml-auto font-bold text-red-600">-$124.50</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
