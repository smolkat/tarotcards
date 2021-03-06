// constants
var root = "Cards"
var extension = ".jpg"
var transparent_extension = ".png"
var deck = []
var inverted = []
var total_cards = associations.length
var default_values = ["<h1>Past</h1>", "<h1>Present</h1>", "<h1>Future</h1>", "<em>The past can only be recollected, not changed. This card represents your previous experiences</em>", "<em>This card represents the current state you are in, and what you might be thinking about right now</em>", "<em>The future holds great opportunities, and dangers. This card gives you an insight into what may lie ahead</em>"]
var intro_message = "<p>The Past-Present-Future spread is one of the most straightforward spreads. As the name suggests, it can offer great insight to help understand how the past influences present circumstance, what’s going on in the present moment…and how the choices you make in the present may unfold in the future.</p>"
var screen_to_card_ratio = 5
var min_card_width = 160
var chance_of_inverted = 0.4
// spread variables
var three_spread_count = 1
// tts
var msg
var voices
var playing = 0

function threeSpread(element) {
    if (deck.length) {
        if (three_spread_count <= 3) {
            if (three_spread_count == 3)
                document.getElementById("draw-card").innerHTML = "New Spread"
            drawForElement(three_spread_count++)
            updateDeckCount()
        } else {
            three_spread_count = 1
            document.getElementById("draw-card").innerHTML = "Draw a Card"
            resetThreeCardSpread()
        }
    } else {
        updateDeckCount("Out of cards!<br/>Reshuffle?")
    }

}

function updateIntroMessage() {
    document.getElementById("intro").innerHTML = intro_message
}

function updateDeckCount(optional) {
    deck_count = document.getElementById("deck-count")
    if (optional != null) {
        deck_count.innerHTML = optional
        return
    }
    major_count = document.getElementById("count-major")
    minor_count = document.getElementById("count-minor")
    maj_count = 0;
    min_count = 0;
    deck.forEach(element => {
        if (element < 22) maj_count++;
        else min_count++;
    })
    major_count.innerHTML = maj_count
    minor_count.innerHTML = min_count
    deck_count.innerHTML = deck.length
}

function resetThreeCardSpread() {
    // reset images to card back image
    card1 = document.getElementById("card-1");
    card2 = document.getElementById("card-2");
    card3 = document.getElementById("card-3");
    card1.src = root + "/" + "back" + transparent_extension;
    card2.src = root + "/" + "back" + transparent_extension;
    card3.src = root + "/" + "back" + transparent_extension;

    // reset details
    details_collection = document.getElementsByClassName("card-details")

    for (let index = 0; index < details_collection.length; index++) {
        for (let j = 0; j < details_collection[index].childElementCount; j++) {
            details_collection[index].children[j].innerHTML = ""
            updateNameOfElement("card-" + (index + 1), null, default_values[index])
            updateDescriptionOfElement("card-" + (index + 1), null, default_values[index + 3])
        }
    }
}

function drawForElement(id) {
    card_id = "card-" + id
    cardelement = document.getElementById(card_id)
    card = deck.splice(0, 1)
    console.log("Drew a card(" + card + (inverted[card] ? "inv" : "") + "): ", deck)
    cardelement.src = root + "/" + associations[card].image_name + extension

    if (inverted[card]) {
        cardelement.classList.add("card-rotated")
        updateInvertedKeywordsOfElement(card_id, card)
    } else {
        cardelement.classList.remove("card-rotated")
        updateKeywordsOfElement(card_id, card)
    }

    updateCommonDetails(card_id, card)
}

function updateCommonDetails(card_id, card) {
    updateDescriptionOfElement(card_id, card)
    updateNameOfElement(card_id, card)
    updateShortDesc(card_id, card)
}

function updateShortDesc(id, card) {
    shortd = document.getElementById(id + "-short-desc")
    shortd.innerHTML = "<q>" + associations[card].short_description + "</q>"
}

function updateKeywordsOfElement(id, card) {
    keywords = document.getElementById(id + "-keywords")
    keywords.innerHTML = "<h3>Keywords</h3>" + associations[card].keywords
}

function updateInvertedKeywordsOfElement(id, card) {
    keywordsi = document.getElementById(id + "-keywords-inverted")
    keywordsi.innerHTML = "<h3>Inverted Keywords</h3>" + associations[card].reversed_keywords
}

function updateDescriptionOfElement(id, card, optional_desc) {
    description = document.getElementById(id + "-description")
    if (optional_desc != null) {
        description.innerHTML = optional_desc
        return
    }
    description.innerHTML = "<h3>Description</h3>" + associations[card].long_description
}

function updateNameOfElement(id, card, optional_name) {
    card_name = document.getElementById(id + "-name")
    if (optional_name != null) {
        card_name.innerHTML = "<h1>" + optional_name + "</h1>"
        return
    }
    card_name.innerHTML = "<h1>" + associations[card].name + (inverted[card] ? "(Inv)" : "") + "</h1>"
}

function randomcard() {
    let random_card = Math.floor(Math.random() * total_cards);
    return random_card
}

function create_deck() {
    random_order()
    resetThreeCardSpread()
    total_cards_element = document.getElementById("cards-total")
    total_cards_element.innerHTML = total_cards
    deck_cards_element = document.getElementById("deck-count")
    deck_cards_element.innerHTML = deck.length
    console.log("The deck is: ", deck, inverted)
}

function shuffle_deck() {
    cut()
    console.log("After shuffle the deck is: ", deck, inverted)
}

function cut() {
    cut_point = Math.floor(Math.random() * deck.length)
    console.log("Cut point: ", cut_point)
    first_half = deck.slice(0, cut_point)
    second_half = deck.slice(cut_point, deck.length)
    deck = second_half.concat(first_half)
}

function random_order() {
    let cards = []
    for (let index = 0; index < total_cards; index++) {
        // generated set of cards
        cards[index] = index
        // inverted or upright
        inverted[index] = Math.random() < chance_of_inverted ? 1 : 0;
    }
    // used to keep track of the main deck
    index = 0
    while (cards.length > 0) {
        // pick a random card from the generated set
        random_point = Math.floor(Math.random() * cards.length)
        deck[index] = cards[random_point]
        // remove the random card from the generated set
        cards.splice(random_point, 1)
        index++
    }
}

function invertCard(position) {
    if (inverted[position])
        inverted[position] = 0
    else
        inverted[position] = 1
}

function set_card_height() {
    cardCollection = document.getElementsByClassName("card")
    cardArray = Array.prototype.slice.call(cardCollection)
    cardArray.forEach(element => { element.setAttribute("width", Math.min(window.innerWidth / screen_to_card_ratio, min_card_width)) })
}

function speakContent(text = "Text to speach works correctly", trim) {
    text = text.slice(trim, text.length)
    msg.text = text;
    // toggle play
    if (playing) {
        playing = 0;
        window.speechSynthesis.cancel()
    } else {
        playing = 1;
        window.speechSynthesis.speak(msg)
        msg.onend = function (event) {
            playing = 0
            console.log('Finished in ' + event.elapsedTime / 1000 + ' seconds.');
        };
    }
}

function init() {

    // tts
    if ('speechSynthesis' in window) {
        msg = new SpeechSynthesisUtterance()
        voices = window.speechSynthesis.getVoices()
        let voice_index = 0
        voices.forEach((element, index) => { if (element.name = "Microsoft Zira Desktop - English (United States)") voice_index = index });
        msg.voice = voices[voice_index]
        console.log("Voices available: ", voices.length)
    } else {
        // Speech Synthesis Not Supported 😣
        alert("Sorry, your browser doesn't support text to speech!");
    }

    // set card dimensions based on screen width
    set_card_height()

    // other
    create_deck()
    shuffle_deck()
    updateIntroMessage()
    updateDeckCount()

    // remove stats on mobile for now
    if(window.innerWidth < 600){
        col = document.getElementsByClassName("card-info")
        arr = Array.prototype.slice.call(col)
        arr.forEach(e=>e.remove())
    }
}
