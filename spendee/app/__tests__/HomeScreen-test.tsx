import { render } from "@testing-library/react-native"

import HomeScreen from "@/app/index"

describe("<HomeScreen />", () => {
  test("HomeScreen component renders correctly", () => {
    const tree = render(<HomeScreen />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test("Text renders correctly on HomeScreen", () => {
    const { getByText } = render(<HomeScreen />)

    getByText("Welcome!")
  })
})
