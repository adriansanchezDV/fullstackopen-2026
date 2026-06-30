import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import  {vi} from 'vitest'

test('renderiza título y autor, pero no url ni likes por defecto', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com',
    likes: 7,
  }

  const user = { username: 'testuser' }

  const { container } = render(
    <Blog
      blog={blog}
      user={user}
      likeBlog={() => {}}
      deleteBlog={() => {}}
    />
  )

  // SOLO vista compacta (la visible)
  const div = container.querySelector('.blog-summary')

  expect(div).toHaveTextContent('React patterns')
  expect(div).toHaveTextContent('Michael Chan')

})

test('al hacer click en view se muestran url y likes', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com',
    likes: 7,
  }

  const user = userEvent.setup()

  render(
    <Blog
      blog={blog}
      user={{ username: 'testuser' }}
      likeBlog={() => {}}
      deleteBlog={() => {}}
    />
  )

  // 1. buscar botón view
  const button = screen.getByText('view')

  // 2. click
  await user.click(button)

  // 3. ahora deberían aparecer los detalles
  expect(screen.getByText('https://reactpatterns.com')).toBeDefined()
  expect(screen.getByText('likes 7')).toBeDefined()
})

test('like button calls event handler twice when clicked twice', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com',
    likes: 7,
  }

  const mockHandler = vi.fn()

  const user = userEvent.setup()

  render(
    <Blog
      blog={blog}
      user={{ username: 'testuser' }}
      likeBlog={mockHandler}
      deleteBlog={() => {}}
    />
  )

  // abrir detalles
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  // botón like
  const likeButton = screen.getByText('like')

  // dos clicks
  await user.click(likeButton)
  await user.click(likeButton)

  // comprobación final
  expect(mockHandler.mock.calls).toHaveLength(2)
})