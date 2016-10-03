/*
Rake: Rapid Automatic Keyword Extraction

1.) Split sentences
  - remove junk
  - split on most punctuation
  - lower case everything
  - remove blanks
2.) Load stopwords & build regex
  - fox stop word list
3.) Split on stopword regex (phrases)
4.) Calculate word scores
5.) Calculate keyword scores
6.) Return sorted scores (subset)
*/

//global
var keywords;

function splitSentences(text){
  var clean = text.replace(/[|&$%^*\(\)-+'"]/g, "");
  var delimiters = /[\.!\?\-,]+/;
  var split = clean.split(delimiters);
  split = split.map(function(s){return s.toLowerCase().trim()})
  return split.filter(function(s){return s != ""})
}

function buildStopwordsRegex(stopwords){
  stopwords = stopwords.filter(function(s){return s.length > 1})
  stopwords.push('a')
  stopwords = stopwords.map(function(s){return '\\b' + s + '\\b'})
  return new RegExp("(?:" + stopwords.join('|') + ")", "g")
}

function generateKeywords(text, stopwords){
  var split = splitSentences(text)
  var regex = buildStopwordsRegex(stopwords)
  var keywords = [];
  for (var i = 0; i < split.length; i++) {
    var temp = split[i].replace(regex, "|");
    var phrases = temp.split("|")
    for (var j = 0; j < phrases.length; j++) {
      candidate = phrases[j].trim();
      if (candidate != "" && candidate.length > 1){
        keywords.push(candidate);
      }
    }
  }
  return keywords
}

function scoreWords(keywords){
  var freqs = {};
  var degrees = {};
  var scores = {}

  for (var i = 0; i < keywords.length; i++) {
    var words = keywords[i].split(' ');
    var keywordLength = words.length;
    var keywordDegree = keywordLength - 1;

    for (var j = 0; j < words.length; j++) {
      freqs[words[j]] = freqs[words[j]] ? freqs[words[j]] + 1 : 1
      degrees[words[j]] = keywordDegree;
    }

  }

  for (var key in freqs) {
    if (freqs.hasOwnProperty(key)) {
      degrees[key] = freqs[key] + degrees[key]
      scores[key] = degrees[key] / (freqs[key] * 1.0)
    }
  }
  return scores
}

function scoreKeywords(keywords, scores){
  var candidates = {};
  for (var i = 0; i < keywords.length; i++) {
    var words = keywords[i].split(' ')
    var score = 0
    for (var j = 0; j < words.length; j++) {
      score += scores[words[j]]
    }
    candidates[keywords[i]] = candidates[keywords[i]]
                            ? candidates[keywords[i]] + 1 : 1
  }
  return candidates
}


function rake(text, stopwords, topWords){
  var keys = generateKeywords(text, stopwords)
  var scores = scoreWords(keys);
  var candidates = scoreKeywords(keys, scores);
  var sortable = [];
  for (word in candidates){
    sortable.push([word, candidates[word]])
  }
  sortable.sort(function(a,b){
    return b[1] - a[1]
  })
  var slice = sortable.slice(0, topWords)
  for (var i = 0; i < slice.length; i++){
      slice[i] = {"word": slice[i][0], "score": slice[i][1]}
  }
  return slice
}

function rakeTime(){
    var text = document.getElementById('text').value;
    var topWords = document.getElementById('top-words').value;
    keywords = rake(text, stopwords, topWords); 
    var viz = document.getElementById('viz')
    viz.innerHTML = '' 
    var visualization = d3plus.viz()
	.container("#viz")
	.data(keywords)
	.type("bubbles")
	.id("word")
	.size("score")
	.color("word")
	.draw()

}

window.onload = function(){
    rakeTime()
};


var stopwords = ['a',
 'about',
 'above',
 'across',
 'after',
 'again',
 'against',
 'all',
 'almost',
 'alone',
 'along',
 'already',
 'also',
 'although',
 'always',
 'among',
 'an',
 'and',
 'another',
 'any',
 'anybody',
 'anyone',
 'anything',
 'anywhere',
 'are',
 'area',
 'areas',
 'around',
 'as',
 'ask',
 'asked',
 'asking',
 'asks',
 'at',
 'away',
 'b',
 'back',
 'backed',
 'backing',
 'backs',
 'be',
 'because',
 'became',
 'become',
 'becomes',
 'been',
 'before',
 'began',
 'behind',
 'being',
 'beings',
 'best',
 'better',
 'between',
 'big',
 'both',
 'but',
 'by',
 'c',
 'came',
 'can',
 'cannot',
 'case',
 'cases',
 'certain',
 'certainly',
 'clear',
 'clearly',
 'come',
 'could',
 'd',
 'did',
 'differ',
 'different',
 'differently',
 'do',
 'does',
 'done',
 'down',
 'downed',
 'downing',
 'downs',
 'during',
 'e',
 'each',
 'early',
 'either',
 'end',
 'ended',
 'ending',
 'ends',
 'enough',
 'even',
 'evenly',
 'ever',
 'every',
 'everybody',
 'everyone',
 'everything',
 'everywhere',
 'f',
 'face',
 'faces',
 'fact',
 'facts',
 'far',
 'felt',
 'few',
 'find',
 'finds',
 'first',
 'for',
 'four',
 'from',
 'full',
 'fully',
 'further',
 'furthered',
 'furthering',
 'furthers',
 'g',
 'gave',
 'general',
 'generally',
 'get',
 'gets',
 'give',
 'given',
 'gives',
 'go',
 'going',
 'good',
 'goods',
 'got',
 'great',
 'greater',
 'greatest',
 'group',
 'grouped',
 'grouping',
 'groups',
 'h',
 'had',
 'has',
 'have',
 'having',
 'he',
 'her',
 'herself',
 'here',
 'high',
 'higher',
 'highest',
 'him',
 'himself',
 'his',
 'how',
 'however',
 'i',
 'if',
 'important',
 'in',
 'interest',
 'interested',
 'interesting',
 'interests',
 'into',
 'is',
 'it',
 'its',
 'itself',
 'j',
 'just',
 'k',
 'keep',
 'keeps',
 'kind',
 'knew',
 'know',
 'known',
 'knows',
 'l',
 'large',
 'largely',
 'last',
 'later',
 'latest',
 'least',
 'less',
 'let',
 'lets',
 'like',
 'likely',
 'long',
 'longer',
 'longest',
 'm',
 'made',
 'make',
 'making',
 'man',
 'many',
 'may',
 'me',
 'member',
 'members',
 'men',
 'might',
 'more',
 'most',
 'mostly',
 'mr',
 'mrs',
 'much',
 'must',
 'my',
 'myself',
 'n',
 'necessary',
 'need',
 'needed',
 'needing',
 'needs',
 'never',
 'new',
 'newer',
 'newest',
 'next',
 'no',
 'non',
 'not',
 'nobody',
 'noone',
 'nothing',
 'now',
 'nowhere',
 'number',
 'numbered',
 'numbering',
 'numbers',
 'o',
 'of',
 'off',
 'often',
 'old',
 'older',
 'oldest',
 'on',
 'once',
 'one',
 'only',
 'open',
 'opened',
 'opening',
 'opens',
 'or',
 'order',
 'ordered',
 'ordering',
 'orders',
 'other',
 'others',
 'our',
 'out',
 'over',
 'p',
 'part',
 'parted',
 'parting',
 'parts',
 'per',
 'perhaps',
 'place',
 'places',
 'point',
 'pointed',
 'pointing',
 'points',
 'possible',
 'present',
 'presented',
 'presenting',
 'presents',
 'problem',
 'problems',
 'put',
 'puts',
 'q',
 'quite',
 'r',
 'rather',
 'really',
 'right',
 'room',
 'rooms',
 's',
 'said',
 'same',
 'saw',
 'say',
 'says',
 'second',
 'seconds',
 'see',
 'seem',
 'seemed',
 'seeming',
 'seems',
 'sees',
 'several',
 'shall',
 'she',
 'should',
 'show',
 'showed',
 'showing',
 'shows',
 'side',
 'sides',
 'since',
 'small',
 'smaller',
 'smallest',
 'so',
 'some',
 'somebody',
 'someone',
 'something',
 'somewhere',
 'state',
 'states',
 'still',
 'such',
 'sure',
 't',
 'take',
 'taken',
 'than',
 'that',
 'the',
 'their',
 'them',
 'then',
 'there',
 'therefore',
 'these',
 'they',
 'thing',
 'things',
 'think',
 'thinks',
 'this',
 'those',
 'though',
 'thought',
 'thoughts',
 'three',
 'through',
 'thus',
 'to',
 'today',
 'together',
 'too',
 'took',
 'toward',
 'turn',
 'turned',
 'turning',
 'turns',
 'two',
 'u',
 'under',
 'until',
 'up',
 'upon',
 'us',
 'use',
 'uses',
 'used',
 'v',
 'very',
 'w',
 'want',
 'wanted',
 'wanting',
 'wants',
 'was',
 'way',
 'ways',
 'we',
 'well',
 'wells',
 'went',
 'were',
 'what',
 'when',
 'where',
 'whether',
 'which',
 'while',
 'who',
 'whole',
 'whose',
 'why',
 'will',
 'with',
 'within',
 'without',
 'work',
 'worked',
 'working',
 'works',
 'would',
 'x',
 'y',
 "ve",
 'year',
 'years',
 'yet',
 'you',
 'young',
 'younger',
 'youngest',
 'your',
 'yours',
 'z']
