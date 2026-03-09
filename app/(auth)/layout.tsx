import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background text-foreground selection:bg-primary/30">
      {/* Dynamic Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 flex justify-center">
        <div
          className="absolute top-[-20%] h-[50rem] w-[50rem] rounded-full bg-primary/5 blur-[120px] animate-pulse"
          style={{ animationDuration: "10s" }}
        />
        <div
          className="absolute right-[-10%] top-[40%] h-[30rem] w-[30rem] rounded-full bg-secondary/5 blur-[100px] animate-pulse"
          style={{ animationDuration: "8s" }}
        />
      </div>

      {/* Header */}
      <header className="w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20">
              <span className="text-lg font-bold text-primary-foreground">
                W
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight text-foreground">
                White Label Pay
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Secure Transfers
              </span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl">{children}</div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 bg-background/50 backdrop-blur-sm">
        <div className="container text-center text-sm text-muted-foreground px-4">
          <p>
            &copy; {new Date().getFullYear()} White Label Pay. All rights
            reserved.
          </p>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-border">|</span>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
