// src/services/anilist.js

const ANILIST_API_URL = 'https://graphql.anilist.co';

// This is the "question" we are sending to the database:
// "Give me the top 10 trending anime, with their ID, title, cover image, and average score."
const TRENDING_QUERY = `
query {
  Page(perPage: 60) {
    media(sort: TRENDING_DESC, type: ANIME) {
      id
      title {
        english
        romaji
      }
      coverImage {
        extraLarge
      }
      averageScore
      bannerImage
    }
  }
}
`;

export async function fetchTrendingAnime() {
    try {
        const response = await fetch(ANILIST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: TRENDING_QUERY
            })
        });

        const data = await response.json();

        // If the API call worked, return the list of anime
        if (data.data && data.data.Page) {
            return data.data.Page.media;
        } else {
            throw new Error('No data found');
        }

    } catch (error) {
        console.error("Error fetching anime:", error);
        return []; // Return an empty list if it fails so the app doesn't crash
    }
}

export async function fetchAnimeByTitles(titles) {
    if (!titles || titles.length === 0) return [];

    // Construct a query that searches for multiple anime by title
    // AniList GraphQL doesn't have a simple "search by array of titles" 
    // but we can use aliases or Page with search.
    // However, the cleanest way for a small list is likely independent queries or a Page filter if supported.
    // Page filter 'search' only takes one string.
    // So we need to use aliases to request multiple Media in one query, 
    // OR just loop (simpler for now, though aliases are better for network).
    // Given the task is simple, let's use aliases which is a standard GraphQL pattern 
    // or just 'in' operator if we had IDs. We don't have IDs.

    // Actually, AniList API is powerful. We can try to map over titles and fetch.
    // To respect rate limits and keep it simple as requested:
    // Let's simple create a query with aliases for each title.

    // BUT, writing a dynamic alias query here might be error prone without testing.
    // simpler approach:
    // use `Page` with `search` argument inside a loop? No, that's N requests.

    // Better approach:
    // Construct a query with multiple fields aliased.
    /*
      query {
        t0: Media(search: "Name1", type: ANIME) { ... }
        t1: Media(search: "Name2", type: ANIME) { ... }
      }
    */

    const queryParts = titles.map((title, index) => {
        // Safe string for GraphQL: escape double quotes
        const safeTitle = title.replace(/"/g, '\\"');
        return `
        t${index}: Media(search: "${safeTitle}", type: ANIME) {
            id
            title {
                english
                romaji
            }
            coverImage {
                extraLarge
            }
            averageScore
            bannerImage
        }
    `}).join('\n');

    const query = `
        query {
            ${queryParts}
        }
    `;

    console.log("AniList Query:", query); // Debugging

    try {
        const response = await fetch(ANILIST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        console.log("AniList Response:", data); // Debugging

        if (data.data) {
            // Convert object { t0: {...}, t1: {...} } back to array
            return Object.values(data.data);
        } else {
            console.error("Anilist errors:", data.errors);
            return [];
        }
    } catch (error) {
        console.error("Error fetching specific anime:", error);
        return [];
    }
}


const DETAILS_QUERY = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title {
      english
      romaji
    }
    coverImage {
      extraLarge
    }
    bannerImage
    description
    averageScore
    genres
    episodes
    status
    format
    season
    seasonYear
    studios(isMain: true) {
      nodes {
        name
      }
    }
    recommendations(sort: RATING_DESC, perPage: 6) {
      nodes {
        mediaRecommendation {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
          averageScore
        }
      }
    }
    relations {
      edges {
        relationType
        node {
          id
          type
        }
      }
    }
  }
}
`;

export async function fetchAnimeDetails(id) {
    try {
        const response = await fetch(ANILIST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: DETAILS_QUERY,
                variables: { id: id }
            })
        });

        const data = await response.json();
        return data.data?.Media;

    } catch (error) {
        console.error("Error fetching details:", error);
        return null;
    }
}

export async function fetchGenres() {
    const query = `
    query {
        GenreCollection
    }
    `;

    try {
        const response = await fetch(ANILIST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query })
        });

        const data = await response.json();
        return data.data?.GenreCollection || [];
    } catch (error) {
        console.error("Error fetching genres:", error);
        return [];
    }
}

export async function fetchAnimeByGenre(genre, perPage = 5) {
    const query = `
    query ($genre: String, $perPage: Int) {
        Page(perPage: $perPage) {
            media(genre: $genre, sort: POPULARITY_DESC, type: ANIME) {
                id
                title {
                    english
                    romaji
                }
                coverImage {
                    extraLarge
                }
                averageScore
            }
        }
    }
    `;

    try {
        const response = await fetch(ANILIST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { genre, perPage }
            })
        });

        const data = await response.json();
        return data.data?.Page?.media || [];
    } catch (error) {
        console.error(`Error fetching anime for genre ${genre}:`, error);
        return [];
    }
}


const INSTANT_SEARCH_QUERY = `
query ($search: String) {
  Page(perPage: 5) {
    media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
      id
      title {
        english
        romaji
      }
      coverImage {
        medium
      }
      format
      startDate {
        year
      }
      averageScore
    }
  }
}
`;

export async function searchAnime(query) {
    try {
        const response = await fetch(ANILIST_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: INSTANT_SEARCH_QUERY,
                variables: { search: query }
            })
        });

        const data = await response.json();
        return data.data?.Page?.media || [];
    } catch (error) {
        console.error("Instant search error:", error);
        return [];
    }
}