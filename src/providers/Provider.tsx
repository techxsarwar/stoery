import { NextAuthProvider } from "./NextAuthProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <NextAuthProvider>{children}</NextAuthProvider>;
}
