import { prisma } from "@/lib/prisma";

export default async function AdminInquiries() {
  const [siteVisits, callbackRequests] = await Promise.all([
    prisma.siteVisit.findMany({ orderBy: { createdAt: "desc" }, include: { user: true } }),
    prisma.callbackRequest.findMany({ orderBy: { createdAt: "desc" }, include: { user: true } }),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manage Inquiries</h1>
        <p className="text-muted-foreground mt-1">View site visits and callback requests from users.</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Site Visits</h2>
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {siteVisits.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No site visits booked yet.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Name</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Contact</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Property</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {siteVisits.map((v) => (
                  <tr key={v.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4">{v.name} {v.user && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full ml-2">Registered</span>}</td>
                    <td className="px-6 py-4">{v.email}<br/><span className="text-muted-foreground">{v.mobile}</span></td>
                    <td className="px-6 py-4">{v.property}</td>
                    <td className="px-6 py-4 font-medium">{v.date} at {v.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Callback Requests</h2>
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {callbackRequests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No callback requests received.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Name</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Mobile</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Preferred Time</th>
                  <th className="px-6 py-4 font-medium text-muted-foreground">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {callbackRequests.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4">{r.name}</td>
                    <td className="px-6 py-4">{r.mobile}</td>
                    <td className="px-6 py-4 font-medium">{r.preferredDate} at {r.preferredTime}</td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">{r.message || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
