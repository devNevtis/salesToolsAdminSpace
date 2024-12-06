//src/app/layout.js
import './globals.css'
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: 'Sales Tools Manager',
  description: 'Admin platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}