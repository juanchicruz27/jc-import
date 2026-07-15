const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'cuotas', mode: 'insensitive' } },
        { brand: { contains: 'cuotas', mode: 'insensitive' } },
        { notesTop: { contains: 'cuotas', mode: 'insensitive' } },
        { name: { contains: 'cfta', mode: 'insensitive' } }
      ]
    },
    select: { id: true, name: true, brand: true }
  });
  
  console.log(JSON.stringify(products, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
