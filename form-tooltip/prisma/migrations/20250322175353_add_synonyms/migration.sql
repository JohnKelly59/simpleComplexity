-- CreateTable
CREATE TABLE "QuestionMapping" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "synonyms" TEXT[],

    CONSTRAINT "QuestionMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "subscriptionTier" TEXT NOT NULL DEFAULT 'free',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionMapping_key_key" ON "QuestionMapping"("key");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
