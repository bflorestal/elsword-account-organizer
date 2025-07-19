import puppeteer from "puppeteer";
import { db } from "../db";
import { classes, specializations } from "../db/schema";
import { eq, and } from "drizzle-orm";

type Specialization = {
  name: string;
  img?: string;
};

type Character = {
  name: string | null;
  img: string | null;
  specializations: Specialization[];
};

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto("https://elwiki.net");

  await page.waitForSelector(".char-banner-tree");

  const characters = await page.evaluate(() => {
    const result: Character[] = [];

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

      const specializations: Specialization[] = [];

      const specDivs = charTreeDiv.querySelectorAll(".char-banner-tree-image");
      specDivs.forEach((spec) => {
        const className = spec.getAttribute("data-class-name");
        const img = spec.querySelector("img")?.src;

        if (className)
          specializations.push({
            name: className,
            img,
          });
      });

      result.push({
        name: characterName,
        img,
        specializations,
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
          iconUrl: character.img || "",
        })
        .returning({ id: classes.id });

      classId = newClass.id;
      console.log(`Inserted new class "${character.name}" with ID ${classId}`);
    }

    for (const spec of character.specializations) {
      const [existingSpec] = await db
        .select()
        .from(specializations)
        .where(
          and(
            eq(specializations.name, spec.name),
            eq(specializations.classId, classId)
          )
        );

      if (existingSpec) {
        console.log(
          `Specialization "${spec.name}" already exists for class "${character.name}"`
        );
      } else {
        await db.insert(specializations).values({
          classId,
          name: spec.name,
          iconUrl: spec.img || "",
        });

        console.log(
          `Inserted specialization "${spec.name}" for class "${character.name}"`
        );
      }
    }
  }

  console.log("Database insertion completed!");
})();
