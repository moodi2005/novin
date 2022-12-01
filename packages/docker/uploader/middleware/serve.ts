import { db_rejestered } from '../db_rejestered.ts';


export const serve = (name: string,token?:string) => {
    const file = db_rejestered.getItemByKn('path', name);

    if (!file) throw new Error('Not Exsit File');

    if (!file.private) {
        return file.path;
    } else {
        const { apiServer } = Deno.env.toObject();
        
        if (!apiServer) throw new Error('! Not Set Apis Security !');

        const apiList: string[] = JSON.parse(apiServer);


        apiList.map(async (api: string) => {
            // Check TOken
            const response = await fetch(api, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    'name': file.name,
                    'group': file.group,
                    'token':token
                })
            })

            if (response.status !== 200) throw new Error('Not get Status 200');

            const json = await response.json();

            if (json.ok) return file.path;
        });

        throw new Error ('Not Access');
    }
}