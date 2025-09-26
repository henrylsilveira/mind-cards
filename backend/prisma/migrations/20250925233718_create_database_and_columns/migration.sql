-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "image" TEXT,
    "emailVerified" BOOLEAN NOT NULL,
    "provider" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."status" (
    "userId" TEXT NOT NULL,
    "total_themes" INTEGER NOT NULL DEFAULT 0,
    "total_games" INTEGER NOT NULL DEFAULT 0,
    "total_corrects" INTEGER NOT NULL DEFAULT 0,
    "total_wrongs" INTEGER NOT NULL DEFAULT 0,
    "best_streak" INTEGER NOT NULL DEFAULT 0,
    "time_spent" INTEGER NOT NULL DEFAULT 0,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "total_cards" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "status_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "public"."theme" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme_name" TEXT NOT NULL,
    "theme_description" TEXT,
    "card_quantity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."card" (
    "id" TEXT NOT NULL,
    "themesId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sub_title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "correct_tries" INTEGER NOT NULL DEFAULT 0,
    "wrong_tries" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number_cards" INTEGER NOT NULL,
    "temp" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "correct_answers" INTEGER NOT NULL,
    "wrong_answers" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."responses" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "roundId" TEXT NOT NULL,
    "user_response" TEXT NOT NULL,
    "cos_similarity" DOUBLE PRECISION NOT NULL,
    "response_date" INTEGER NOT NULL,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."deck" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."decks_cards" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "deckId" TEXT NOT NULL,

    CONSTRAINT "decks_cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "public"."user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_provider_key" ON "public"."user"("email", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "session_id_key" ON "public"."session"("id");

-- CreateIndex
CREATE UNIQUE INDEX "session_sessionToken_key" ON "public"."session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "status_userId_key" ON "public"."status"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "theme_id_key" ON "public"."theme"("id");

-- CreateIndex
CREATE INDEX "theme_userId_idx" ON "public"."theme"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "card_id_key" ON "public"."card"("id");

-- CreateIndex
CREATE INDEX "card_userId_themesId_idx" ON "public"."card"("userId", "themesId");

-- CreateIndex
CREATE UNIQUE INDEX "round_id_key" ON "public"."round"("id");

-- CreateIndex
CREATE INDEX "round_userId_idx" ON "public"."round"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "responses_id_key" ON "public"."responses"("id");

-- CreateIndex
CREATE INDEX "responses_cardId_roundId_idx" ON "public"."responses"("cardId", "roundId");

-- CreateIndex
CREATE UNIQUE INDEX "deck_id_key" ON "public"."deck"("id");

-- CreateIndex
CREATE UNIQUE INDEX "decks_cards_id_key" ON "public"."decks_cards"("id");

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."status" ADD CONSTRAINT "status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."theme" ADD CONSTRAINT "theme_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."card" ADD CONSTRAINT "card_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."card" ADD CONSTRAINT "card_themesId_fkey" FOREIGN KEY ("themesId") REFERENCES "public"."theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."round" ADD CONSTRAINT "round_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."responses" ADD CONSTRAINT "responses_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "public"."card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."responses" ADD CONSTRAINT "responses_roundId_fkey" FOREIGN KEY ("roundId") REFERENCES "public"."round"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."decks_cards" ADD CONSTRAINT "decks_cards_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "public"."card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."decks_cards" ADD CONSTRAINT "decks_cards_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "public"."deck"("id") ON DELETE CASCADE ON UPDATE CASCADE;
