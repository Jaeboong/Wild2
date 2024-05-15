//PostList.jsx
import React from "react";
import Post from "./Post";

function PostList(props){
    const { posts, onClickItem } = props;

    return (
        <tbody>
            {posts.map((post, index)=>{
                return(
                    <Post
                        key={post.id}
                        post = {post}
                        onClick={() => {
                            onClickItem(post);
                        }}
                    />
                );
            })}
        </tbody>
    );
}

export default PostList;