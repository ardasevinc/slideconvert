# SlideConvert

## What

SlideConvert is a tool that converts PowerPoint presentations to PDFs.

## Development

In order to run the dev environment. You need to have

- bun (>=1)
- nodejs (>=22)
- docker & docker compose

Next, you need to fill out the env files in both slideconvert-web and slideconvert backend.

To run the backend (api, redis and unoserver) you can do:

```bash
docker compose --env-file ./apps/slideconvert-backend/.env up --build -d
```

or just run the script `bash run-backend.sh`.

Finally, you can run the frontend after backend is started successfully:

```bash
bun dev:frontend # run from the project root
```