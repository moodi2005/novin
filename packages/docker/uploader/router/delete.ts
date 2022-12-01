import { deleteFile } from "../middleware/delete.ts";
import { response } from '../middleware/response.ts';

export const deleteRouter = async (req: Request) => {

    // check path
    const path = req.url.split('/');
    if (path[path.length - 1] !== 'delete') return new Response(`Not Found`, { status: 404 });


    try {
        const { name, token, names } = await req.json();

        if (names) {
            const filesNotDelete: Record<string, string>[] = [];
            names.map((name: string) => {
                try {
                    deleteFile(name, token);
                } catch (error) {
                    filesNotDelete.push({ filename: name, error: error })
                }

            });

            if (filesNotDelete.length > 0) return response(false, { filesNotDelete }, 'Some files were not deleted');
            else return response(true, {}, 'ok');
        }
        if (name) {
            try {
              deleteFile(name, token);
              return response(true, {}, 'ok');
            } catch (error) {
               return response(false,{},error.message);
            }
        }

        return response(false, {}, 'not set name file');

    } catch (error) {
        return new Response(error, { status: 500 })
    }
}