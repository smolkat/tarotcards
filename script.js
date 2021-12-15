// constants
var root = "Cards"
var extension = ".jpg"
var transparent_extension = ".png"
var deck = []
var inverted = []
var total_cards = associations.length
// spread variables
var three_spread_count = 1
function threeSpread() {
    if(deck.length){
        if (three_spread_count <= 3){
            drawForElement(three_spread_count++)
            updateDeckCount()
        }
        else {
            three_spread_count = 1
            resetThreeCardSpread()
        }
    }
    else{
        updateDeckCount("Out of cards!<br/>Reshuffle?")
    }
    
}

function updateDeckCount(optional) {
    deck_count = document.getElementById("deck-count")
    if(optional != null){
        deck_count.innerHTML = optional
        return
    }
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
        }        
    }
}

function drawForElement(id) {
    card_id = "card-" + id
    cardelement = document.getElementById(card_id)
    card = deck.splice(0, 1)
    console.log("Drew a card("+ card+ (inverted[card]?"inv":"") +"): ", deck)
    cardelement.src = root + "/" + associations[card].image_name + extension

    if (inverted[card]) {
        cardelement.classList.add("card-rotated")
        updateInvertedKeywordsOfElement(card_id, card)
    }
    else{
        cardelement.classList.remove("card-rotated")
        updateKeywordsOfElement(card_id, card)
    }

    updateCommonDetails(card_id, card)
}

function updateCommonDetails(card_id, card){
    updateDescriptionOfElement(card_id, card)    
    updateNameOfElement(card_id, card)
    updateShortDesc(card_id, card)
}

function updateShortDesc(id, card){
    shortd = document.getElementById(id + "-short-desc")
    shortd.innerHTML = "<q>" + associations[card].short_description + "</q>"
}

function updateKeywordsOfElement(id, card) {
    //console.log(id)
    keywords = document.getElementById(id + "-keywords")
    keywords.innerHTML = "<h3>Keywords</h3>" + associations[card].keywords
}

function updateInvertedKeywordsOfElement(id, card) {
    //console.log(id)
    keywordsi = document.getElementById(id + "-keywords-inverted")
    keywordsi.innerHTML = "<h3>Inverted Keywords</h3>" + associations[card].reversed_keywords
}

function updateDescriptionOfElement(id, card) {
    //console.log(id + "-description")
    description = document.getElementById(id + "-description")
    description.innerHTML = "<h3>Description</h3>" + associations[card].long_description
}

function updateNameOfElement(id, card){
    //console.log(id)
    card_name = document.getElementById(id + "-name")
    card_name.innerHTML = "<h2>"+ associations[card].name + (inverted[card]?"(Inv)":"") +"</h2>"
}

function randomcard() {
    let random_card = Math.floor(Math.random() * total_cards);
    // console.log(random)
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
        inverted[index] = Math.floor(Math.random() * 2)
    }
    console.log("Generated set in order", cards)
    // to be used to keep track of the main deck
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

create_deck()
shuffle_deck()