import prisma from "database";
import AdminContent from "@/components/admin/AdminContent";

export const revalidate = 0;

export default async function AdminDashboard() {
  let settings = null;
  let products: any[] = [];
  let sales: any[] = [];
  let errorMsg = null;
  
  try {
    settings = await prisma.settings.findUnique({ where: { id: "global" }});
    products = await prisma.product.findMany({ orderBy: { createdAt: "desc" }});
    sales = await prisma.sale.findMany({ orderBy: { date: "desc" }});
  } catch (e: any) {
    errorMsg = e.message + "\n" + e.stack;
  }
  
  if (errorMsg) {
    return <main className="p-10 text-red-500"><h1 className="text-2xl font-bold">CRASH LOG:</h1><pre className="whitespace-pre-wrap">{errorMsg}</pre></main>;
  }

  return (
    <AdminContent 
      initialProducts={products} 
      initialDollarRate={settings?.dollarRate ?? 1000} 
      initialSales={sales} 
    />
  );
}
