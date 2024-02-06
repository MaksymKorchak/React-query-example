const fetchPosts = async (page) => {
    const response = await fetch(
        `http://localhost:3000/posts?_sort=-id&${
          page ? `_page=${page}&_per_page=5` : ""
        }`
    );
    const postData = await response.json();
    return postData;
};

const fetchTags = async() => {
    const response = await fetch(`http://localhost:3000/tags`);
    const tagData = await response.json();
    return tagData;
};

const addPost = async(post) => {
    const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
    })

    return response.json();
};

const deletePost = async (id) => {
    const response = await fetch(`http://localhost:3000/posts/31`, {
        method: "DELETE",
    });

    if(!response.ok) throw new Error("Failed to delete post");

    return response.json();
};

export {
    fetchPosts,
    fetchTags,
    addPost,
    deletePost,
}