import { response } from "../middleware/response.ts";
import { serve } from "../middleware/serve.ts";

export const getRouter = async (req: Request) => {
    const path = req.url.split('/');
    const name = path[path.length - 1];
    const qurys = req.url.split('?');
    const qury = qurys[1]?.split('=');
    
    if (!name) return new Response("404 Not Found", { status: 404 });
    try {
        const pathFile = serve(name, qury? qury[1] : '');

        if (!pathFile) return new Response("404 Not Found", { status: 404 });
        
        const file = await Deno.open(`./db/files/${pathFile}`, { read: true });
        
        const readableStream = file.readable;
        
        return new Response(readableStream);
        
    } catch (error) {
     return response(false,{},error.message);
    }
}