import { db_rejestered } from '../db_rejestered.ts';

import { pathFiles } from '../config.ts'

export const deleteFile = (name: string, token: string) => {

    const { apiRemove } = Deno.env.toObject();
    if (!apiRemove) throw new Error('! Not Set Apis Security !');

    const apiList: string[] = JSON.parse(apiRemove);
    

    const file = db_rejestered.getItemByKn('filename', name);

    if (!file) throw new Error('Not Exsit File');


    apiList.map(async (api: string) => {
        // Check TOken
        const response = await fetch(api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                'name': file.name,
                'group': file.group,
                'token': token
            })
        })

        if (response.status !== 200) throw new Error('Not get Status 200');

        const json = await response.json();

        if (json.ok) {

            try {
                await Deno.remove(pathFiles + file.path);
            } catch (error) {
                if (!(error instanceof Deno.errors.NotFound)) {
                    throw error;
                } else {
                    throw new Error('Not Remove File to path')
                }
            }

            return 'ok';
        }
    });
    throw new Error('Not Access');
}