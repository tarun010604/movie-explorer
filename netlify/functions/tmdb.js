
export async function handler(event) {
  const apiKey = process.env.TMDB_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "TMDb API key is not configured." }),
    };
  }

  const params = event.queryStringParameters || {};
  const endpoint = params.endpoint || "";

  // Allow only the TMDb endpoints used by this application.
  const allowed =
    endpoint === "trending/movie/week" ||
    endpoint === "search/movie" ||
    endpoint === "genre/movie/list" ||
    /^movie\/\d+$/.test(endpoint);

  if (!allowed) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid movie API endpoint." }),
    };
  }

  const url = new URL(`https://api.themoviedb.org/3/${endpoint}`);
  url.searchParams.set("api_key", apiKey);

  for (const [key, value] of Object.entries(params)) {
    if (key !== "endpoint" && value) {
      url.searchParams.set(key, value);
    }
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "TMDb request failed." }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await response.json()),
    };
  } catch {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Could not connect to TMDb." }),
    };
  }
}
