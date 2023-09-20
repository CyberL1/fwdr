import { existsSync } from "https://deno.land/std@0.202.0/fs/mod.ts";

interface Redirect {
  domain: {
    url: string;
    redirectAll: string;
  };
  paths: {
    [path: string]: string;
  };
}

const fwdr = (req: Request) => {
  const { pathname } = new URL(req.url);

  if (pathname === "/") return new Response("A simple redirect service");

  const filePath = `./redirects/${pathname.split("/")[1]}.json`;

  if (!existsSync(filePath)) return new Response(`Redirect ${pathname.split("/")[1]} not found`);

  const redirect: Redirect = JSON.parse(Deno.readTextFileSync(filePath));
  const path = pathname.split("/")[2];

  if (!path) return Response.redirect(redirect.domain.url);

  let url = `${redirect.domain.url}/`;

  if (redirect.domain.redirectAll) {
    url += path;
    return Response.redirect(url);
  }
  url += redirect.paths[path];

  if (!redirect.paths[path]) {
    return Response.redirect("Redirect not found");
  }

  return Response.redirect(url);
};

Deno.serve(fwdr);
