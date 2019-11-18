import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';
import uniq from 'lodash.uniq';
import './App.css';

function App() {

  const [numbers, setNumbers] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [inputEntries, setInputs] = useState([]);
  const [recentNewAdditions, setNewAdditions] = useState([]);
  const [recentNewDuplicates, setNewDuplicates] = useState([]);
  const [inputQuery, setQuery] = useState('');

  useEffect(() => {
    setNumbers(numbers => uniq([...numbers, ...recentNewAdditions]));
  }, [recentNewAdditions]);


  useEffect(() => {
    setDuplicates(duplicates => uniq([...duplicates, ...recentNewDuplicates]));
  }, [recentNewDuplicates]);

  useEffect(() => {
    setInputs([...inputEntries, inputQuery]);
  }, [inputQuery]);

  // const KeyupEvent = debounce(
  const KeyupEvent =
    (input) => {
      if (input.indexOf(',') >= 0) {
        let pattern = /^\d+$/;
        let inputs = input.split(",").map(item => item.trim());
        for (let index = 0; index < inputs.length; index++) {
          let element = inputs[index];
          let query = `${element}_${index}`;
          let isFound = inputEntries.indexOf(query) >= 0
          if (!isFound) {
            setQuery(query);
            let rangeList = element.split("-").map(item => parseInt(item.trim())).filter(item =>
              pattern.test(item) === true);
            let start = rangeList[0];
            let end;
            if (rangeList.length > 1) {
              end = rangeList[1];
              checkDuplicateWithRange(start, end);
            }
            else {
              start && setStateValues([start]);;
            }
          }
        }
      }
    }
  // , 1000);

  function setStateValues(arr) {
    let newAddition = arr.filter(entries => numbers.indexOf(entries) === -1);
    let newDuplicate = arr.filter(entries => numbers.indexOf(entries) !== -1);
    setNewAdditions(newAddition);
    setNewDuplicates(newDuplicate);
  }

  function checkDuplicateWithRange(start, end) {
    let temp_arr = [];
    for (let i = start; i <= end; i++) {
      temp_arr.push(i);
    }
    setStateValues(temp_arr);
  }

  return (
    <div >
      Type Here:
        <input type="text" onKeyUp={(e) => KeyupEvent(e.target.value)}></input>
      <div className="container">

        <p> New Additions in last move are - {recentNewAdditions.join(",")}</p>
        <p>New Duplicates in last move are  - {recentNewDuplicates.join(",")}</p>
        <p>Final List is - {numbers.join(",")}</p>
        <p>All time Duplicates  - {duplicates.join(",")}</p>
      </div>
    </div >
  );
}

export default App;
