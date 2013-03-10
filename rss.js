var feedparser = require('feedparser');
var jQuery = require('jquery')
var $ = jQuery;
parser = new feedparser();






/* RSS Stuff */

function RSS(url_list, callback) {
    function strip_html(html) {
        return $('<div>').html(html).text()
    }
    
    function receive_rss_article(article){
        callback( strip_html(article.title) )
    }

    // get all of the pagse from url_list
    for (var i=0; i<url_list.length; i++) {
        feedparser.parseUrl(url_list[i]).on('article', receive_rss_article)
    }
}






/* Markov Chain */

function Markov(ngram_level) {
    this.markov_brain = {}

    this.preprocess = function(text) {
        var sentences = text.split(". ")
        var chunks = []
        var words, num_chunks
        for(var j=0; j<sentences.length; j++) {
            words = text.toLowerCase().replace(/[^a-z ]/g, '').replace(/ +/g,' ').replace(/[\r\n]/g,'').split(' ')
            num_chunks = Math.ceil( words.length / ngram_level )
            for (var i=0; i<num_chunks; i++) {
                chunks.push( words.slice(i*ngram_level, (i+1)*ngram_level).join(" ") )
            }
        }
        return chunks
    }

    this.learn_text = function(text) {
        this.learn_chain( this.preprocess(text) )
    }

    this.learn_chain = function(chain) {
        if (chain.length < ngram_level) { return }
        for (var i=1; i<chain.length; i++) {
            this.learn_word(chain[i-1], chain[i])
        }
        this.learn_word(chain[chain.length-1], '.') // end of sentence element
    }

    this.learn_word = function(word1, word2) {
        if (! this.markov_brain[word1]) { this.markov_brain[word1] = [] }
        this.markov_brain[word1].push(word2)
    }

    this.get_response = function(sentence) {
        var chunks = this.preprocess(sentence)
        var chunk = chunks[ Math.floor(Math.random()*chunks.length) ]
        return this.generate_chain(chunk)
    }

    this.generate_chain = function(word) {
        var chain = [ ]
        while (word != '.') {
            chain.push(word)
            word = this.get_next_word(word)
        }
        return chain
    }

    this.get_next_word = function(word) {
        var words = this.markov_brain[word]
        if (!words || words.length < 1) return '.'
        return words[ Math.floor(Math.random()*words.length) ]
    }

}




/* Initiation Code */

var feeds = [
    "http://feeds.bbci.co.uk/news/world/rss.xml",
    "http://feeds.guardian.co.uk/theguardian/world/rss",
    "http://feeds.reuters.com/Reuters/worldNews",
    "http://rss.msnbc.msn.com/id/3032091/device/rss/rss.xml",
    "http://www.telegraph.co.uk/news/worldnews/rss",
    "http://rssfeeds.usatoday.com/UsatodaycomWorld-TopStories",
    "http://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://news.google.com/news/feeds?cf=all&ned=uk&hl=en&topic=w&output=rss",
    "http://rss.cnn.com/rss/edition_world.rss",
    "http://feeds.abcnews.com/abcnews/internationalheadlines",
    "http://www.foxnews.com/about/rss/feedburner/foxnews/latest",
    "http://www.cbsnews.com/feeds/rss/main.rss",
    "http://feeds.washingtonpost.com/rss/world",
]

var marky = new Markov(1)

RSS(feeds, function(description) {
    marky.learn_text(description)
})




/* REPL */

process.stdin.resume();
process.stdin.setEncoding('utf8');
 
console.log("you> ");
process.stdin.on('data', function (chunk) {
    var c=chunk.toString()
    if(c.match(/showbrain/)) {
        console.log(marky.markov_brain)
    } else {
        marky.learn_text(c)
        console.log("marky> " + marky.get_response(c).join(' '))
        console.log("you> ");
    }
});


