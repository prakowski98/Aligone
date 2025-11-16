'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Lock, Mail, ArrowRight, Shield, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Nieprawidłowy email lub hasło. Spróbuj ponownie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  aligone
                </span>
              </h1>
            </Link>
            <h2 className="text-2xl font-bold mb-2">Witaj ponownie!</h2>
            <p className="text-muted-foreground">
              Zaloguj się do swojego konta Aligone
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-xl">Zaloguj się</CardTitle>
              <CardDescription>
                Wprowadź swoje dane, aby kontynuować
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Adres email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="twoj.email@example.pl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Hasło
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Wprowadź hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-input text-primary focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">Zapamiętaj mnie</span>
                  </label>
                  <Link
                    href="/zapomniane-haslo"
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Nie pamiętasz hasła?
                  </Link>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-2">
                <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Logowanie...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Zaloguj się
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      lub
                    </span>
                  </div>
                </div>

                <Link href="/register" className="w-full">
                  <Button variant="outline" className="w-full h-11 text-base" type="button">
                    Utwórz nowe konto
                  </Button>
                </Link>
              </CardFooter>
            </form>
          </Card>

          {/* Security Info */}
          <div className="mt-6 p-4 rounded-lg border border-border bg-muted/30">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium mb-1">Bezpieczeństwo Twoich danych</p>
                <p className="text-xs text-muted-foreground">
                  Twoje dane są chronione szyfrowaniem SSL. Nigdy nie udostępniamy ich osobom trzecim.
                </p>
              </div>
            </div>
          </div>

          {/* Test Credentials */}
          <div className="mt-4 p-4 rounded-lg border border-primary/20 bg-primary/5">
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <span>🔑</span> Dane testowe:
            </p>
            <div className="space-y-1 text-xs text-muted-foreground font-mono">
              <p>Email: jan.kowalski@example.pl</p>
              <p>Hasło: password123</p>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>
              Logując się, akceptujesz{' '}
              <Link href="/regulamin" className="text-primary hover:underline">
                Regulamin
              </Link>{' '}
              i{' '}
              <Link href="/prywatnosc" className="text-primary hover:underline">
                Politykę Prywatności
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
