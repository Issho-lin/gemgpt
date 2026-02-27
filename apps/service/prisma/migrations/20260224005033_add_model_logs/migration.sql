-- CreateTable
CREATE TABLE "model_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "modelId" TEXT,
    "modelName" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "model_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "model_logs" ADD CONSTRAINT "model_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "model_logs" ADD CONSTRAINT "model_logs_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "model_configs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
