foounit.require(':vendor/spec-helper');
var Triejs = foounit.require(':src/trie');

/**
* @description Test the cache disabled trie data implementation with
*   data only stored at the suffix level
*/
describe('When using a trie with no cache with substrings', function (){
  var trie;

  before(function (){
    trie = new Triejs({ enableCache: false, matchSubstrings: true});
  });

  after(function() {
    delete trie;
  });

  /**
  * @description test for adding single words
  */
  describe('and adding a word', function() {

    before(function() {
      trie.add('test word', 'word');
    })

    it('it exists in the trie', function (){
      expect(trie.find('test')).to(equal, ['word']);
      expect(trie.find('word')).to(equal, ['word']);
    });

    it('it can be retrieved by prefix', function (){
      expect(trie.find('t')).to(equal, ['word']);
      expect(trie.find('te')).to(equal, ['word']);
      expect(trie.find('tes')).to(equal, ['word']);
      expect(trie.find('w')).to(equal, ['word']);
      expect(trie.find('wo')).to(equal, ['word']);
      expect(trie.find('wor')).to(equal, ['word']);
    });

    it('it is not found when using incorrect prefix', function (){
      expect(trie.find('wrong')).toNot(equal, ['word']);
      expect(trie.find('wrong')).to(beUndefined);
      expect(trie.find('testt')).to(beUndefined);
      expect(trie.find('wordd')).to(beUndefined);
    });

    it('it is not found when using non string prefix', function (){
      expect(trie.find(true)).to(beUndefined);
      expect(trie.find(1)).to(beUndefined);
      expect(trie.find(function() {})).to(beUndefined);
      expect(trie.find(null)).to(beUndefined);
      expect(trie.find(undefined)).to(beUndefined);
    });

    it('it can be found using contains', function() {
      expect(trie.contains('test word')).to(be, true);
      expect(trie.contains('t')).to(be, false);
      expect(trie.contains('word')).to(be, true);
      expect(trie.contains('w')).to(be, false);
    });

    /**
    * @description test removing a single word
    */
    describe('and removing the word', function() {

      before(function() {
        trie.remove('test word');
      });

      it('it is not in the trie', function() {
        expect(trie.find('t')).to(beUndefined);
        expect(trie.find('test')).to(beUndefined);
        expect(trie.find('w')).to(beUndefined);
        expect(trie.find('word')).to(beUndefined);
      });

      it('it cannot be found using contains', function() {
        expect(trie.contains('test word')).to(be, false);
        expect(trie.contains('t')).to(be, false);
        expect(trie.contains('word')).to(be, false);
        expect(trie.contains('w')).to(be, false);
      });
    });

    /**
    * @description test removing a word not in the trie
    */
    describe('and removing a non existent word', function() {
      
      it('it is still in the trie', function() {
        trie.remove('te');
        expect(trie.find('t')).to(equal, ['word']);
      });
    });
  });

  /**
  * @description test for invalid input to add function
  */
  describe('and adding a non string word', function() {

    before(function() {
      trie.add(1, 'word');
      trie.add(false, 'word');
      trie.add(function() {}, 'word');
      trie.add(null, 'word');
      trie.add(undefined, 'word');
    })

    it('it adds nothing to the trie', function (){
      expect(trie.root).to(equal, {});
    });
  });

  /**
  * @description test for adding words as a single argument
  */
  describe('and adding a word without data', function() {

    before(function() {
      trie.add('test word');
    })

    it('it adds the word as the data', function (){
      expect(trie.find('w')).to(equal, ['test word']);
      expect(trie.find('t')).to(equal, ['test word']);
    });
  });

  /**
  * @description test adding multiple words
  */
  describe('and adding two words', function() {

    before(function() {
      trie.add('test one', 'word');
      trie.add('testing two', 'another word');
    })

    it('they exist in the trie', function (){
      expect(trie.find('test')).to(equal, ['another word', 'word']);
      expect(trie.find('one')).to(equal, ['word']);
      expect(trie.find('two')).to(equal, ['another word']);
    });

    it('they are found using contains', function (){
      expect(trie.contains('test one')).to(be, true);
      expect(trie.contains('testing two')).to(be, true);
      expect(trie.contains('one')).to(be, true);
      expect(trie.contains('two')).to(be, true);
      expect(trie.contains('tes')).to(be, false);
      expect(trie.contains('testi')).to(be, false);
    });

    /**
    * @description test removing a word
    */
    describe('and removing one word', function() {

      it('it no longer exists', function() {
        trie.remove('test one');
        expect(trie.find('tes')).to(equal, ['another word']);
        expect(trie.find('test')).to(equal, ['another word']);
        expect(trie.find('testi')).to(equal, ['another word']);
      });
    });

    /**
    * @description test removing a word
    */
    describe('and removing the other word', function() {

      it('it no longer exists', function() {
        trie.remove('testing two');
        expect(trie.find('tes')).to(equal, ['word']);
        expect(trie.find('test')).to(equal, ['word']);
        expect(trie.find('testi')).to(beUndefined);
      });
    });
  });

  /**
  * @description test adding multiple words
  */
  describe('and adding two words', function() {

    before(function() {
      trie.add('abc', 'another word');
      trie.add('ab', 'word');
    })

    it('they exist in the trie', function (){
      expect(trie.find('a')).to(equal, ['another word', 'word']);
    });
  });

  /**
  * @description test adding multiple words
  */
  describe('and adding multiple words at once', function() {

    before(function() {
      trie.addAll([['test one', 'word'],['testing two', 'another word']]);
    });

    it('they exist in the trie', function (){
      expect(trie.find('test')).to(equal, ['another word', 'word']);
      expect(trie.find('one')).to(equal, ['word']);
      expect(trie.find('tw')).to(equal, ['another word']);
    });
  });

  /**
  * @description test adding multiple words at once using original function
  */
  describe('and adding multiple words at once using original add function', function() {

    before(function() {
      trie.add([['test one', 'word'],['testing two', 'another word']]);
    });

    it('they exist in the trie', function (){
      expect(trie.find('test')).to(equal, ['another word', 'word']);
      expect(trie.find('one')).to(equal, ['word']);
      expect(trie.find('two')).to(equal, ['another word']);
    });
  });

  /**
  * @description test adding multiple words at once without data
  */
  describe('and adding multiple words at once', function() {

    before(function() {
      trie.addAll(['test one', 'testing two']);
    });

    it('they exist in the trie', function (){
      expect(trie.find('test')).to(equal, ['test one', 'testing two']);
      expect(trie.find('one')).to(equal, ['test one']);
      expect(trie.find('two')).to(equal, ['testing two']);
    });
  });

  /**
  * @description test adding multiple words at once without data using original function
  */
  describe('and adding multiple words at once without data using original add function', function() {

    before(function() {
      trie.add(['test one','testing two']);
    });

    it('they exist in the trie', function (){
      expect(trie.find('test')).to(equal, ['test one', 'testing two']);
      expect(trie.find('one')).to(equal, ['test one']);
      expect(trie.find('two')).to(equal, ['testing two']);
    });
  });

  /**
  * @description test adding indentical words
  */
  describe('and adding two identical words', function() {
    before(function() {
      trie.add('one two', 'word');
      trie.add('one two', 'another word');
    });

    it('they exist in the trie', function() {
      expect(trie.find('o')).to(equal, ['another word', 'word']);
      expect(trie.find('onee')).to(beUndefined);
    });
  });

  /**
  * @description test removing indentical words
  */
  describe('and removing two identical words', function() {

    before(function() {
      trie.add('one two', 'word');
      trie.add('one two', 'another word');
    });

    it('they are both returned', function() {
      expect(trie.remove('one two')).to(equal, ['another word', 'word']);
    });
    it('they are both removed', function() {
      trie.remove('one two');
      expect(trie.find('o')).to(beUndefined);
      expect(trie.find('t')).to(beUndefined);
    });
    it('they are not contained', function() {
      trie.remove('one two');
      expect(trie.contains('one two')).to(be, false);
      expect(trie.contains('two')).to(be, false);
    });
  });

  /**
  * @description test adding identical words all the way to the last letter
  */
  describe('and adding two exact same words (different data) with all prefix letters stored', function() {

    before(function() {
      trie.add('o', 'word one');
      trie.add('on', 'word two');
      trie.add('one', 'word b');
      trie.add('one', 'word a');
      trie.add('one t', 'word d');
    });

    it('they exist in the trie', function () {
      expect(trie.find('one')).to(equal, ['word a', 'word b', 'word d']);
      expect(trie.find('t')).to(equal, ['word d']);
    });
  });

  /**
  * @description test adding three indentical words
  */
  describe('and adding three identical words', function() {
    before(function() {
      trie.add('one two', 'word');
      trie.add('one two', 'another word');
      trie.add('one two', 'third word');
    });

    it('they exist in the trie', function() {
      expect(trie.find('o')).to(equal, ['another word', 'third word', 'word']);
      expect(trie.find('t')).to(equal, ['another word', 'third word', 'word']);
      expect(trie.find('onee')).to(beUndefined);
    });
  });


  /**
  * @description test uppercase letters in words and with prefix fetching
  */
  describe('and adding a word with capitals', function() {

    before(function() {
      trie.add('Test One', 'word');
    })

    it('it can be found in the trie', function (){
      expect(trie.find('test')).to(equal, ['word']);
      expect(trie.find('one')).to(equal, ['word']);
    });
    it('it can be found in the trie with capitals', function (){
      expect(trie.find('Test')).to(equal, ['word']);
      expect(trie.find('One')).to(equal, ['word']);
    });
  });

  /**
  * @description test uppercase letters in words and with prefix fetching
  */
  describe('and modifying an added word', function() {

    before(function() {
      trie.add('test one', 'word');
    })

    it('it does not modify the word in the tree', function (){
      var words = trie.find('one');
      words[0] = 'new';
      expect(trie.find('one')).to(equal, ['word']);
    });
  });

  /**
  * @description test uppercase letters in words and with prefix fetching
  */
  describe('and adding a word with unicode characters', function() {

    before(function() {
      trie.add('test \u0B9x\u0D9x\u091x', 'word');
    })

    it('it is found in the trie', function (){
      expect(trie.find('test \u0B9x')).to(equal, ['word']);
      expect(trie.find('\u0B9x')).to(equal, ['word']);
    });
  });

  /**
  * @description test uppercase letters in words and with prefix fetching
  */
  describe('and adding a word with unicode characters and splitting on unicode chars', function() {

    before(function() {
      trie.add('test \u0B9x\u0D9x\u091x', 'word');
      trie.add('test \u0B9x\u0D9x', 'another word');
    })

    it('it is found in the trie', function (){
      expect(trie.find('test \u0B9x')).to(equal, ['another word','word']);
      expect(trie.find('\u0B9x')).to(equal, ['another word','word']);
    });
  });

  /**
  * @description test returning results over the max cache amount
  */
  describe('and adding more words than the cache', function() {

    before(function() {
      trie.add('test one', 'one');
      trie.add('test two', 'two');
      trie.add('test three', 'three');
      trie.add('test four', 'four');
      trie.add('test five', 'five');
      trie.add('test six', 'six');
      trie.add('test seven', 'seven');
      trie.add('test eight', 'eight');
      trie.add('test nine', 'nine');
      trie.add('test ten', 'ten');
      trie.add('test eleven', 'eleven');
    })

    it('it only returns the max number of results', function (){
      expect(trie.find('test')).to(
        equal
        , ['eight','eleven','five','four','nine','one','seven','six','ten','three']);
    });
  });
});
