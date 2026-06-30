import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import NewBlogForm from './NewBlogForm'

test('form calls addBlog with correct details when submitted', async () => {
  const mockCreate = vi.fn()

  const user = userEvent.setup()

  render(<NewBlogForm addBlog={mockCreate} />)

  // inputs
  const titleInput = screen.getByLabelText('Title')
  const authorInput = screen.getByLabelText('Author')
  const urlInput = screen.getByLabelText('Url')

  const sendButton = screen.getByText('Create')

  // escribir en inputs
  await user.type(titleInput, 'React testing')
  await user.type(authorInput, 'Miguel')
  await user.type(urlInput, 'https://test.com')

  // enviar formulario
  await user.click(sendButton)

  // verificar llamada
  expect(mockCreate.mock.calls).toHaveLength(1)

  // verificar datos enviados
  expect(mockCreate.mock.calls[0][0]).toEqual({
    title: 'React testing',
    author: 'Miguel',
    url: 'https://test.com',
  })
})
