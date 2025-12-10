import { NextRequest } from "next/server"
import apiResponder from "@/lib/api-responder"

const CHEAT_CODES: Record<string, string> = {
    "dvd": `
        <style>
            #dvd {
                width: 394px;
                position: fixed;
                z-index: 10000;
                animation: bounceX 9s linear infinite alternate,
                        bounceY 7s linear infinite alternate;
            }

            @keyframes bounceX {
                0% { left: 0; }
                100% { left: calc(100vw - 394px); }
            }

            @keyframes bounceY {
                0% { top: 0; }
                100% { top: calc(100vh - 394px / 2); }
            }
        </style>
        <img id="dvd" src="https://bouncingdvdlogo.com/logos/dvdlogo-03.svg" />
    `,
    "lazy": `
        <style>
            * {
                font-family: serif !important;
            }
        </style>
    `,
    "fever": `
        <style>
            * {
                background-color: yellow !important;
                color: red !important;
            }
        </style>
    `,
    "mcqueen": `
        <style>
            html,
            body {
                background-image: url(/mcqueen.jpg) !important;
                background-size: cover !important;
                background-attachment: fixed !important;
                background-position: center !important;
            }
        </style>
    `,
    "1990": `
        <style>
            * {
                background-color: blue !important;
                color: yellow !important;
            }
        </style>
    `
}

export async function POST(request: NextRequest) {
    const {
        code,
    } = await request.json() as {
        code: string | null
    }
    const responder = apiResponder("get-post")

    if (!code || code.trim() == "")
        responder.apiResponse({
            success: false,
            message: "Invalid request body",
        }, 400)

    const safeCode = code!.toLowerCase().trim()

    if (!CHEAT_CODES[safeCode])
        return responder.apiResponse({
            success: false,
            message: "Cheat code not recognized",
        }, 404)

    return responder.apiResponse({
        success: true,
        message: "Cheat code recognized",
        data: `${safeCode}|${CHEAT_CODES[safeCode].replace(/[\r\n\t]/g, "")}`,
    })
}
