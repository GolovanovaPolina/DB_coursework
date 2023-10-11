import {render, screen} from './sum/utils'
import App from './App'

describe('Input', async () => {
  it('should render the input', () => {
    render(
        <App/>,
  )
    expect(screen.getByText('Hello!')).toBeInTheDocument()
  })

})
