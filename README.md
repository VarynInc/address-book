# address-book

A web browser application to manage all your contacts in a simple modern UI built as a JavaScript browser application using modern JavaScript and ESM.

This is a "vibe-coded" app using GitHub Copilot. See [Address book design](./address-design.md) for the app designs and prompts used to generate this code.

## Development

Install dependencies

```bash
npm install
```

Run in development mode from localhost

```bash
npm run build
npm run dev
```

Open a browser to the URL shown in the console, typically `http://localhost:5173/`

## Deployment

See [Install.md](./INSTALL.md)

Check `./source/vite.config.js` for the `base` path used, this property must be set to the path the app will live on the website.

## License

[Apache 2.0](./LICENSE)
