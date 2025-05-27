/* eslint-disable react/prop-types */

function ChannelList({ channels, onDelete }) {
  return (
    <div>
      <h3>Каналы</h3>
      {channels.length === 0 ? (
        <p>Нет подключенных каналов</p>
      ) : (
        <ul>
          {channels.map((channel) => (
            <li key={channel.id}>
              <span>{channel.channelId}</span>
              <button onClick={() => onDelete(channel.id)}>Удалить</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


export default ChannelList;
