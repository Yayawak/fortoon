import { ResultSetHeader } from 'mysql2';
import { RowDataPacket } from 'mysql2';
import { dbConnection } from "@/db/dbConnector";

// Modify the createPost function to accept postType and refId
export async function createPost(
    title: string,
    content: string,
    parentPostId: number | null,
    userId: number,
    postType: string,
    refId: number | null
): Promise<number> {
    try {
        // Insert the post with the new postType and refId
        const [result] = await dbConnection.execute<ResultSetHeader>(
            `INSERT INTO Post (title, content, parentPostId, posterId, refType, refId)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [title, content, parentPostId, userId, postType, refId]
        );

        // MySQL2 returns a result set with an insertId property
        const insertId = result.insertId;
        return insertId;

    } catch (error) {
        console.error("Error creating post:", error);
        throw new Error("Could not create post.");
    }
}

// Helper function to add images to a post
export async function addImagesToPost(postId: number, imageUrls: string[]) {
    const imageInserts = imageUrls.map(async (url) => {
        await dbConnection.execute(`
            INSERT INTO PostImage (url, postId) VALUES (?, ?)
        `, [url, postId]);
    });
    await Promise.all(imageInserts); // Ensure all image inserts are completed
}

// Helper function to delete all images associated with a post
export async function deleteAllImagesForPost(postId: number) {
    await dbConnection.execute(`
        DELETE FROM PostImage WHERE postId = ?
    `, [postId]);
}


// Helper function to retrieve all posts from the database
export async function getAllPosts() {
    const [posts] = await dbConnection.execute<RowDataPacket[]>(`
        SELECT 
            p.pId, p.title, p.content, p.parentPostId, p.posterId, p.createdAt, p.hidden,
            GROUP_CONCAT(pi.url) AS images,
            u.displayName as posterName,
            COUNT(DISTINCT pint.likerId) as likeCount
        FROM Post p
        LEFT JOIN PostImage pi ON p.pId = pi.postId
        LEFT JOIN User u ON p.posterId = u.uId
        LEFT JOIN PostInteraction pint ON p.pId = pint.postId
        GROUP BY p.pId
        ORDER BY p.createdAt DESC
    `);

    // Return the list of posts with their associated images
    return posts;
}


// Helper function to retrieve a parent post by its ID
export async function getParentPostById(parentPostId: number) {
    const [rows]: [RowDataPacket[], any] = await dbConnection.execute(`
        SELECT * FROM Post WHERE pId = ?
    `, [parentPostId]);

    // Return the post if found, otherwise return null
    return rows.length > 0 ? rows[0] : null; 
}



export function structurePosts(posts: any[]): any[] {
    const postMap: { [key: number]: any } = {};
    const treePosts: any[] = [];

    // Initialize the postMap with posts
    posts.forEach(post => {
        // Convert images from a comma-separated string to an array
        post.images = post.images ? post.images.split(',') : []; // Split the string into an array or set to empty if no images

        // Ensure likeCount is a number
        post.likeCount = parseInt(post.likeCount) || 0;

        post.children = []; // Initialize an array for children
        postMap[post.pId] = post; // Map post by its ID
    });

    // Populate the treePosts and establish parent-child relationships
    posts.forEach(post => {
        if (post.parentPostId === null) {
            // Top-level post
            treePosts.push(post);
        } else {
            // Child post
            const parentPost = postMap[post.parentPostId];
            if (parentPost) {
                parentPost.children.push(post); // Add child to parent
            }
        }
    });

    return treePosts;
}

export function filterHiddenPostData(post: any) {
    // Define properties that should always be included
    const baseProperties = ['pId', 'posterId', 'createdAt', 'hidden'];
    // Define properties that should be removed when post is hidden
    const hiddenSensitiveProperties = ['title', 'content', 'images'];

    // Create filtered post by copying all properties from original post
    const filteredPost = Object.entries(post)
        .reduce((acc, [key, value]) => {
            // Skip children as it needs special handling
            if (key === 'children') return acc;
            acc[key] = value;
            return acc;
        }, {} as any);

    // Handle children separately due to recursive nature
    filteredPost.children = post.children?.map((child: any) => 
        filterHiddenPostData(child)
    ) || [];

    // Remove sensitive properties if post is hidden
    if (post.hidden === 1) {
        hiddenSensitiveProperties.forEach(prop => {
            delete filteredPost[prop];
        });
    }

    return filteredPost;
}



export async function checkUserOwnPost(postId: string, userId: string): Promise<boolean> {
    const [postCheckRes] = await dbConnection.execute<RowDataPacket[]>(`
        SELECT * FROM Post WHERE pId = ? AND posterId = ?
    `, [postId, userId]);

    return postCheckRes.length > 0;
}