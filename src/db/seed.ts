import puppeteer, { Page, type Browser } from "puppeteer";
import { db } from ".";
import { classes, pvpRanks, servers, specializations } from "./schema";
import { eq } from "drizzle-orm";

type Specs = Omit<typeof specializations.$inferInsert, "id" | "classId">;
type ClassInsert = Omit<typeof classes.$inferInsert, "id"> & {
  specializations: Specs[];
};

async function initBrowser() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://elwiki.net");
  return { browser, page };
}

async function extractCharacters(page: Page) {
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

  return characters;
}

/**
 * Scrapes character classes and specializations from ElWiki and inserts them into the database.
 */
async function saveClassWithSpecs(character: ClassInsert) {
  if (!character.name) return;

  await db.transaction(async (tx) => {
    const [insertedClass] = await tx
      .insert(classes)
      .values({ name: character.name, iconUrl: character.iconUrl || "" })
      .onConflictDoNothing({ target: classes.name })
      .returning({ id: classes.id });

    const classId =
      insertedClass?.id ??
      (
        await tx.select().from(classes).where(eq(classes.name, character.name))
      )[0].id;

    const specsToInsert = character.specializations.map((spec) => ({
      classId,
      name: spec.name,
      iconUrl: spec.iconUrl,
    }));
    await tx
      .insert(specializations)
      .values(specsToInsert)
      .onConflictDoNothing({ target: specializations.name });
    console.log(`Processed class "${character.name}" with ID ${classId}`);
  });
}

/**
 * Seeds the database with initial server and PvP rank data.
 */
async function seedStaticData() {
  await db.transaction(async (tx) => {
    await tx
      .insert(servers)
      .values([
        { name: "Europe" },
        { name: "North America" },
        { name: "Korea" },
      ])
      .onConflictDoNothing({ target: servers.name });

    await tx
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
      .onConflictDoNothing({ target: pvpRanks.name });
  });
}

async function main() {
  let browser: Browser | null = null;
  try {
    const { browser: b, page } = await initBrowser();
    browser = b;

    const characters = await extractCharacters(page);
    console.log(`Trouvé ${characters.length} classes.`);

    // Insertion séquentielle
    for (const char of characters) {
      await saveClassWithSpecs(char);
    }
    console.log("Insertion des classes et spécialisations terminée.");

    await seedStaticData();
    console.log("Seed serveurs & PvP ranks terminé.");
  } catch (err) {
    console.error("Erreur pendant l’exécution :", err);
  } finally {
    if (browser) await browser.close();
  }
}

main();
