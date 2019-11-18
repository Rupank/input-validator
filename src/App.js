import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import uniq from 'lodash.uniq';
import intersection from 'lodash.intersection';
import union from 'lodash.union';
import './App.css';

function App() {

  const [numbers, setNumbers] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [inputEntries, setInputs] = useState([]);

  const KeyupEvent = debounce((input) => {
    let pattern = /^\d+$/;
    let inputs = input.split(",").map(item => item.trim());
    inputs.forEach(element => {
      let isFound = false;
      inputEntries.forEach(val => {
        if (val === element) isFound = true;
      })
      if (!isFound) {
        setInputs([...inputs, element]);
        let rangeList = element.split("-").map(item => parseInt(item.trim())).filter(item =>
          pattern.test(item) === true);
        let start = rangeList[0];
        let end;
        if (rangeList.length > 1) {
          end = rangeList[1];
          checkDuplicateWithRange(start, end);
        }
        else {
          start && checkDuplicateNumber(start);
        }
      }

    });
  }, 500);



  function setStateValues(arr) {
    let duplicateArray = intersection(numbers, arr);
    let unionArray = union(numbers, arr);
    let uniqDuplicatedArray = uniq([...duplicates, ...duplicateArray]);
    let uniqMainArray = uniq([...numbers, ...unionArray]);
    setDuplicates(uniqDuplicatedArray);
    setNumbers(uniqMainArray);
  }

  function checkDuplicateNumber(val) {
    setStateValues([val]);
  }
  function checkDuplicateWithRange(start, end) {
    let temp_arr = [];
    for (let i = start; i <= end; i++) {
      temp_arr.push(i);
    }
    setStateValues(temp_arr);
  }

  return (
    <div className="App">
      Type Here:
        <input type="text" onKeyUp={(e) => KeyupEvent(e.target.value)}></input>
      <div className="container">
        <div >
          Elements in Array are - {numbers.join(",")}
        </div>
        <div>
          Duplicates are - {duplicates.join(",")}
        </div>
      </div>
    </div >
  );
}

export default App;
