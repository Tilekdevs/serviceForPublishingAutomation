/* eslint-disable react/prop-types */

function PostList({ posts, onDelete }) {
  const getStatusColor = (published) => {
    if (published === true) return 'green';
    if (published === false) return 'gray';
    return 'black';
  };

  return (
    <div>
      <h3>Посты</h3>
      {Array.isArray(posts) && posts.length === 0 ? (
        <p>Нет постов</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <div>
                <p>{post.content}</p>
                <small style={{ color: getStatusColor(post.published) }}>
                  [{post.published ? 'published' : 'pending'}]
                </small>
              </div>
              <button onClick={() => onDelete(post.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostList;
