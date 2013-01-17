if (typeof window === 'undefined') {
  var Triejs = require('../../src/trie.js');
}

/**
* @description Test the cache disabled trie data implementation with
*   data only stored at the suffix level
*/
describe('When using a trie with no cache', function (){
  var trie;

  beforeEach(function (){
    trie = new Triejs({ enableCache: false });
  });

  afterEach(function() {
    delete trie;
  });

  /**
  * @description test for adding single words
  */
  describe('and adding a word', function() {

    beforeEach(function() {
      trie.add('test', 'word');
    })

    it('it exists in the trie', function (){
      expect(trie.find('test')).toEqual(['word']);
    });

    it('it can be retrieved by prefix', function (){
      expect(trie.find('t')).toEqual(['word']);
      expect(trie.find('te')).toEqual(['word']);
      expect(trie.find('tes')).toEqual(['word']);
    });

    it('it is not found when using incorrect prefix', function (){
      expect(trie.find('wrong')).not.toEqual(['word']);
      expect(trie.find('wrong')).toBeUndefined();
      expect(trie.find('testt')).toBeUndefined();
    });

    it('it is not found when using non string prefix', function (){
      expect(trie.find(true)).toBeUndefined();
      expect(trie.find(1)).toBeUndefined();
      expect(trie.find(function() {})).toBeUndefined();
      expect(trie.find(null)).toBeUndefined();
      expect(trie.find(undefined)).toBeUndefined();
    });

    it('it can be found using contains', function() {
      expect(trie.contains('test')).toBe(true);
      expect(trie.contains('t')).toBe(false);
    });

    /**
    * @description test removing a single word
    */
    describe('and removing the word', function() {

      beforeEach(function() {
        trie.remove('test');
      });

      it('it is not in the trie', function() {
        expect(trie.find('t')).toBeUndefined();
        expect(trie.find('test')).toBeUndefined();
      });

      it('it cannot be found using contains', function() {
        expect(trie.contains('test')).toBe(false);
        expect(trie.contains('t')).toBe(false);
      });
    });

    /**
    * @description test removing a word not in the trie
    */
    describe('and removing a non existent word', function() {
      
      it('it is still in the trie', function() {
        trie.remove('te');
        expect(trie.find('t')).toEqual(['word']);
      });
    });
  });

  /**
  * @description test for invalid input to add function
  */
  describe('and adding a non string word', function() {

    beforeEach(function() {
      trie.add(1, 'word');
      trie.add(false, 'word');
      trie.add(function() {}, 'word');
      trie.add(null, 'word');
      trie.add(undefined, 'word');
    })

    it('it adds nothing to the trie', function (){
      expect(trie.root).toEqual({});
    });
  });

  /**
  * @description test for adding words as a single argument
  */
  describe('and adding a word without data', function() {

    beforeEach(function() {
      trie.add('word');
    })

    it('it adds the word as the data', function (){
      expect(trie.find('w')).toEqual(['word']);
    });
  });

  /**
  * @description test adding multiple words
  */
  describe('and adding two words', function() {

    beforeEach(function() {
      trie.add('test', 'word');
      trie.add('testing', 'another word');
    })

    it('they exist in the trie', function (){
      expect(trie.find('test')).toEqual(['another word', 'word']);
    });

    it('they are found using contains', function (){
      expect(trie.contains('test')).toBe(true);
      expect(trie.contains('testing')).toBe(true);
      expect(trie.contains('tes')).toBe(false);
      expect(trie.contains('testi')).toBe(false);
    });

    /**
    * @description test removing a word
    */
    describe('and removing one word', function() {

      it('it no longer exists', function() {
        trie.remove('test');
        expect(trie.find('tes')).toEqual(['another word']);
        expect(trie.find('test')).toEqual(['another word']);
        expect(trie.find('testi')).toEqual(['another word']);
      });
    });

    /**
    * @description test removing a word
    */
    describe('and removing the other word', function() {

      it('it no longer exists', function() {
        trie.remove('testing');
        expect(trie.find('tes')).toEqual(['word']);
        expect(trie.find('test')).toEqual(['word']);
        expect(trie.find('testi')).toBeUndefined();
      });
    });
  });

  /**
  * @description test adding multiple words
  */
  describe('and adding two words', function() {

    beforeEach(function() {
      trie.add('abc', 'another word');
      trie.add('ab', 'word');
    })

    it('they exist in the trie', function (){
      expect(trie.find('a')).toEqual(['another word', 'word']);
    });
  });

  /**
  * @description test adding multiple words
  */
  describe('and adding multiple words at once', function() {

    beforeEach(function() {
      trie.addAll([['test', 'word'],['testing', 'another word']]);
    });

    it('they exist in the trie', function (){
      expect(trie.find('t')).toEqual(['another word', 'word']);
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
    });
  });

  /**
  * @description test adding indentical words
  */
  describe('and adding two identical words', function() {
    beforeEach(function() {
      trie.add('one', 'word');
      trie.add('one', 'another word');
    });

    it('they exist in the trie', function() {
      expect(trie.find('o')).toEqual(['another word', 'word']);
      expect(trie.find('onee')).toBeUndefined();
    });
  });

  /**
  * @description test removing indentical words
  */
  describe('and removing two identical words', function() {

    beforeEach(function() {
      trie.add('one', 'word');
      trie.add('one', 'another word');
    });

    it('they are both returned', function() {
      expect(trie.remove('one')).toEqual(['another word', 'word']);
    });
    it('they are both removed', function() {
      trie.remove('one');
      expect(trie.find('o')).toBeUndefined();
    });
    it('they are not contained', function() {
      trie.remove('one');
      expect(trie.contains('one')).toBe(false);
    });
  });

  /**
  * @description test adding identical words all the way to the last letter
  */
  describe('and adding two exact same words (different data) with all prefix letters stored', function() {

    beforeEach(function() {
      trie.add('o', 'word one');
      trie.add('on', 'word two');
      trie.add('one', 'word b');
      trie.add('one', 'word a');
    });

    it('they exist in the trie', function () {
      expect(trie.find('one')).toEqual(['word a', 'word b']);
    });
  });

  /**
  * @description test adding three indentical words
  */
  describe('and adding three identical words', function() {
    beforeEach(function() {
      trie.add('one', 'word');
      trie.add('one', 'another word');
      trie.add('one', 'third word');
    });

    it('they exist in the trie', function() {
      expect(trie.find('o')).toEqual(['another word', 'third word', 'word']);
      expect(trie.find('onee')).toBeUndefined();
    });
  });


  /**
  * @description test uppercase letters in words and with prefix fetching
  */
  describe('and adding a word with capitals', function() {

    beforeEach(function() {
      trie.add('Test', 'word');
    })

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
    })

    it('it does not modify the word in the tree', function (){
      var words = trie.find('test');
      words[0] = 'new';
      expect(trie.find('test')).toEqual(['word']);
    });
  });

  /**
  * @description test uppercase letters in words and with prefix fetching
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
  * @description test uppercase letters in words and with prefix fetching
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
