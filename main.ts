const fwdr = () => {
  return new Response("A simple redirect service");
};

Deno.serve(fwdr);
