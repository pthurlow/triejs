if (typeof window === 'undefined') {
  var Triejs = require('../../src/trie.js');
}

/**
* @description Test the default trie data implementation with
*   arrays of data stored at each node level
*/
describe('When using a default trie with match on substring', function (){
  var trie;

  beforeEach(function (){
    trie = new Triejs({ matchSubstrings: true });
  });

  afterEach(function() {
    delete trie;
  });

  /**
  * @description test for adding single words with spaces
  */
  describe('and adding a word with spaces', function() {

    it('it exists in the trie', function (){
      trie.add('test one', 'word');
      expect(trie.find('test')).toEqual(['word']);
      expect(trie.find('one')).toEqual(['word']);
    });

    it('it can be retrieved by prefix', function (){
      trie.add('test one', 'word');
      expect(trie.find('t')).toEqual(['word']);
      expect(trie.find('te')).toEqual(['word']);
      expect(trie.find('tes')).toEqual(['word']);
      expect(trie.find('o')).toEqual(['word']);
      expect(trie.find('on')).toEqual(['word']);
    });

    it('it is not found when using incorrect prefix', function (){
      trie.add('test one', 'word');
      expect(trie.find('wrong')).not.toEqual(['word']);
      expect(trie.find('wrong')).toBeUndefined();
      expect(trie.find('testt')).toBeUndefined();
      expect(trie.find('onee')).toBeUndefined();
    });

    it('it is not found when using non string prefix', function (){
      trie.add('test one', 'word');
      expect(trie.find(true)).toBeUndefined();
      expect(trie.find(1)).toBeUndefined();
      expect(trie.find(function() {})).toBeUndefined();
      expect(trie.find(null)).toBeUndefined();
      expect(trie.find(undefined)).toBeUndefined();
    });

    it('it is a copy and not the original variable', function (){
      var data = 'word';
      trie.add('test one', data);
      data = 'wrong';
      expect(trie.find('t')).toEqual(['word']);
      expect(trie.find('o')).toEqual(['word']);
    });
  });

  /**
  * @description test for adding words as a single argument
  */
  describe('and adding a word without data with spaces', function() {

    beforeEach(function() {
      trie.add('word test');
    });

    it('it adds the word as the data', function (){
      expect(trie.find('w')).toEqual(['word test']);
      expect(trie.find('t')).toEqual(['word test']);
    });
  });

  /**
  * @description test adding multiple words
  */
  describe('and adding two words with spaces', function() {

    beforeEach(function() {
      trie.add('test one', 'word');
      trie.add('testing this', 'another word');
    });

    it('they exist in the trie', function (){
      expect(trie.find('test')).toEqual(['another word', 'word']);
      expect(trie.find('t')).toEqual(['another word', 'another word', 'word']);
    });
  });

  /**
  * @description test adding multiple words
  */
  describe('and adding multiple words at once', function() {

    beforeEach(function() {
      trie.addAll([['test one', 'word'],['testing two', 'another word']]);
    });

    it('they exist in the trie', function (){
      expect(trie.find('test')).toEqual(['another word', 'word']);
      expect(trie.find('one')).toEqual(['word']);
      expect(trie.find('tw')).toEqual(['another word']);
    });
  });

  /**
  * @description test adding multiple words at once using original function
  */
  describe('and adding multiple words at once using original add function', function() {

    beforeEach(function() {
      trie.add([['test one', 'word'],['testing two', 'another word']]);
    });

    it('they exist in the trie', function (){
      expect(trie.find('test')).toEqual(['another word', 'word']);
      expect(trie.find('one')).toEqual(['word']);
      expect(trie.find('two')).toEqual(['another word']);
    });
  });

  /**
  * @description test adding multiple words at once without data
  */
  describe('and adding multiple words at once', function() {

    beforeEach(function() {
      trie.addAll(['test one', 'testing two']);
    });

    it('they exist in the trie', function (){
      expect(trie.find('test')).toEqual(['test one', 'testing two']);
      expect(trie.find('one')).toEqual(['test one']);
      expect(trie.find('two')).toEqual(['testing two']);
    });
  });

  /**
  * @description test adding multiple words at once without data using original function
  */
  describe('and adding multiple words at once without data using original add function', function() {

    beforeEach(function() {
      trie.add(['test one','testing two']);
    });

    it('they exist in the trie', function (){
      expect(trie.find('test')).toEqual(['test one', 'testing two']);
      expect(trie.find('one')).toEqual(['test one']);
      expect(trie.find('two')).toEqual(['testing two']);
    });
  });

  /**
  * @description test adding identical words
  */
  describe('and adding two identical words', function() {

    beforeEach(function() {
      trie.add('test', 'word');
      trie.add('test', 'another word');
    });

    it('they exist in the trie', function () {
      expect(trie.find('test')).toEqual(['another word', 'word']);
    });
    it('they share the same substring', function () {
      expect(trie.root).toEqual({t:{'$s': 'est', '$d': ['another word', 'word']}});
    });
  });

  /**
  * @description test adding three words
  */
  describe('and adding three identical words', function() {

    beforeEach(function() {
      trie.add('test', 'word');
      trie.add('test', 'word');
      trie.add('test', 'word');
    });

    it('they exist in the trie', function () {
      expect(trie.find('test')).toEqual(['word', 'word', 'word']);
    });
    it('they don\'t add excess letters in the trie', function () {
      expect(trie.find('testt')).toBeUndefined();
    });
  });


  /**
  * @description test uppercase letters in words and with prefix fetching
  */
  describe('and adding a word with capitals', function() {

    beforeEach(function() {
      trie.add('Test', 'word');
    });

    it('it can be found in the trie', function (){
      expect(trie.find('test')).toEqual(['word']);
    });
    it('it can be found in the trie with capitals', function (){
      expect(trie.find('Test')).toEqual(['word']);
    });
  });

  /**
  * @description test uppercase letters in words and with prefix fetching
  */
  describe('and modifying an added word', function() {

    beforeEach(function() {
      trie.add('test', 'word');
    });

    it('it does not modify the word in the tree', function (){
      var words = trie.find('test');
      words[0] = 'new';
      expect(trie.find('test')).toEqual(['word']);
    });
  });

  /**
  * @description test unicode letters in words and with prefix fetching
  */
  describe('and adding a word with unicode characters', function() {

    beforeEach(function() {
      trie.add('test'+String.fromCharCode(0x3050)+String.fromCharCode(0x3051)+String.fromCharCode(0x3052), 'word');
    })

    it('it is found in the trie', function (){
      expect(trie.find('test'+String.fromCharCode(0x3050))).toEqual(['word']);
    });
  });

  /**
  * @description test multiple unicode words with overlap
  */
  describe('and adding a word with unicode characters and splitting on unicode chars', function() {

    beforeEach(function() {
      trie.add('test'+String.fromCharCode(0x3050)+String.fromCharCode(0x3051)+String.fromCharCode(0x3052), 'word');
      trie.add('test'+String.fromCharCode(0x3050)+String.fromCharCode(0x3051), 'another word');
    })

    it('it is found in the trie', function (){
      expect(trie.find('test'+String.fromCharCode(0x3050))).toEqual(['another word','word']);
    });
  });

  /**
  * @description test returning results over the max cache amount
  */
  describe('and adding more words than the cache', function() {

    beforeEach(function() {
      trie.add('testone', 'one');
      trie.add('testtwo', 'two');
      trie.add('testthree', 'three');
      trie.add('testfour', 'four');
      trie.add('testfive', 'five');
      trie.add('testsix', 'six');
      trie.add('testseven', 'seven');
      trie.add('testeight', 'eight');
      trie.add('testnine', 'nine');
      trie.add('testten', 'ten');
      trie.add('testeleven', 'eleven');
    })

    it('it only returns the max number of results', function (){
      expect(trie.find('t')).toEqual(
        ['eight','eleven','five','four','nine','one','seven','six','ten','three']);
    });
  });
});
