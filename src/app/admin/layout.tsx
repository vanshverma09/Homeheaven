import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  Users, 
  PhoneCall, 
  Star, 
  LogOut 
} from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  let user = null;
  try {
    const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-for-development";
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { isAdmin: true, name: true }
    });
  } catch (e) {
    redirect("/login");
  }

  if (!user?.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row pt-20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border shrink-0 md:min-h-[calc(100vh-80px)]">
        <div className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-1">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">Logged in as {user.name}</p>
        </div>
        <nav className="space-y-1 px-3">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors">
            <LayoutDashboard className="size-4" /> Overview
          </Link>
          <Link href="/admin/properties" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors">
            <Building2 className="size-4" /> Properties
          </Link>
          <Link href="/admin/inquiries" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors">
            <PhoneCall className="size-4" /> Inquiries
          </Link>
          <Link href="/admin/contacts" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors">
            <MessageSquare className="size-4" /> Contacts
          </Link>
          <Link href="/admin/reviews" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors">
            <Star className="size-4" /> Reviews
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:text-foreground mt-8">
            <LogOut className="size-4" /> Back to Site
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}
