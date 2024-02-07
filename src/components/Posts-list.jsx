import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addPost, fetchPosts, fetchTags } from "../api";

const PostsList = () => {

    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    // Get Posts
    const { 
        data: postsData, 
        isLoading: postsIsLoading, 
        isError: postsIsError,
        error: postsError,
    } = useQuery({
        queryKey: ["posts", { page }],
        queryFn: () => fetchPosts(page),
        staleTime: 1000 * 60 * 5,
    });

    // Get Tags
    const { 
        data: tagsData, 
        isLoading: tagsIsLoading, 
        isError: tagsIsError,
        error: tagsError,
    } = useQuery({
        queryKey: ["tags"],
        queryFn: fetchTags,
        staleTime: Infinity,
    });

    // Add Post
    const { 
        mutate, 
        reset,
        isPending,
        isError: isPostError
    } = useMutation({
        mutationFn : addPost,
        onMutate: async () => {
            await queryClient.cancelQueries({
                queryKey: ["posts"],
                exact: true
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["posts"],
            });
        },
        onError: () => {},
        onSettled: () => {},
    });

    // Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const title = formData.get("title");
        const tags = [...formData.keys()].filter(key => formData.get(key) === "on");

        if(!title || !tags.length) return;

        mutate({ id: postsData?.items + 1, title, tags });
        e.target.reset();
    };

    return (
        <div className="container">

            {/* Add Post Form */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter your post.."
                    className="postbox"
                    name="title"
                />
                <div className="tags">
                    {tagsData?.map((tag) => {
                        return (
                        <div key={tag}>
                            <input name={tag} id={tag} type="checkbox" />
                            <label htmlFor={tag}>{tag}</label>
                        </div>
                        );
                    })}
                </div>
                <button disabled={isPending}>
                    {isPending ? "Posting..." : "Post"}
                </button>
            </form>
            {isPostError && <h5 onClick={() => reset()}>Unable to Post :(</h5>}
            {/* Add Post Form */}

            {/* Posts loading && error states */}
            {postsIsLoading && <p>Loading Posts...</p>}
            {postsIsError && <p>Error: {postsError?.message}</p>}
            {/* Posts loading && error states */}

            
            {/* Pagination */}
            <div className="pages">
                <button 
                    disabled={!postsData?.prev} 
                    onClick={() => setPage((prev) => Math.max(prev -1, 0))}>
                    Previous Page
                </button>
                <button>{page}</button>
                <button 
                    disabled={!postsData?.next} 
                    onClick={() => setPage((prev) => prev + 1)}>
                    Next Page
                </button>
            </div>
            {/* Pagination */}
             
            {/* Posts */}
            {postsData?.data?.map((post) => {
                return(
                    <div key={post.id} className="post">
                        <h3>{post.title}</h3>
                        {post.tags?.map((tag) => {
                            return <span key={tag}>{tag}</span>
                        })}
                    </div>
                )
            })}
            {/* Posts */}

        </div>
    )
};

export default PostsList;