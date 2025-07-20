-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "type" TEXT,
    "status" TEXT NOT NULL DEFAULT 'false',
    "source" TEXT,
    "transactionId" TEXT,
    "amount" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'INR',

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
