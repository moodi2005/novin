import { Server } from "https://deno.land/std@0.114.0/http/server.ts";
import multipartFormParser from "https://raw.githubusercontent.com/tylerlaceby/multipart/main/opine/mod.ts";
import { opine } from 'https://deno.land/x/opine@2.3.3/mod.ts';
import { exists } from "https://deno.land/std@0.162.0/fs/mod.ts";
import { multiParser, FormFile } from "https://deno.land/x/multiparser@0.114.0/mod.ts";
