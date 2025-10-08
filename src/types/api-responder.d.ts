interface ApiResponseCore {
    success: boolean
    message: string
    data?: any
}

interface ApiResponse extends ApiResponseCore {
    context: string
}
