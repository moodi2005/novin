import { rejester } from '../middleware/rejster.ts';

export const PostRouter = async (req: Request) => {
    const path = req.url.split('/');
    try {
        const { _id, group, _private, level } = await req.json();
        switch (path[path.length - 1]) {
            case 'rejester': {
                const fileName = rejester(_id, group, _private, level);
                const body = {
                    ok: true,
                    body: {
                        fileName,
                    }
                }
                return new Response(JSON.stringify(body),
                    {
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        }
                    })
            }
            default:
                return new Response(`Not Found`, { status: 404 });
        }
    } catch (error) {
        return new Response(error, { status: 500 })
    }

}