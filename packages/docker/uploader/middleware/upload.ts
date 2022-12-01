import { multiParser, FormFile } from "https://deno.land/x/multiparser@0.114.0/mod.ts";
import { exists } from "https://deno.land/std@0.162.0/fs/mod.ts";

import { pathFiles } from '../config.ts'


import { db_unRejester } from '../db_unrejster.ts'

export const upload = async (req: Request) => {

  const parsed = await multiParser(req);



  if (!parsed?.files) throw new Error('Not Exist File');

  try {
    const data: FormFile = Object.values(parsed.files)[0] as FormFile;

    const _exists = await exists(`${pathFiles}/${data.filename}`);
    if (_exists) {
        for (let i = 0; await exists(`${pathFiles}/${data.filename}`); i++) {
          data.filename = `${i}_${data.filename}`;
        }
    }

    //check Exist Directory if not exist mkdir
    if(!await exists(pathFiles)) {
        Deno.mkdirSync(pathFiles, { recursive: true })
    }
    
    const file = await Deno.open(`${pathFiles}/${data.filename}`, { create: true, write: true});
    
    file.writeSync(data.content);
    file.close();

    const record = db_unRejester.set({
      filename: data.filename,
      contentType: data.contentType,
      name: data.name,
      size: data.size/1000
    });

    return record._id;
  } catch (error) {
    throw error
  }
};