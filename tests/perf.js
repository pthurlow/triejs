var Triejs = require('../src/trie')
  , trie = new Triejs()
  , array = []
  , dict = require('./dict.js').dictionary
  , index = []
  , start
  , end
  , total
  , dictSize = [2,4,6,8,10,12,14,16,18,20,22,24]
  , runSize = 100000
  , Chart = require('cli-chart')
  , colors = require('colors')
  , chart = new Chart({
    xlabel: 'dictionary size'
    , ylabel: 'time(ms)'
    , direction: 'y'
    , width: 50
    , xmax: 24
    , xmin: 2
    , height: 15
    , lmargin: 0
    , step: 2
  })
  , results = [];

process.stdout.write('> Building performance results\n');
for (var k = 0; k < dictSize.length; k++) {

  // Init dictionary and random element access
  process.stdout.write('.'.green);
  for (var i = 0; i < dictSize[k]; i++) {
    trie.add(dict[i]);
  }
  array = dict.slice(0,dictSize[k]);
  for (var i = 0; i < runSize; i++) {
    index.push(Math.floor(Math.random()*dictSize[k]));
  }

  // Trie lookup test
  start = new Date().getTime();
  for (var i = 0; i < runSize; i++) {
    trie.find(dict[index[i]]);
  }
  end = new Date().getTime();
  process.stdout.write('.'.green);
  chart.addBar({size: (end - start), color: 'blue'});

  start = new Date().getTime();
  for (var i = 0; i < runSize; i++) {
    var find = dict[index[i]];
    for (var j = 0, jj = array.length; j < jj; j++) {
      if (array[i] === find) {
        break;
      }
    }
  }
  end = new Date().getTime();
  chart.addBar({size: (end - start), color: 'red'});
  process.stdout.write('.'.green);
}
process.stdout.write('\n');
process.stdout.write('          --------------------------------------------------\n');
process.stdout.write('          |');
process.stdout.write('        Triejs'.blue);
process.stdout.write('              Array lookup        '.red)
process.stdout.write('|\n');
process.stdout.write('          --------------------------------------------------\n');

//chart.bucketize(results)
chart.draw();
process.exit();
