import { upload } from '../middleware/upload.ts';



export const Putrouter = async (req: Request) => {
    const path = req.url.split('/');
    try {
        switch (path[path.length - 1]) {
            case 'upload':
                if (
                    req.headers.has("content-type") &&
                    req.headers.get("content-type")?.startsWith("multipart/form-data")
                ) {
                    const file = await upload(req);
                    const body = {
                        ok: true,
                        body: {
                            _id: file
                        }
                    }
                    return new Response(JSON.stringify(body),
                        {
                            headers: {
                                "Content-Type": "application/json; charset=utf-8"
                            }
                        })
                }
                return new Response(`Not Found`, { status: 404 });
            default:
                return new Response(`Not Found`, { status: 404 });
        }
    } catch (error) {
        console.error(error);
        return new Response('error', { status: 500 });
    }
}
