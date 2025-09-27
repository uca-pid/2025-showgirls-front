import { fireEvent, render } from '@testing-library/react-native'
import { SignInForm } from '../../app/sign-in'

describe('<SignInForm />', () => {
  const result = render(<SignInForm />)
  it('should render correctly', () => {
    expect(result).toMatchSnapshot()
  })
  test("title shows up correctly and says 'Inciar sesión para continuar'", () => {
    const logintTitle = result.getByTestId('loginTitle')

    expect(logintTitle).toBe('Inciar sesión para continuar')
  })
})
