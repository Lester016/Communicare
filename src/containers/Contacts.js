import axios from "axios";
import React, { useEffect, useState } from "react";

const Contacts = ({ onlineUsers, contactUser, userID }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios
      .get(
        `https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app/contacts/${userID}.json`
      )
      .then((response) => {
        setContacts(response.data !== null ? response.data : []);
      })
      .catch((error) => console.log("error catched"));
  }, []);

  const addContactHandler = (contactID, contactEmail) => {
    let updatedContacts = [
      ...contacts,
      { userID: contactID, email: contactEmail },
    ];
    axios
      .put(
        `https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app/contacts/${userID}.json`,
        updatedContacts
      )
      .then((response) => setContacts(updatedContacts))
      .catch((error) => console.log("error catched: ", error));
  };

  const removeContactHandler = (item) => {
    let updatedContacts = [...contacts];

    let index = updatedContacts.findIndex((x) => x.userID === item);
    if (index > -1) {
      updatedContacts.splice(index, 1); // 2nd parameter means remove one item only
    }

    axios
      .put(
        `https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app/contacts/${userID}.json`,
        updatedContacts
      )
      .then((response) => setContacts(updatedContacts))
      .catch((error) => console.log("error catched: ", error));
  };

  const isInContactsHandler = (array, item) => {
    for (let index = 0; index < array.length; index++) {
      const element = array[index].userID;

      if (element === item) {
        return true;
      }
    }
  };

  return (
    <div>
      <h3>Your Contacts</h3>
      <div style={{ border: "1px solid grey", marginBottom: 10 }}>
        {contacts.map((user) => (
          <div key={user.userID}>
            <p style={{ color: "blue" }}>{user.email}</p>
            <button onClick={() => contactUser(user.userID)}>Call</button>
            {console.log("CONTACTS: ", contacts)}
            <button onClick={() => removeContactHandler(user.userID)}>
              Remove in contacts
            </button>
          </div>
        ))}
      </div>

      <h3>Online Users</h3>
      {onlineUsers.map((user) => (
        <div
          key={user.userID}
          style={{ border: "1px dashed grey", marginBottom: 10 }}
        >
          {user.userID !== userID ? (
            <div>
              <p style={{ color: "brown" }}>{user.email}</p>
              <button onClick={() => contactUser(user.userID)}>Call</button>

              {!isInContactsHandler(contacts, user.userID) && (
                <button
                  onClick={() => addContactHandler(user.userID, user.email)}
                >
                  Add into contacts
                </button>
              )}
            </div>
          ) : (
            <p style={{ color: "green" }}>{user.email} (You)</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Contacts;
