const { expect } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.goto('http://localhost:5173')

  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()

  await expect(
    page.getByText('Matti Luukkainen logged in')
  ).toBeVisible()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()

  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Author').fill(author)
  await page.getByLabel('Url').fill(url)

  await page.getByRole('button', { name: 'Create' }).click()

  await expect(
    page.locator('.blog').filter({ hasText: title })
  ).toBeVisible()
}

const openBlog = async (page, title) => {
  const blog = page.locator('.blog').filter({
    hasText: title
  })

  await blog.getByRole('button', { name: /view|hide/ }).click()
}

const likeBlog = async (page, title, likes = 1) => {

  for (let i = 1; i <= likes; i++) {

    const blog = page.locator('.blog').filter({
      hasText: title
    })

    await blog.getByRole('button', { name: 'like' }).click()

    await expect(
      blog.locator('.blog-likes')
    ).toContainText(`likes ${i}`)
  }
}

module.exports = {
  loginWith,
  createBlog,
  openBlog,
  likeBlog
}