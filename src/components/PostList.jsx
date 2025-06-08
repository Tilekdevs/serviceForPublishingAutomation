/* eslint-disable react/prop-types */
import '../styles/PostList.scss'

const tryParseDate = (str) => {
  if (!str) {
    return null;
  }
  if (/^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/.test(str)) {
    const [datePart, timePart] = str.split(' ');
    const [dd, MM, yyyy] = datePart.split('.').map(Number);
    const [HH, mm] = timePart.split(':').map(Number);
    const date = new Date(Date.UTC(yyyy, MM - 1, dd, HH, mm));
    date.setHours(date.getHours() + 6);
    return date;
  }
  const d = new Date(str);
  if (!isNaN(d)) {
    d.setHours(d.getHours() + 6);
    return d;
  }
};

function PostList({ posts, onDelete, onEdit }) {

  return (
    <div className='post-list'>
      <h3>Посты</h3>
      {posts.length === 0 ? (
        <p>Нет постов</p>
      ) : (
        <ul>
          {posts.map(post => {
            const publishDate = post.publishTime ? tryParseDate(post.publishTime) : null;

            const publishDateStr =
              publishDate && !isNaN(publishDate)
                ? publishDate.toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })
                : 'Дата не указана';

            return (
              <li key={post.id} className='post-card'>
                <p>
                  <strong>Текст:</strong> {post.content}
                </p>
                <p>
                  <strong>Тип медиа:</strong> {post.mediaType || 'Текст'}
                </p>
                <p>
                  <strong>Часовой пояс:</strong> {Intl.DateTimeFormat().resolvedOptions().timeZone}
                </p>

                {post.published ? (
                  <p className='published-label'>
                    Опубликован в {publishDateStr}
                  </p>
                ) : (
                  <>
                    <p>
                      <strong>Дата публикации:</strong> {publishDateStr}
                    </p>
                    <div className='actions'>
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