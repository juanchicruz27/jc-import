import { PrismaClient } from '@prisma/client'

const urlsToTest = [
  "postgresql://postgres.lexqztdwfqlykrgrexmq:%28Juanchi27%29.@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true",
  "postgresql://postgres.lexqztdwfqlykrgrexmq:%28Juanchi27%29.@aws-1-us-west-1.pooler.supabase.com:5432/postgres",
  "postgresql://postgres:%28Juanchi27%29.@db.lexqztdwfqlykrgrexmq.supabase.co:5432/postgres",
  "postgresql://postgres:(Juanchi27).@db.lexqztdwfqlykrgrexmq.supabase.co:5432/postgres"
];

async function test() {
  for (const url of urlsToTest) {
    console.log(`Testing: ${url}`);
    const prisma = new PrismaClient({
      datasourceUrl: url
    });
    try {
      await prisma.$connect();
      const count = await prisma.storeSettings.count();
      console.log(`SUCCESS: ${url} (count: ${count})`);
      await prisma.$disconnect();
    } catch (e: any) {
      console.log(`FAILED: ${e.message.substring(0, 100)}...`);
    }
  }
}

test();
