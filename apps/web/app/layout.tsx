import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SupplyGraph - Procurement Automation",
  description: "Streamline your procurement workflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black">
          <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                    SupplyGraph
                  </h1>
                </div>
                <nav>
                  <ul className="flex space-x-6">
                    <li>
                      <a
                        href="/"
                        className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                      >
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        href="/requests"
                        className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                      >
                        Requests
                      </a>
                    </li>
                    <li>
                      <a
                        href="/vendors"
                        className="text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                      >
                        Vendors
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-6">
            <div className="container mx-auto px-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
              © {new Date().getFullYear()} SupplyGraph - Procurement Automation for SMEs
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
