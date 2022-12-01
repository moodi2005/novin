import { Server } from "https://deno.land/std@0.114.0/http/server.ts";
import { deleteRouter } from "../router/delete.ts";
import { getRouter } from "../router/get.ts";

import { PostRouter } from "../router/post.ts";
import {Putrouter} from '../router/put.ts';

let { Port } = Deno.env.toObject();

Port = Port ?? 8000


const server = new Server({
    addr: `:${Port}`, handler:  (req) => {

        switch (req.method) {
            case 'GET':
                return getRouter(req);
            case 'PUT':
               return Putrouter(req)
            case 'POST':
               return PostRouter(req);
            case 'DELETE':
               return deleteRouter(req);
            default:
                return new Response(``, { status: 404 });
        }
    }
});


console.log("\x1b[31m",`@webkn-uploader Started in Port:${Port}`);

await server.listenAndServe();