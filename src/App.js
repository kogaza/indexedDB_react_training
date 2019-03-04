import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  state = {
    stateUsers: [
      {
        name: 'Leon',
        surname: 'Leonidas',
        age: 33,
        pesel: 123450
      },
      {
        name: 'Anna',
        surname: 'Klopsik',
        age: 19,
        pesel: 123451
      }
    ]
  }

  componentDidMount() {
    let request = indexedDB.open('Users', 1),
      db,
      tx,
      store,
      index;

    request.onupgradeneeded = function (e) {
      let db = request.result,
        store = db.createObjectStore('Kids', {autoIncrement: true}),
        index = store.createIndex('pesel', 'pesel', {unique: true});
    }

    request.onerror = function (e) {
      console.log('Error: ' + e.target.errorCode);
    };

    request.onsuccess = function (e) {
      db = request.result;
      tx = db.transaction('Kids', "readwrite");
      store = tx.objectStore('Kids');
      index = store.index('pesel');

      db.onerror = function (e) {
        console.log('ERROR ' + e.target.errorCode);
      }

      store.put({name: 'Ala', surname: 'Dola', age: 17, pesel: 123452});
      store.put({name: 'Paweł', surname: 'Kolano', age: 23, pesel: 123453});

      // store.delete(1);

      let u1 = store.get(1);
      let u2 = store.get(2);

      u1.onsuccess = function () {
        console.log(u1.result);
      }
      u2.onsuccess = function () {
        console.log(u2.result);
      }

      tx.oncomplete = function () {
        db.close();
      };
    };
  }

  addUser = (name, surname, age, pesel) => {
    console.log(name, surname, age, pesel);
    let request = indexedDB.open('Users', 1),
      db,
      tx,
      store,
      index;
    request.onsuccess = function (e) {
      db = request.result;
      tx = db.transaction('Kids', 'readwrite');
      store = tx.objectStore('Kids');
      index = store.index('pesel');

      store.put({name: name, surname: surname, age: age, pesel: pesel});

      tx.complete = function () {
        db.close();
      };
    };
    this.setState(
      prevState =>
        ({
          stateUsers: [...prevState.stateUsers, {name, surname, age, pesel}]
        }))

  }


  render() {
    let nameInput, surnameInput, ageInput, peselInput;


    const {stateUsers} = this.state;
    console.log('stateUSers', stateUsers);

    const usersList = stateUsers.map((user) => {
      return (
        <div key={user.pesel}>
          {user.name}, {user.surname}, {user.age}, {user.pesel}
        </div>
      )
    })


    return (
      <div className="App">
        <input name='name' placeholder='name' ref={text => nameInput = text}/>
        <input name='surname' placeholder='surname' ref={text => surnameInput = text}/>
        <input name='age' placeholder='age' ref={text => ageInput = text}/>
        <input name='pesel' placeholder='pesel' ref={text => peselInput = text}/>
        <button onClick={
          () => this.addUser(
            nameInput.value,
            surnameInput.value,
            parseInt(ageInput.value),
            parseInt(peselInput.value)
          )
        }>
          Add user
        </button>
        {usersList}
      </div>
    );
  }
}

export default App;
