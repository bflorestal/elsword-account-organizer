import puppeteer from "puppeteer";
import { db } from ".";
import { classes, pvpRanks, servers, specializations } from "./schema";
import { eq } from "drizzle-orm";

type Specs = Omit<typeof specializations.$inferInsert, "classId">;

/**
 * Scrapes character classes and specializations from ElWiki and inserts them into the database.
 * This function uses Puppeteer to navigate to the ElWiki character page,
 * extracts character names, images, and their specializations,
 * and inserts them into the database.
 */
async function scrape() {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto("https://elwiki.net");

  await page.waitForSelector(".char-banner-tree");

  const characters = await page.evaluate(() => {
    const result: Array<
      typeof classes.$inferInsert & { specializations: Array<Specs> }
    > = [];

    const bannerWrap = document.querySelector(".character-banner-wrap");
    if (!bannerWrap) return result;

    const characterTrees = bannerWrap.querySelectorAll(".char-banner-tree");

    characterTrees.forEach((charTreeDiv) => {
      const characterName = charTreeDiv.getAttribute("data-display-base");

      const img = (() => {
        const bannerSelectDiv = bannerWrap.querySelector(
          ".character-banner-select"
        );
        if (!bannerSelectDiv) return null;

        const characterDiv = bannerSelectDiv.querySelector(
          `div[data-display-base="${characterName}"]`
        );
        return characterDiv?.querySelector("img")?.src || null;
      })();

      const characterSpecs: Array<Specs> = [];

      const specDivs = charTreeDiv.querySelectorAll(".char-banner-tree-image");
      specDivs.forEach((spec) => {
        const className = spec.getAttribute("data-class-name");
        const iconUrl = spec.querySelector("img")?.src;

        if (className)
          characterSpecs.push({
            name: className,
            iconUrl: iconUrl ?? "",
          });
      });

      result.push({
        name: characterName ?? "",
        iconUrl: img ?? "",
        specializations: characterSpecs,
      });
    });

    return result;
  });

  await browser.close();

  console.log("Inserting scraped data into database...");

  for (const character of characters) {
    if (!character.name) continue;

    const [existingClass] = await db
      .select()
      .from(classes)
      .where(eq(classes.name, character.name));

    let classId: number;

    if (existingClass) {
      classId = existingClass.id;
      console.log(
        `Class "${character.name}" already exists with ID ${classId}`
      );
    } else {
      const [newClass] = await db
        .insert(classes)
        .values({
          name: character.name,
          iconUrl: character.iconUrl || "",
        })
        .onConflictDoNothing({ target: classes.name })
        .returning({ id: classes.id });

      console.log(
        `Inserted new class "${character.name}" with ID ${newClass.id}`
      );
      classId = newClass.id;
    }

    for (const spec of character.specializations) {
      const [newSpec] = await db
        .insert(specializations)
        .values({
          classId,
          name: spec.name,
          iconUrl: spec.iconUrl || "",
        })
        .onConflictDoNothing({ target: specializations.name })
        .returning({ id: specializations.id });

      console.log(
        `Specialization "${spec.name}" (${character.name}) ${
          newSpec?.id
            ? `inserted with ID ${newSpec.id}`
            : "already exists, skipping."
        }`
      );
    }
  }

  console.log("Database insertion completed!");
}

/**
 * Seeds the database with initial server and PvP rank data.
 * This function inserts predefined server names and PvP ranks into the database,
 * ensuring that duplicates are not created.
 */
async function seedServersAndRanks() {
  console.log("Inserting servers and PvP ranks into database...");

  const newServers = await db
    .insert(servers)
    .values([{ name: "Europe" }, { name: "North America" }, { name: "Korea" }])
    .onConflictDoNothing({ target: servers.name })
    .returning();

  console.log(
    "Inserted servers:",
    newServers.map((server) => server.name)
  );

  const newPvPRanks = await db
    .insert(pvpRanks)
    .values([
      { name: "Unranked" },
      {
        name: "E",
        iconUrl: "https://elwiki.net/wiki/images/7/76/RankE3.png",
      },
      {
        name: "D",
        iconUrl: "https://elwiki.net/wiki/images/c/c2/RankD3.png",
      },
      {
        name: "C",
        iconUrl: "https://elwiki.net/wiki/images/2/29/RankC3.png",
      },
      {
        name: "B",
        iconUrl: "https://elwiki.net/wiki/images/a/ab/RankB3.png",
      },
      {
        name: "A",
        iconUrl: "https://elwiki.net/wiki/images/5/56/RankA3.png",
      },
      {
        name: "S",
        iconUrl: "https://elwiki.net/wiki/images/b/b9/RankS3.png",
      },
      {
        name: "SS",
        iconUrl: "https://elwiki.net/wiki/images/a/aa/RankSS3.png",
      },
      {
        name: "SSS",
        iconUrl: "https://elwiki.net/wiki/images/5/5d/RankSSS3.png",
      },
      {
        name: "Star",
        iconUrl: "https://elwiki.net/wiki/images/7/7b/RankStar3.png",
      },
    ])
    .onConflictDoNothing({ target: pvpRanks.name })
    .returning();

  console.log(
    "Inserted PvP ranks:",
    newPvPRanks.map((rank) => rank.name)
  );

  console.log("Database seeding completed!");
}

(async () => {
  try {
    await scrape();
    await seedServersAndRanks();
  } catch (error) {
    console.error("Error during database population:", error);
  }
})();
