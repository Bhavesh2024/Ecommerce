-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "prices" JSONB NOT NULL,
    "extras" JSONB NOT NULL,
    "images" JSONB NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT '',
    "discount" DOUBLE PRECISION NOT NULL,
    "stockCount" INTEGER NOT NULL,
    "stockStatus" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
