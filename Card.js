class Card {

    // card = {
    //     id: 1,
    //     text: 'text',
    //     order: 123,
    //     work:true, false,
    //     time: number 
    //     edit: false
    // }
    key = 'cardList';

    constructor() {
        this.getList();
    }

    getList() {
        const cardList = localStorage.getItem(this.key);
        this.listCard = cardList ? JSON.parse(cardList) : [];
    }

    saveCardList() {
        localStorage.setItem(this.key, JSON.stringify(this.listCard))
    }

    getNewCardKey() {
        let maxkey = 0;
        if (this.listCard.length) {
            this.listCard.forEach(value => {
                maxkey = maxkey > value.id ? maxkey : value.id
            })
        }
        return ++maxkey;
    }

    editCard(card) {
        const cardIndex = this.listCard.findIndex(value => value.id === card.id);
        if (cardIndex === -1) {
            this.addCard(card.text)
            return;
        }
        this.listCard[cardIndex] = card;
        this.saveCardList();
    }

    addCard(text) {
        let order = this.listCard.length ? this.listCard[this.listCard.length - 1].order + 1 : 1;
        if (!text) {
            text = order
        }
        const card = {
            text: text,
            work: false,
            id: this.getNewCardKey(),
            edit: false,
            order
        };
        this.listCard.push(card);
        this.saveCardList();
    }

    getCards() {
        return [...this.listCard];
    }

    removeCard(key) {
        const cardIndex = this.listCard.findIndex(value => value.id === key);
        if (cardIndex === -1) {
            this.addCard(card.text)
            return;
        }
        this.listCard.splice(cardIndex, 1);
        this.saveCardList();
    }

    appCard(key) {
        const cardIndex = this.listCard.findIndex(value => value.id === key);
        if (cardIndex === -1) {
            this.addCard(card.text)
            return;
        }
        this.listCard[cardIndex].order += 1;
        this.listCard[cardIndex + 1].order -= 1;
        this.sortList();

    }
    downCard(key) {
        const cardIndex = this.listCard.findIndex(value => value.id === key);
        if (cardIndex === -1) {
            this.addCard(card.text)
            return;
        }
        this.listCard[cardIndex].order -= 1;
        this.listCard[cardIndex - 1].order += 1;
        this.sortList();
    }

    sortList() {
        this.listCard.sort((a, b) => {
            return a.order - b.order;
        })
        this.saveCardList();
    }

}


const cardService = new Card();