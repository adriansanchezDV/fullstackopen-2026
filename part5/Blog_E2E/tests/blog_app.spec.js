const { test, expect, describe, beforeEach } = require("@playwright/test");

const {
  loginWith,
  createBlog,
  openBlog,
  likeBlog
} = require('./helper')

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // 1. Vaciar la base de datos
    await request.post("http://localhost:3003/api/testing/reset");

    // 2. Crear un usuario
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });

    
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Log in" })).toBeVisible();
    await expect(page.getByLabel("Username")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByLabel("Username").fill("mluukkai");

      await page.getByLabel("Password").fill("salainen");

      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("Username").fill("mluukkai");

      await page.getByLabel("Password").fill("contraseñaIncorrecta");

      await page.getByRole("button", { name: "Login" }).click();

      await expect(page.getByText("Wrong username or password")).toBeVisible();
    });
  });
  describe("When logged in", () => {
    beforeEach(async ({ page, request }) => {
      // reset BD
      await request.post("http://localhost:3003/api/testing/reset");

      // crear usuario
      await request.post("http://localhost:3003/api/users", {
        data: {
          name: "Matti Luukkainen",
          username: "mluukkai",
          password: "salainen",
        },
      });

       await loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      // abrir formulario (Togglable)
      await page.getByRole("button", { name: "new blog" }).click();

      // rellenar formulario
      await page.getByLabel("Title").fill("Blog de pruebas E2E");
      await page.getByLabel("Author").fill("Adri");
      await page.getByLabel("Url").fill("http://test.com");

      // enviar
      await page.getByRole("button", { name: "Create" }).click();

      // verificar que aparece en la lista
      const blog = page.locator(".blog").filter({
        hasText: "Blog de pruebas E2E Adri",
      });

      await expect(blog).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      // 1. abrir formulario
      await page.getByRole("button", { name: "new blog" }).click();

      // 2. crear blog
      await page.getByLabel("Title").fill("Blog a likear");
      await page.getByLabel("Author").fill("Adri");
      await page.getByLabel("Url").fill("http://test.com");

      await page.getByRole("button", { name: "Create" }).click();

      // 3. abrir blog (click view)
      const blog = page.locator(".blog").filter({
        hasText: "Blog a likear",
      });

      await blog.getByRole("button", { name: "view" }).click();

      // 4. comprobar likes iniciales
      const likes = blog.locator(".blog-likes");
      await expect(likes).toContainText("likes 0");

      // 5. click like
      await blog.getByRole("button", { name: "like" }).click();

      // 6. comprobar incremento
      await expect(likes).toContainText("likes 1");
    });

    test("user can delete their own blog", async ({ page }) => {
      // crear blog
      await page.getByRole("button", { name: "new blog" }).click();

      await page.getByLabel("Title").fill("Blog a eliminar");
      await page.getByLabel("Author").fill("Adri");
      await page.getByLabel("Url").fill("http://test.com");

      await page.getByRole("button", { name: "Create" }).click();

      // 👇 ESPERA a que el blog aparezca en pantalla
      const blog = page.locator(".blog").filter({
        hasText: "Blog a eliminar",
      });

      await expect(blog).toBeVisible();

      // abrir detalles
      await blog.getByRole("button", { name: "view" }).click();

      console.log(await blog.innerHTML());

      const expandedBlog = page.locator(".blog").filter({
        hasText: "Blog a eliminar",
      });

      const deleteButton = expandedBlog.getByRole("button", { name: "delete" });

      await expect(deleteButton).toBeVisible();

      page.once("dialog", (dialog) => dialog.accept());

      await deleteButton.click();

      await expect(expandedBlog).toHaveCount(0);
    });

    test("only creator can see delete button", async ({ page, request }) => {
      // ======================
      // RESET + CREATE USERS
      // ======================
      
      await request.post("http://localhost:3003/api/testing/reset");

      const userA = {
        name: "User A",
        username: "usera",
        password: "passa",
      };

      const userB = {
        name: "User B",
        username: "userb",
        password: "passb",
      };

      await request.post("http://localhost:3003/api/users", { data: userA });
      await request.post("http://localhost:3003/api/users", { data: userB });

      await page.evaluate(() => localStorage.clear())
      await page.goto("http://localhost:5173");

      await page.getByLabel("Username").fill("usera");
      await page.getByLabel("Password").fill("passa");
      await page.getByRole("button", { name: "Login" }).click();

      // ======================
      // CREATE BLOG
      // ======================
      await page.getByRole("button", { name: "new blog" }).click();

      await page.getByLabel("Title").fill("Blog privado");
      await page.getByLabel("Author").fill("User A");
      await page.getByLabel("Url").fill("http://test.com");

      await page.getByRole("button", { name: "Create" }).click();

      const blog = page.locator(".blog").filter({
        hasText: "Blog privado",
      });

      await expect(blog).toBeVisible();

      await blog.getByRole("button", { name: "view" }).click();

      const deleteButtonA = blog.getByRole("button", { name: "delete" });
      await expect(deleteButtonA).toBeVisible();

      // ======================
      // LOGOUT (UI)
      // ======================
      await page.getByRole("button", { name: "Logout" }).click();

      // ======================
      // LOGIN USER B
      // ======================
      await page.getByLabel("Username").fill("userb");
      await page.getByLabel("Password").fill("passb");
      await page.getByRole("button", { name: "Login" }).click();

      // ======================
      // CHECK BLOG EXISTS
      // ======================
      const blogAfterLogin = page.locator(".blog").filter({
        hasText: "Blog privado",
      });

      await expect(blogAfterLogin).toBeVisible();

      await blogAfterLogin.getByRole("button", { name: "view" }).click();

      // ======================
      // USER B SHOULD NOT SEE DELETE
      // ======================
      const deleteButtonB = blogAfterLogin.getByRole("button", {
        name: "delete",
      });

      await expect(deleteButtonB).toHaveCount(0);
    });
   test('blogs are ordered by likes (most liked first)', async ({ page }) => {

  await createBlog(page, 'Blog menos likes', 'A', 'http://test.com')
  await createBlog(page, 'Blog medio likes', 'B', 'http://test.com')
  await createBlog(page, 'Blog mas likes', 'C', 'http://test.com')

  await openBlog(page, 'Blog menos likes')
  await likeBlog(page, 'Blog menos likes', 1)

  await openBlog(page, 'Blog medio likes')
  await likeBlog(page, 'Blog medio likes', 2)

  await openBlog(page, 'Blog mas likes')
  await likeBlog(page, 'Blog mas likes', 3)

  console.log(
 await page.locator('.blog').allTextContents()
)

  await expect.poll(async () => {
  return await page.locator('.blog').evaluateAll(blogs =>
    blogs.map(blog =>
      blog.childNodes[0].textContent.trim().split(' ')[0]
    )
  )
})

   })
  })
});
