/**
 * `data` must come from trusted, developer-controlled sources only (site
 * constants, never raw user input) — this renders via dangerouslySetInnerHTML.
 * The `<` escape prevents a stray "</script>" inside a string value from
 * breaking out of the script tag.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
