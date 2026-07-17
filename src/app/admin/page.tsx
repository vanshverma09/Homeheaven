import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MessageSquare, PhoneCall, FileText } from "lucide-react";
import { AdminCharts } from "@/components/admin/admin-charts";

export default async function AdminDashboard() {
  const [totalProperties, totalSiteVisits, totalCallbacks, totalContacts] = await Promise.all([
    prisma.property.count(),
    prisma.siteVisit.count(),
    prisma.callbackRequest.count(),
    prisma.contactRequest.count(),
  ]);

  const stats = [
    { title: "Total Properties", value: totalProperties, icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Site Visits", value: totalSiteVisits, icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Callback Requests", value: totalCallbacks, icon: PhoneCall, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Contact Queries", value: totalContacts, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome to your admin control panel.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`size-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Quick Actions</h3>
            <div className="flex gap-4">
              <a href="/admin/properties/add" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                + Add Property
              </a>
              <a href="/admin/inquiries" className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition">
                View Inquiries
              </a>
            </div>
          </CardContent>
        </Card>
      </div>

      <AdminCharts />
    </div>
  );
}
