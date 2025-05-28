/* eslint-disable react/prop-types */
import '../styles/PostList.scss';

function PostList({ posts, onDelete, onEdit }) {
  return (
    <div className="post-list">
      <h3>Посты</h3>
      {posts.length === 0 ? (
        <p>Нет постов</p>
      ) : (
        <ul>
          {posts.map((post) => {
            const publishDate = post.publishTime ? new Date(post.publishTime) : null;
            const publishDateStr = publishDate && !isNaN(publishDate)
              ? publishDate.toLocaleString()
              : 'Дата не указана';

            return (
              <li key={post.id} className="post-card">
                <p><strong>Текст:</strong> {post.content}</p>
                <p><strong>Тип медиа:</strong> {post.mediaType || 'Текст'}</p>

                {post.published ? (
                  <p className="published-label">
                    Опубликован в {publishDateStr}
                  </p>
                ) : (
                  <>
                    <p><strong>Дата публикации:</strong> {publishDateStr}</p>
                    <div className="actions">
                      <button onClick={() => onEdit(post)}>Редактировать</button>
                      <button onClick={() => onDelete(post.id)}>Удалить</button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default PostList;
