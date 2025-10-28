import { useState, useEffect } from "react";

function CommentModal({ isOpen, onClose, onSubmit, lineNumber, existingComments, onDeleteComment }) {
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setCommentText("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (commentText.trim()) {
            onSubmit(commentText);
            setCommentText("");
        }
    };

    return (
        <div className="comment-modal-overlay">
            <div className="comment-modal">
                <div className="comment-modal-header">
                    <h3>Comments for line {lineNumber}</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                
                <div className="existing-comments">
                    {existingComments && existingComments.length > 0 ? (
                        existingComments.map(comment => (
                            <div key={comment._id} className="comment-item">
                                <div className="comment-header">
                                    <strong className="comment-author">{comment.author}</strong>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </span>
                                    <button 
                                        className="delete-comment"
                                        onClick={() => onDeleteComment(comment._id)}
                                        title="Delete comment"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="comment-content">{comment.content}</div>
                            </div>
                        ))
                    ) : (
                        <p className="no-comments">No comments yet for this line.</p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="comment-form">
                    <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        rows="3"
                    />
                    <div className="comment-buttons">
                        <button type="submit">Add Comment</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CommentModal;