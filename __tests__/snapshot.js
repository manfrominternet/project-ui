import { render } from '@testing-library/react'
import Page from '../src/pages/register'
 
it('renders homepage unchanged', () => {
  const { container } = render(<Page />)
  expect(container).toMatchSnapshot()
})