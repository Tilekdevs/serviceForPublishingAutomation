/* eslint-disable react/prop-types */
import '../styles/PostCard.scss';

function PostCard({ post, onDelete, onEdit }) {
  const isPublished = post.status === 'published';

  return (
    <div className="post-card">
      <p><strong>Текст:</strong> {post.content}</p>
      <p><strong>Дата публикации:</strong> {new Date(post.publishAt).toLocaleString()}</p>
      {post.mediaType && <p><strong>Тип медиа:</strong> {post.mediaType}</p>}

      {isPublished ? (
        <p className="published-label">Опубликовано</p>
      ) : (
        <div className="post-card-actions">
          <button onClick={() => onEdit(post)}>Редактировать</button>
          <button onClick={() => onDelete(post._id)}>Удалить</button>
        </div>
      )}
    </div>
  );
}

export default PostCard;
