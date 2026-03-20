<img alt="Third Party Capital Logo" title="Third Party Capital Logo" src="https://user-images.githubusercontent.com/12476932/229881508-f9ef68db-8ee7-4795-8de8-80a50145bbd0.png" width="150">

# Third Party Capital

Third Party Capital is a resource that consolidates best practices for loading popular third-parties in a single place.

## Rationale

There is a large, cross-functional Chrome initiative that aims to improve third-party resource loading on the web. One part of this effort is to provide a default set of recommendations, or "components," to developers. These components will help developers sequence and fetch popular third-party resources at the right time to minimize their overall impact to page performance.

Instead of duplicating these recommendations in multiple places and expecting maintainers for each tool to keep them up to date, Third Party Capital consolidates them in a single repository with an API. This API makes it possible for consumers to import the recommendations directly within their tooling.

Here's a [demo](https://test-next-script-housseindjirdeh.vercel.app/) of a `@next/third-parties` package that shows how Next.js can import recommendations from Third Party Capital and re-export them as framework components at build-time.

## Schema

_Third Party Capital is an experimental library and its specification is subject to change._

The loading recommendation for each third-party resource is defined with the following JSON schema:

```
{
  id: string;
  description: string;
  website?: string;
  html?: {
    element: string;
    attributes: {
      [string]?: string,
      src?: {
        url: string;
        slugParam: string;
        params: Array<string>;  
      }
    };
  };
  stylesheets?: Array<string>;
  scripts?: Array<{
    url: string | {
      url: string;
      params: Array<string> ;
    };
    strategy: "server" | "client" | "idle" | "worker";
    location: "head" | "body";
    action: "append" | "prepend";
  };
}
```

These properties provide a heuristic for consumers to decide how, when, and where to load a particular third-party to minimize its impact on performance. Here are the details:

- **id** _(required)_: Identifier string
- **description** _(required)_: Short description of third-party entity
- **website** _(optional)_: URL address of website
- **html** _(optional<sup>\*</sup>)_: HTML element to be inserted where 3PC component is placed. The `attributes` property allows you to include a list of any default attributes and their values which will be overwritten if the user specifies a different value. The `src` attribute is the only property that needs to follow a specific structure:
  - **url**: The URL of the resource
  - **slugParam**: The name of the parameter that is used the user to either include or replace the slug of the URL
  - **params**: An array of parameter names that when used as arguments by the user are assigned as query parameters to the URL
- **stylesheets** _(optional<sup>\*</sup>)_: URLs of any stylesheets that need to be loaded
- **scripts** _(optional<sup>\*</sup>)_: URLs of any scripts that need to be loaded, either as an array of URLs or an object array that contains a list of the following properties:
  - **url**: The URL of script
  - **params**: An array of parameter names that when used as arguments by the user are assigned as query parameters to the URL
  - **strategy**: String literal to denote loading strategy of third-party script (on the server, on the client, during browser idle time, or in a web worker)
  - **location**: String literal to denote whether to inject the script in <head> or <body> (only useful if strategy=server is used)
  - **action**: String literal to denote whether to prepend or append the script (only useful if strategy=server is used)

_\* A value must be included for at least one of the main attributes (content, stylesheets, or scripts)_

## Supported Third Parties

_Third Party Capital is an experimental library and the list of supported third parties is subject to change._

The third-party resources that are currently provided in Third Party Capital, along with their suggested loading practices, are:

- **Google Analytics**: Off-load to a web worker
- **Google Maps (Embed)**: Use the `loading` attribute to lazy load the embed
- **YouTube Embed**: Use [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed)

Although the details are still being finalized, only a select number of third-parties that meet
certain usage criteria will be included. Please do not submit any requests to include new
third-parties.

## Limitations

Third Party Capital would be able to provide loading details for many third-parties, but some scenarios cannot be supported with the current schema:

- Third-parties that need to load early and block page rendering as a result (e.g. cookie consent forms, A/B testing providers)
- Third-parties that require developers to run code after certain user interactions (e.g. using reCAPTCHA and storing the final score for each request)
- Third-parties that require users to select between many different choices (e.g. selecting a particular font from Google Fonts)
