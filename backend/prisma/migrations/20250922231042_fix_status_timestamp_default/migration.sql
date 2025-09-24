/*
  Warnings:

  - The primary key for the `status` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `status` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_status" (
    "userId" TEXT NOT NULL PRIMARY KEY,
    "total_games" INTEGER NOT NULL DEFAULT 0,
    "total_corrects" INTEGER NOT NULL DEFAULT 0,
    "total_wrongs" INTEGER NOT NULL DEFAULT 0,
    "best_streak" INTEGER NOT NULL DEFAULT 0,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_cards" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "status_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_status" ("best_streak", "total_cards", "total_corrects", "total_games", "total_score", "total_wrongs", "updated_at", "userId") SELECT "best_streak", "total_cards", "total_corrects", "total_games", "total_score", "total_wrongs", "updated_at", "userId" FROM "status";
DROP TABLE "status";
ALTER TABLE "new_status" RENAME TO "status";
CREATE UNIQUE INDEX "status_userId_key" ON "status"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
