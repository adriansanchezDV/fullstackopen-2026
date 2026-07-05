const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith, createNote } = require("./helper");

describe("Note app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3001/api/testing/reset");
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });
    await page.goto("/");

    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test("front page can be opened", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Notes", level: 1 }),
    ).toBeVisible();

    
  });

  test("login fails with wrong password", async ({ page }) => {
    await page.getByRole("button", { name: "log in" }).click();
    await page.getByTestId("username").fill("mluukkai");
    await page.getByTestId("password").fill("wrong");
    await page.getByRole("button", { name: "login" }).click();

    const errorDiv = await page.locator(".error");
    await expect(errorDiv).toContainText("wrong credentials");
    await expect(errorDiv).toHaveCSS("border-style", "solid");
    await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
    await expect(
      page.getByText("Matti Luukkainen logged in"),
    ).not.toBeVisible();
  });

  test("user can log in", async ({ page }) => {
    await loginWith(page, "mluukkai", "salainen");

    await expect(page.getByText("logged-in")).toBeVisible();
  });

  describe("when logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
      const sucessDiv = await page.locator(".success");
      await expect(sucessDiv).toHaveCSS("border-style", "solid");
      await expect(sucessDiv).toHaveCSS("color", "rgb(0, 255, 0)");
    });

    test("a new note can be created", async ({ page }) => {
      await createNote(page, "a note created by playwright", true);
      await expect(
        page.locator("li").filter({ hasText: "a note created by playwright" }),
      ).toBeVisible();
    });
    describe("and a note exists", () => {
      beforeEach(async ({ page }) => {
        await createNote(page, "first note", true);
        await createNote(page, "second note", true);
        await createNote(page, 'third note', true)
      });

      test("importance can be changed", async ({ page }) => {
           await page.pause()
        const otherNoteElement = page.locator("li").filter({
          hasText: "second note",
        });

        await otherNoteElement
          .getByRole("button", { name: "make not important" })
          .click();
          await expect(otherNoteElement).toContainText('make not important')

        await expect(
          otherNoteElement.getByRole("button", { name: "make important" }),
        ).toBeVisible();
      });
    });
  });
});
