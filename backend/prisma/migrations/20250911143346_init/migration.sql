-- CreateEnum
CREATE TYPE "public"."GameStatus" AS ENUM ('OWNED', 'WISHLIST', 'PLAYED', 'COMPLETED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."games" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "summary" TEXT,
    "releaseDate" TIMESTAMP(3),
    "coverUrl" TEXT,
    "platforms" TEXT[],
    "genres" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game_entries" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "platform" TEXT,
    "status" "public"."GameStatus" NOT NULL DEFAULT 'OWNED',
    "rating" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "game_entries_userId_gameId_platform_key" ON "public"."game_entries"("userId", "gameId", "platform");

-- AddForeignKey
ALTER TABLE "public"."game_entries" ADD CONSTRAINT "game_entries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_entries" ADD CONSTRAINT "game_entries_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "public"."games"("id") ON DELETE CASCADE ON UPDATE CASCADE;
