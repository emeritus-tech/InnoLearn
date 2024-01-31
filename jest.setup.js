import '@testing-library/jest-dom/extend-expect'

global.fetch = jest.fn(() => console.log('Fetch mock'))
