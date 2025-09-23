interface ApiResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

interface ApiError {
  message: string
  status?: number
  statusText?: string
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string>
}

class ApiService {
  private static baseUrl: string = `http://${process.env.EXPO_PUBLIC_API_BASE_URL}:4000`
  private static defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  private static async handleResponse<T>(
    response: Response,
  ): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error: ApiError = {
        message: 'An error occurred during the request',
        status: response.status,
        statusText: response.statusText,
      }

      try {
        const errorData = await response.json()
        error.message = errorData.message || error.message
      } catch {
        console.log('Error parsing json', error)
      }

      throw error
    }

    const data = await response.json()
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    }
  }

  private static createUrl(
    endpoint: string,
    params?: Record<string, string>,
  ): string {
    const normalizedEndpoint = endpoint.startsWith('/')
      ? endpoint
      : `/${endpoint}`

    const url = new URL(normalizedEndpoint, this.baseUrl)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    return url.toString()
  }

  public static setBaseUrl(url: string): void {
    this.baseUrl = url.endsWith('/') ? url.slice(0, -1) : url
  }

  public static setAuthToken(token: string): void {
    this.defaultHeaders = {
      ...this.defaultHeaders,
      Authorization: `Bearer ${token}`,
    }
  }

  public static async get<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { params, headers, ...restConfig } = config
    const url = this.createUrl(endpoint, params)

    const response = await fetch(url, {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...headers },
      ...restConfig,
    })

    return this.handleResponse<T>(response)
  }

  public static async post<T>(
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { headers, ...restConfig } = config
    const url = this.createUrl(endpoint)

    const response = await fetch(url, {
      method: 'POST',
      headers: { ...this.defaultHeaders, ...headers },
      body: data ? JSON.stringify(data) : undefined,
      ...restConfig,
    })

    return this.handleResponse<T>(response)
  }

  public static async put<T>(
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { headers, ...restConfig } = config
    const url = this.createUrl(endpoint)

    const response = await fetch(url, {
      method: 'PUT',
      headers: { ...this.defaultHeaders, ...headers },
      body: data ? JSON.stringify(data) : undefined,
      ...restConfig,
    })

    return this.handleResponse<T>(response)
  }

  public static async delete<T>(
    endpoint: string,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const { headers, ...restConfig } = config
    const url = this.createUrl(endpoint)

    const response = await fetch(url, {
      method: 'DELETE',
      headers: { ...this.defaultHeaders, ...headers },
      ...restConfig,
    })

    return this.handleResponse<T>(response)
  }
}

export default ApiService
