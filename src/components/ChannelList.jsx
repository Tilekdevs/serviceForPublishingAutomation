/* eslint-disable react/prop-types */

function ChannelList({ channels }) {
  return (
    <div>
      <h3>Каналы</h3>
      <ul>
        {channels.map((ch) => (
          <li key={ch.id}>
            {ch.channelId} <button>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChannelList;