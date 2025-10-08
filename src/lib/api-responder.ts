import { NextResponse } from "next/server"

export function INTERNAL_apiResponse(context: string, response: ApiResponseCore, code?: number): NextResponse<ApiResponse> {
    return NextResponse.json({
        context,
        ...response,
    }, {
        status: code,
    })
}

export default function apiResponder(context: string) {
    return {
        apiResponse: (response: ApiResponseCore, code = 200) => INTERNAL_apiResponse(context, response, code),
    }
}
