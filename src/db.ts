import postgres from "postgres";

/**
 * Server-only handle to the PostgreSQL database.
 * The connection string comes from `DATABASE_URL`, which should be set on the
 * server runtime (not in browser/client code). This preserves the existing
 * server-side SQL architecture while switching the underlying driver to a
 * standard PostgreSQL client compatible with Supabase-managed Postgres.
 *
 * Use it only inside a `createServerFn()` handler or an `src/routes/api/*` route
 * (never client code):
 *
 *   const getPosts = createServerFn().handler(async () => {
 *     const rows = await sql()`select id, title, created_at from posts`;
 *     return rows.map((r) => ({ ...r, created_at: String(r.created_at) }));
 *   });
 */
export const sql = () => {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set — set the server-side PostgreSQL connection string before running queries."
    );
  }

  return postgres(url, {
    ssl: "require",
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });
};
