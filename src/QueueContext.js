import React, {useState, createContext} from 'react';

export const QueueContext = createContext(null)

export default ({ children }) => {
  const [queue, setQueue] = useState([]);
  return <QueueContext.Provider value={{queue, setQueue}}>{children}</QueueContext.Provider>
}