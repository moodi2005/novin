FROM denoland/deno:alpine

EXPOSE 80

WORKDIR /app

USER deno

ADD . .
RUN deno cache deps.ts



CMD ["run", "-A", "./src/index.ts"]