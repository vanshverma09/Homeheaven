import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash, Edit } from "lucide-react";

export default async function AdminProperties() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Properties</h1>
          <p className="text-muted-foreground mt-1">Add, edit, or delete property listings.</p>
        </div>
        <Link href="/admin/properties/add">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
            + Add Property
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {properties.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No properties found in the database.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-muted-foreground">Property</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Location</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Price</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.image || "/placeholder.svg"} className="size-12 rounded-lg object-cover" alt="" />
                      <span className="font-semibold">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{p.location}</td>
                  <td className="px-6 py-4 font-medium">{p.priceLabel || p.price}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-semibold">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                        <Edit className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
                        <Trash className="size-4" />
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
