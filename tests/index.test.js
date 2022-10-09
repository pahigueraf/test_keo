const { binarySearch, merge, mergeSort, getNumber } = require("../index.js")

describe('testing binary search', () => {
    test('trying ', () => {
        const array = [1,2,3];
        const result = binarySearch(array,0,array.length);
        expect(result).toBe(4)
    });
});

describe('testing merge', () => {
    test('trying ', () => {
        const array = [150,2,-5, 10];
        let middle = Math.floor((array.length) / 2)
        merge(array,0,middle,array.length-1);
        expect(array).toEqual([10,150,2,-5])
    });
});

describe('testing mergesort', () => {
    test('trying ', () => {
        const array = [150,2,-5, 10];
        mergeSort(array,0,array.length-1);
        expect(array).toEqual([-5,2,10,150])
    });
});

describe('getNumber', () => {
    test('trying ', () => {
        const array = [150,2,-5, 10];
        const result = getNumber(array);
        expect(result).toBe(1)
    });
    test('trying ', () => {
        const array = [150,1,-5, 10];
        const result = getNumber(array);
        expect(result).toBe(2)
    });
    test('trying ', () => {
        const array = [-5,-5,-5, -10];
        const result = getNumber(array);
        expect(result).toBe(1)
    });
    test('trying ', () => {
        const array = [-5,-5,-5, -5];
        const result = getNumber(array);
        expect(result).toBe(1)
    });
    test('trying ', () => {
        const array = [];
        const result = getNumber(array);
        expect(result).toBe(1)
    });
});