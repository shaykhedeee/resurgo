// ═════════════════════════════════════════════════════════════════════════════════
// RESURGO — Product Hunt API Client
// Fetch data from Product Hunt API for social proof and integration
// ═════════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ProductHuntUser {
  id: number
  name: string
  username: string
  headline: string | null
  website_url: string | null
  twitter_username: string | null
  avatar_url: {
    URL: string
    '80': string
    '640': string
  }
}

export interface ProductHuntMediaItem {
  id: number
  image_url: {
    URL: string
    '128x128': string
    '256x256': string
    '640x640': string
  }
  video_url: string | null
}

export interface ProductHuntTag {
  display_name: string
  kind: string
  slug: string
}

export interface ProductHuntProduct {
  id: number
  name: string
  tagline: string
  description: string
  url: string
  redirect_url: string
  votes_count: number
  comments_count: number
  created_at: string
  updated_at: string
  maker: ProductHuntUser
  media: {
    images: ProductHuntMediaItem[]
    video: ProductHuntMediaItem | null
  }
  topics: {
    nodes: ProductHuntTag[]
  }
  thumbnail: {
    URL: string
    '80': string
    '640': string
  }
}

export interface ProductHuntComment {
  id: number
  body: string
  created_at: string
  user: ProductHuntUser
  votes_count: number
}

export interface ProductHuntPostsResponse {
  data: {
    Post: ProductHuntProduct | null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const PH_API_BASE = 'https://api.producthunt.com/v2/api/graphql'
const PH_DEVELOPER_TOKEN = process.env.PRODUCT_HUNT_DEVELOPER_TOKEN

// ─────────────────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────────────────

async function fetchPHGraphQL(query: string, variables = {}): Promise<any> {
  if (!PH_DEVELOPER_TOKEN) {
    console.warn('[ProductHunt] PRODUCT_HUNT_DEVELOPER_TOKEN not configured')
    return null
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)

  try {
    const res = await fetch(PH_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${PH_DEVELOPER_TOKEN}`,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      throw new Error(`Product Hunt API error: ${res.status}`)
    }

    return await res.json()
  } catch (err) {
    console.error('[ProductHunt] API request failed:', err)
    throw err
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get Product Hunt product by name
 * @param productName The product name/slug (e.g., "resurgo")
 */
export async function getProductByName(
  productName: string
): Promise<ProductHuntProduct | null> {
  try {
    const query = `
      query GetPost($name: String!) {
        Post(slug: $name) {
          id
          name
          tagline
          description
          url
          redirect_url
          votes_count
          comments_count
          created_at
          updated_at
          maker {
            id
            name
            username
            headline
            website_url
            twitter_username
            avatar_url {
              URL
              "80"
              "640"
            }
          }
          media {
            images {
              id
              image_url {
                URL
                "128x128"
                "256x256"
                "640x640"
              }
              video_url
            }
            video {
              id
              image_url {
                URL
                "128x128"
                "256x256"
                "640x640"
              }
              video_url
            }
          }
          topics {
            nodes {
              display_name
              kind
              slug
            }
          }
          thumbnail {
            URL
            "80"
            "640"
          }
        }
      }
    `

    const variables = { name: productName }
    const data = await fetchPHGraphQL(query, variables)

    if (!data || !data.data || !data.data.Post) {
      return null
    }

    return data.data.Post
  } catch (err) {
    console.error('[ProductHunt] Failed to get product by name:', err)
    return null
  }
}

/**
 * Get Product Hunt product by ID
 * @param postId The Product Hunt post ID
 */
export async function getProductById(
  postId: number
): Promise<ProductHuntProduct | null> {
  try {
    const query = `
      query GetPost($id: ID!) {
        Post(id: $id) {
          id
          name
          tagline
          description
          url
          redirect_url
          votes_count
          comments_count
          created_at
          updated_at
          maker {
            id
            name
            username
            headline
            website_url
            twitter_username
            avatar_url {
              URL
              "80"
              "640"
            }
          }
          media {
            images {
              id
              image_url {
                URL
                "128x128"
                "256x256"
                "640x640"
              }
              video_url
            }
            video {
              id
              image_url {
                URL
                "128x128"
                "256x256"
                "640x640"
              }
              video_url
            }
          }
          topics {
            nodes {
              display_name
              kind
              slug
            }
          }
          thumbnail {
            URL
            "80"
            "640"
          }
        }
      }
    `

    const variables = { id: postId }
    const data = await fetchPHGraphQL(query, variables)

    if (!data || !data.data || !data.data.Post) {
      return null
    }

    return data.data.Post
  } catch (err) {
    console.error('[ProductHunt] Failed to get product by ID:', err)
    return null
  }
}

/**
 * Get comments for a Product Hunt post
 * @param postId The Product Hunt post ID
 * @param limit Maximum number of comments to return (default: 10)
 */
export async function getPostComments(
  postId: number,
  limit: number = 10
): Promise<ProductHuntComment[]> {
  try {
    const query = `
      query GetPostComments($id: ID!, $limit: Int!) {
        Post(id: $id) {
          comments(first: $limit) {
            edges {
              node {
                id
                body
                created_at
                user {
                  id
                  name
                  username
                  headline
                  avatar_url {
                    URL
                    "80"
                    "640"
                  }
                }
                votes_count
              }
            }
          }
        }
      }
    `

    const variables = { id: postId, limit }
    const data = await fetchPHGraphQL(query, variables)

    if (!data || !data.data || !data.data.Post?.comments?.edges) {
      return []
    }

    return data.data.Post.comments.edges.map((edge: any) => edge.node)
  } catch (err) {
    console.error('[ProductHunt] Failed to get post comments:', err)
    return []
  }
}

/**
 * Format Product Hunt date string to relative time
 * @param dateString ISO date string from Product Hunt API
 */
export function formatPHDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      if (diffMinutes === 0) {
        return 'just now'
      }
      return `${diffMinutes}m ago`
    }
    return `${diffHours}h ago`
  }

  if (diffDays === 1) {
    return 'yesterday'
  }

  if (diffDays < 7) {
    return `${diffDays}d ago`
  }

  if (diffDays < 30) {
    const diffWeeks = Math.floor(diffDays / 7)
    return `${diffWeeks}w ago`
  }

  const diffMonths = Math.floor(diffDays / 30)
  if (diffMonths < 12) {
    return `${diffMonths}mo ago`
  }

  const diffYears = Math.floor(diffDays / 365)
  return `${diffYears}y ago`
}
