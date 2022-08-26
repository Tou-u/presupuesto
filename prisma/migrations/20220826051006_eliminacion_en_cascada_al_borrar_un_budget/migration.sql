-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Spent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "budgetId" TEXT NOT NULL,
    CONSTRAINT "Spent_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Spent" ("amount", "budgetId", "category", "date", "id", "name") SELECT "amount", "budgetId", "category", "date", "id", "name" FROM "Spent";
DROP TABLE "Spent";
ALTER TABLE "new_Spent" RENAME TO "Spent";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
