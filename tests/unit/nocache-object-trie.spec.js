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
    trie = new Triejs({
      enableCache: false
      , insert: function(target, data) {
        if (!target[data.type]) {
          target[data.type] = [data];
        } else {
          for (var i = 0, ii = target[data.type].length; i < ii; i++) {
            if (target[data.type].id == data.id) {
              return target;
            }
          }
          target[data.type].push(data);
        }
        return target;
      }
      , sort: function(word) {
        for (var type in this) {
          this[type].sort(function(a, b) {
            if (a.name.toLowerCase() == word) {
              return -1;
            } else if (b.name.toLowerCase() == word) {
              return 1;
            } else {
              return a.position - b.position;
            }
          });
        }
      }
      , copy: function(data) {
        var temp = {};
        for (var type in data) {
          temp[type] = data[type].slice();
        }
        return temp;
      }
      , clip: function(max) {
        for (var type in this) {
          this[type].splice(max, this[type].length - max);
        }
      }
      , merge: function(target, data, word) {
        for (var type in data) {
          for (var i = 0, ii = data[type].length; i < ii; i++) {
            target = this.options.insert.call(this, target, data[type][i]);
            this.options.sort.call(target, word);
            this.options.clip.call(target, this.options.maxCache);
          }
        }
        return target;
      }
    });
  });

  afterEach(function() {
    delete trie;
  });

  /**
  * @description test for adding single words
  */
  describe('and adding a word', function() {

    beforeEach(function() {
      trie.add('test', {type:'person', name:'Test', position: 0});
    })

    it('it exists in the trie', function (){
      expect(trie.find('test')).toEqual({'person': [{type:'person', name:'Test', position: 0}]});
    });

    it('it can be retrieved by prefix', function (){
      expect(trie.find('t')).toEqual({'person': [{type:'person', name:'Test', position: 0}]});
      expect(trie.find('te')).toEqual({'person': [{type:'person', name:'Test', position: 0}]});
      expect(trie.find('tes')).toEqual({'person': [{type:'person', name:'Test', position: 0}]});
    });

    it('it is not found when using incorrect prefix', function (){
      expect(trie.find('wrong')).not.toEqual({'person': [{type:'person', name:'Test', position: 0}]});
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
        expect(trie.find('t')).toEqual({'person': [{type:'person', name:'Test', position: 0}]});
      });
    });
  });

  /**
  * @description test for invalid input to add function
  */
  describe('and adding a non string word', function() {

    beforeEach(function() {
      trie.add(1, {type:'person', name:'Test', position: 0});
      trie.add(false, {type:'person', name:'Test', position: 0});
      trie.add(function() {}, {type:'person', name:'Test', position: 0});
      trie.add(null, {type:'person', name:'Test', position: 0});
      trie.add(undefined, {type:'person', name:'Test', position: 0});
    })

    it('it adds nothing to the trie', function (){
      expect(trie.root).toEqual({});
    });
  });

  /**
  * @description test adding multiple words
  */
  describe('and adding two similar words (first smaller)', function() {

    beforeEach(function() {
      trie.add('test', {type:'person', name:'Test', position: 1, id: 0});
      trie.add('testing', {type:'person', name:'More', position: 2, id: 1});
    })

    it('they exist in the trie', function (){
      expect(trie.find('test')).toEqual({
        'person': [
          {type:'person', name:'Test', position: 1, id: 0}
          ,{type:'person', name:'More', position: 2, id: 1}]
      });
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
        expect(trie.find('tes')).toEqual({'person': [{type:'person', name:'More', position: 2, id: 1}]});
        expect(trie.find('test')).toEqual({'person': [{type:'person', name:'More', position: 2, id: 1}]});
        expect(trie.find('testi')).toEqual({'person': [{type:'person', name:'More', position: 2, id: 1}]});
      });
    });

    /**
    * @description test removing a word
    */
    describe('and removing the other word', function() {

      it('it no longer exists', function() {
        trie.remove('testing');
        expect(trie.find('tes')).toEqual({'person': [{type:'person', name:'Test', position: 1, id: 0}]});
        expect(trie.find('test')).toEqual({'person': [{type:'person', name:'Test', position: 1, id: 0}]});
        expect(trie.find('testi')).toBeUndefined();
      });
    });
  });

  /**
  * @description test adding multiple words
  */
  describe('and adding two similar words (second smaller)', function() {

    beforeEach(function() {
      trie.add('abc', {type:'person', name:'First', position: 2, id: 0});
      trie.add('ab', {type:'person', name:'Second', position: 1, id: 1});
    })

    it('they exist in the trie', function (){
      expect(trie.find('a')).toEqual({
        person: [
          {type:'person', name:'Second', position: 1, id: 1}
          , {type:'person', name:'First', position: 2, id: 0}
        ]
      });
    });
    it('they can be accessed by completing the sub word', function() {
      expect(trie.find('ab')).toEqual({
        person: [
          {type:'person', name:'Second', position: 1, id: 1}
          , {type:'person', name:'First', position: 2, id: 0}
        ]
      });
    });
  });

  /**
  * @description test adding identical words
  */
  describe('and adding two exact same words (different data)', function() {

    beforeEach(function() {
      trie.add('one', {type:'person', name:'First', position: 1, id:0});
      trie.add('one', {type:'person', name:'Second', position: 2, id:1});
    });

    it('they exist in the trie', function () {
      expect(trie.find('one')).toEqual({
        person: [
          {type:'person', name:'First', position: 1, id: 0}
          , {type:'person', name:'Second', position: 2, id: 1}
        ]
      });
      expect(trie.find('onee')).toBeUndefined();
    });
  });

  /**
  * @description test adding identical words and data
  */
  describe('and adding two exact same words (same data)', function() {

    beforeEach(function() {
      trie.add('one', {type:'person', name:'First', position: 1, id:1});
      trie.add('one', {type:'person', name:'First', position: 1, id:1});
    });

    it('they exist in the trie', function () {
      expect(trie.find('one')).toEqual({
        person: [
          {type:'person', name:'First', position: 1, id: 1}
          , {type:'person', name:'First', position: 1, id: 1}
        ]
      });
      expect(trie.find('onee')).toBeUndefined();
    });
  });


  /**
  * @description test adding identical words all the way to the last letter
  */
  describe('and adding to exact same words (different data) with all prefix letters stored', function() {

    beforeEach(function() {
      trie.add('o', {type:'person', name:'Invalid', position: 3, id:2});
      trie.add('on', {type:'person', name:'Invlid', position: 4, id:3});
      trie.add('one', {type:'person', name:'First', position: 1, id:0});
      trie.add('one', {type:'person', name:'Second', position: 2, id:1});
    });

    it('they exist in the trie', function () {
      expect(trie.find('one')).toEqual({
        person: [
          {type:'person', name:'First', position: 1, id: 0}
          , {type:'person', name:'Second', position: 2, id: 1}
        ]
      });
    });
  });

  /**
  * @description test removing identical words
  */
  describe('and removing two identical words (different data)', function() {

    beforeEach(function() {
      trie.add('one', {type:'person', name:'First', position: 1, id:0});
      trie.add('one', {type:'person', name:'Second', position: 2, id:1});
    });

    it('they are returned when removed', function() {
      expect(trie.remove('one')).toEqual({person:
        [{type:'person', name:'First', position: 1, id:0}, {type:'person', name:'Second', position:2, id:1}]
      });
    });

    it('they are not in the trie', function() {
      trie.remove('one');
      expect(trie.find('o')).toBeUndefined();
    });
    it('they are not contained in the trie', function() {
      trie.remove('one');
      expect(trie.contains('one')).toBe(false);
    });
  });

  /**
  * @description test adding multiple words
  */
  describe('and adding multiple words at once', function() {

    beforeEach(function() {
      trie.addAll([
        ['one', {type:'person', name:'First', position: 1, id:0}]
        ,['two', {type:'person', name:'Second', position: 2, id:1}]
      ]);
    });

    it('they exist in the trie', function (){
      expect(trie.find('one')).toEqual({person: [{type:'person', name:'First', position: 1, id:0}]});
      expect(trie.find('two')).toEqual({person: [{type:'person', name:'Second', position: 2, id:1}]});
    });
  });

  /**
  * @description test uppercase letters in words and with prefix fetching
  */
  describe('and adding a word with capitals', function() {

    beforeEach(function() {
      trie.add('Test', {type:'person', name:'First', position: 2, id: 0});
    })

    it('it can be found in the trie', function (){
      expect(trie.find('test')).toEqual({person: [{type:'person', name:'First', position: 2, id: 0}]});
    });
    it('it can be found in the trie with capitals', function (){
      expect(trie.find('Test')).toEqual({person: [{type:'person', name:'First', position: 2, id: 0}]});
    });
  });

  /**
  * @description test uppercase letters in words and with prefix fetching
  */
  describe('and modifying an added word', function() {

    beforeEach(function() {
      trie.add('test', {type:'person', name:'First', position: 2, id: 0});
    })

    it('it does not modify the word in the tree', function (){
      var words = trie.find('test');
      words.person[0] = {type:'person', name:'Stuff', position: 3, id: 1};
      expect(trie.find('test')).toEqual({person: [{type:'person', name:'First', position: 2, id: 0}]});
    });
  });

  /**
  * @description test uppercase letters in words and with prefix fetching
  */
  describe('and adding a word with unicode characters', function() {

    beforeEach(function() {
      trie.add('test'+String.fromCharCode(0x3050)+String.fromCharCode(0x3051)+String.fromCharCode(0x3052), {type:'person', name:'First', position: 2, id: 0});
    })

    it('it is found in the trie', function (){
      expect(trie.find('test'+String.fromCharCode(0x3050))).toEqual({person: [{type:'person', name:'First', position: 2, id: 0}]});
    });
  });

  /**
  * @description test uppercase letters in words and with prefix fetching
  */
  describe('and adding a word with unicode characters and splitting on unicode chars', function() {

    beforeEach(function() {
      trie.add('test'+String.fromCharCode(0x3050)+String.fromCharCode(0x3051)+String.fromCharCode(0x3052), {type:'person', name:'First', position: 2, id: 0});
      trie.add('test'+String.fromCharCode(0x3050)+String.fromCharCode(0x3051), {type:'person', name:'Second', position: 3, id: 1});
    })

    it('it is found in the trie', function (){
      expect(trie.find('test'+String.fromCharCode(0x3050))).toEqual({
        person: [
          {type:'person', name:'First', position: 2, id: 0}
          , {type:'person', name:'Second', position: 3, id: 1}
        ]
      });
    });
  });

  /**
  * @description test uppercase letters in words and with prefix fetching
  */
  describe('and adding multiple words', function() {

    beforeEach(function() {
      trie.add('testing', {type:'person', name:'testing', position: 0, id: 0});
      trie.add('test three', {type:'person', name:'test three', position: 1, id: 1});
      trie.add('test', {type:'person', name:'test', position: 2, id: 2});
    })

    it('it returns all in position order when requesting by similar prefix', function (){
      expect(trie.find('t')).toEqual({person: [
        {type:'person', name:'testing', position: 0, id: 0}
        , {type:'person', name:'test three', position: 1, id: 1}
        , {type:'person', name:'test', position: 2, id: 2}
      ]});
    });
    it('it returns an exact text match before any prefix matches', function (){
      expect(trie.find('test')).toEqual({person: [
        {type:'person', name:'test', position: 2, id: 2}
        , {type:'person', name:'testing', position: 0, id: 0}
        , {type:'person', name:'test three', position: 1, id: 1}
      ]});
    });
  });

  /**
  * @description test returning results over the max cache amount
  */
  describe('and adding more words than the cache', function() {

    beforeEach(function() {
      trie.add('testone',    {type:'person', name:'one',    position: 1, id: 0});
      trie.add('testtwo',    {type:'person', name:'two',    position: 2, id: 1});
      trie.add('testthree',  {type:'person', name:'three',  position: 3, id: 2});
      trie.add('testfour',   {type:'person', name:'four',   position: 4, id: 3});
      trie.add('testfive',   {type:'person', name:'five',   position: 5, id: 4});
      trie.add('testsix',    {type:'person', name:'six',    position: 6, id: 5});
      trie.add('testseven',  {type:'person', name:'seven',  position: 7, id: 6});
      trie.add('testeight',  {type:'person', name:'eight',  position: 8, id: 7});
      trie.add('testnine',   {type:'person', name:'nine',   position: 9, id: 8});
      trie.add('testten',    {type:'person', name:'ten',    position: 10, id: 9});
      trie.add('testeleven', {type:'person', name:'eleven', position: 11, id: 10});
    })

    it('it only returns the max number of results', function (){
      expect(trie.find('t')).toEqual({
        person: [
          {type:'person', name:'one',    position: 1, id: 0}
          , {type:'person', name:'two',    position: 2, id: 1}
          , {type:'person', name:'three',  position: 3, id: 2}
          , {type:'person', name:'four',   position: 4, id: 3}
          , {type:'person', name:'five',   position: 5, id: 4}
          , {type:'person', name:'six',    position: 6, id: 5}
          , {type:'person', name:'seven',  position: 7, id: 6}
          , {type:'person', name:'eight',  position: 8, id: 7}
          , {type:'person', name:'nine',   position: 9, id: 8}
          , {type:'person', name:'ten',    position: 10, id: 9}
        ]
      })
    });
  });
});
