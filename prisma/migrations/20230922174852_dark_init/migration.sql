-- CreateTable
CREATE TABLE "DarkAttribute" (
    "id" SERIAL NOT NULL,
    "enName" TEXT NOT NULL,
    "ruName" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,
    "ruDescription" TEXT NOT NULL,

    CONSTRAINT "DarkAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DarkAttributeLevel" (
    "id" SERIAL NOT NULL,
    "attributeId" INTEGER NOT NULL,
    "depth" INTEGER NOT NULL,
    "classes" TEXT[],

    CONSTRAINT "DarkAttributeLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DarkClass" (
    "id" SERIAL NOT NULL,
    "enName" TEXT NOT NULL,
    "ruName" TEXT NOT NULL,
    "enDescription" TEXT NOT NULL,
    "ruDescription" TEXT NOT NULL,

    CONSTRAINT "DarkClass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DarkAttributeLevel" ADD CONSTRAINT "DarkAttributeLevel_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "DarkAttribute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
