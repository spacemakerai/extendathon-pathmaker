# Extension hackathon: Finding desired paths

This extension is built using the
**[Forma SDK for Javascript](https://aps.autodesk.com/en/docs/forma/v1/embedded-views/introduction/)**
using an _**Embedded View**_ in the _**Right hand side analysis panel**_.
We recommend checking out the link to learn more about creating extensions and
to access the full API reference of the SDK.

This extension can be accessed by all users of Forma by activating it in the
Forma extensions menu. It is automatically deployed and hosted from this repo. 

- [Motivation](#motivation)
- [How was this built](#how-was-this-built)
  - [File structure](#file-structure)
  - [Styling](#styling)
- [Local testing](#local-testing)
- [Deployment and hosting](#deployment-and-hosting)
- [Contributing](#contributing)

## Motivation

What paths do people actually take when walking from their home to a point of interest, such as a shop or a bus stop? 
Do they create shortcuts, and should you as an architect perhaps take this into account when creating paths and roads?

## How was this built

The extension was built in a [vite](https://vitejs.dev/) +
[preact](https://preactjs.com/) framework to enable
[typescript](https://www.typescriptlang.org/),
[React components](https://react.dev/) and other features which are typical in a
modern web developers toolbox.

### File structure

Most of the top-level files in this repository are configurators etc. All source
code is in the `src/` directory, but the entry-point for our extension is
`index.html`. The most important part of it is the body, which includes the
main typescript file:

```html
<body>
  <div id="app"></div>
  <script type="module" src="./src/main.tsx"></script>
</body>
```

In `src/main.tsx`, we just use `preact` to render the `<App />` component
defined in `src/app.tsx`. For most intents, the latter file is a useful starting
point for making changes to the extension:

All subcomponents used within the app live in
`src/components/`.

It is also worth noting that the Forma SDK is added as a dependency in `package.json` and automatically installed by using `yarn`:

```json
  "dependencies": {
    "file-saver": "^2.0.5",
    "forma-embedded-view-sdk": "^0.15.0",
    "jszip": "3.10.1",
    "lodash": "^4.17.21",
    "luxon": "^3.4.3",
    "preact": "^10.17.1"
  },
```


### Styling

In order to achieve consistent styling with the rest of the Forma app, we utilise web components from the [Autodesk Forma Design System](https://app.autodeskforma.eu/design-system/v2/docs/). Follow the link to access a Storybook with extensive overview of available components and examples of usage. 

Relevant resources are included in `index.html`:

```html
<head>
  <link
    rel="stylesheet"
    href="https://app.autodeskforma.eu/design-system/v2/forma/styles/base.css"
  />
  <link rel="stylesheet" href="./src/styles.css"/>
  <script
    type="module"
    src="https://app.autodeskforma.eu/design-system/v2/weave/components/button/weave-button.js"
  ></script>
  <script
    type="module"
    src="https://app.autodeskforma.eu/design-system/v2/weave/components/dropdown/weave-select.js"
  ></script>
  <title>Pathmaker</title>
</head>
```

Extension-specific styling is found in `src/styles.css`, while `src/lib/weave.d.ts` hold type declarations to enable working with the relevant web components in typescript: 

```ts
export declare module "preact/src/jsx" {
  namespace JSXInternal {
    interface IntrinsicElements {
      "weave-button": JSX.HTMLAttributes<HTMLElement> & {
        type?: "button" | "submit" | "reset"
        variant?: "outlined" | "flat" | "solid"
        density?: "high" | "medium"
        iconposition?: "left" | "right"
      },
      "weave-select": JSX.HTMLAttributes<HTMLElement> & {
        placeholder?: any
        value: any
        children: JSX.Element[]
        onChange: (e: CustomEvent<{ value: string; text: string }>) => void
      }
      "weave-select-option": JSX.HTMLAttributes<HTMLElement> & {
        disabled?: true
        value: any
        children?: JSX.Element | string
      }
    }
  }
}
```

## Local testing

In order to work with this extension locally, make sure you have the
[local testing extension](https://aps.autodesk.com/en/docs/forma/v1/embedded-views/getting-started/#local-testing-extension)
for Forma installed. Install dependencies using

```shell
yarn install
```

and then you just need to run

```shell
yarn start
```

Your local version of this extension should now be running on port `8081`, and
the content should be available by clicking the _**Local testing**_ icon the
right hand side analysis menu in Forma.

## Deployment and hosting 

This extension is updated using continuous integration and deployment. In practice, each commit to the `main` branch of this repo triggers [GitHub Actions](https://docs.github.com/en/actions) to build the static files, upload them to [GitHub pages](https://pages.github.com/) and finally deploy the changes so that the update reaches end users within a minute of the commit. 

Check out the workflows in `.github/workflows/test-build-deploy.yml` to learn more about how this has been configured -- it consitutes a simple example of how to do CI/CD to get you started if you want to do something similar. 

## Contributing

We welcome pull requests with suggestions for improvements from all contributors!

