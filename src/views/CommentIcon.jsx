function CommentIcon({ onClick, commentCount }) {
    return (
        <span 
            className="comment-icon" 
            onClick={onClick}
            title={commentCount > 0 ? `${commentCount} comment(s)` : "Add comment"}
        >
            <i className="fa-regular fa-comment"></i>
            {commentCount > 0 && (
                <span className="comment-count">{commentCount}</span>
            )}
        </span>
    );
}

export default CommentIcon;