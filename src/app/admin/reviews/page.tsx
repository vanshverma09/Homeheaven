import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function AdminReviews() {
  const reviews = await prisma.review.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Property Reviews</h1>
        <p className="text-muted-foreground mt-1">Approve or reject property reviews submitted by users.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No reviews found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-muted-foreground">Author</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Rating</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Review</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4 font-medium">{r.author}</td>
                  <td className="px-6 py-4 text-amber-500 font-bold">{r.rating} / 5</td>
                  <td className="px-6 py-4 text-muted-foreground max-w-sm truncate">{r.content}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      r.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' :
                      r.status === 'Rejected' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 cursor-pointer">
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer">
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
