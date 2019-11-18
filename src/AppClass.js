import React, { Component } from 'react'
import uniq from 'lodash.uniq';
import debounce from 'lodash.debounce';
class Appnew extends Component {

    constructor(props) {
        super(props)

        this.state = {
            numbers: [],
            duplicates: [],
            inputEntries: [],
            recentNewAdditions: [],
            recentNewDuplicates: []
        }
    }

    KeyupEvent = debounce((input) => {
        let pattern = /^\d+$/;
        let inputs = input.split(",").map(item => item.trim());
        inputs.forEach((element, index) => {
            let query = `${element}_${index}`;
            let isFound = this.state.inputEntries.indexOf(query) >= 0
            if (!isFound) {
                this.setState({
                    ...this.state,
                    inputEntries: [...this.state.inputEntries, query]
                }, () => {
                    let rangeList = element.split("-").map(item => parseInt(item.trim())).filter(item =>
                        pattern.test(item) === true);
                    let start = rangeList[0];
                    let end;
                    if (rangeList.length > 1) {
                        end = rangeList[1];
                        this.checkDuplicateWithRange(start, end);
                    }
                    else {
                        start && this.setStateValues([start]);;
                    }
                })
            }
        });
    }, 500);

    setStateValues(arr) {
        let newAddition = arr.filter(entries => this.state.numbers.indexOf(entries) === -1);
        let newDuplicate = arr.filter(entries => this.state.numbers.indexOf(entries) !== -1);
        if (newDuplicate.length > 0) {
            this.setState({
                ...this.state,
                recentNewDuplicates: newDuplicate,
                recentNewAdditions: []
            }, () => {
                let duplicates = uniq([...this.state.duplicates, ...this.state.recentNewDuplicates]);
                this.setState({
                    ...this.state,
                    duplicates: duplicates
                })
            })
        }
        if (newAddition.length > 0) {
            this.setState({
                ...this.state,
                recentNewAdditions: newAddition,
                recentNewDuplicates: []
            }, () => {
                let numbers = uniq([...this.state.numbers, ...this.state.recentNewAdditions]);
                this.setState({
                    numbers: numbers,
                })
            })
        }

    }

    checkDuplicateWithRange(start, end) {
        let temp_arr = [];
        for (let i = start; i <= end; i++) {
            temp_arr.push(i);
        }
        this.setStateValues(temp_arr);
    }

    render() {
        return (
            <div >
                Type Here:
              <input type="text" onKeyUp={(e) => this.KeyupEvent(e.target.value)}></input>
                <div className="container">

                    <p> New Additions in last move are - {this.state.recentNewAdditions.join(",")}</p>
                    <p>New Duplicates in last move are  - {this.state.recentNewDuplicates.join(",")}</p>
                    <p>Final List is - {this.state.numbers.join(",")}</p>
                    <p>All time Duplicates  - {this.state.duplicates.join(",")}</p>
                </div>
            </div >
        )
    }
}

export default Appnew
