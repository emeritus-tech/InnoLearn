import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  // eslint-disable-next-line react/require-default-props
  children?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can use your own error logging service here
    // eslint-disable-next-line no-console
    console.log({ error, errorInfo })
  }

  render() {
    const { hasError } = this.state
    const { children } = this.props
    if (hasError) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>
    }
    return children
  }
}

export default ErrorBoundary
