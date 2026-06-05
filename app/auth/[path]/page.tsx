import { Suspense } from "react";
import { AuthView } from "@neondatabase/auth-ui";
import { authViewPaths } from "@neondatabase/auth-ui/server";
import { UnauthorizedNotice } from "@/components/auth/unauthorized-notice";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center p-6">
      <Suspense fallback={null}>
        <UnauthorizedNotice />
      </Suspense>
      <AuthView path={path} />
    </main>
  );
}
