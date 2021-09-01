const list = document.querySelector('.js--list');
const btnAddCard = document.querySelector('.js--btn-add-card');

const body = document.querySelector('body');

const getTime = (millisec) => {
    let days = 0
    let hours = 0;
    let minutes = 0;
    let text = '';
    if (millisec >= 1000 * 60 * 60 * 24) {
        days = Math.floor(millisec / (1000 * 60 * 60 * 24));
        millisec = millisec - (days * 1000 * 60 * 60 * 24);
        text += days + 'd ';
    }
    if (millisec >= 1000 * 60 * 60) {
        hours = Math.floor(millisec / (1000 * 60 * 60));
        millisec = millisec - (hours * 1000 * 60 * 60);
        text += hours + 'h ';
    }
    if (millisec >= 1000 * 60) {
        minutes = Math.floor(millisec / (1000 * 60));
        millisec = millisec - (minutes * 1000 * 60)
        text += minutes + 'm ';
    }

    return text;
}


const createList = () => {
    list.innerHTML = '';
    let infoEditCard;
    cardService.getCards().reverse().forEach((card, index) => {
        const li = document.createElement('li');
        const btnDone = document.createElement('button');
        const btnRemove = document.createElement('button');
        const btnApp = document.createElement('button');
        const btnDown = document.createElement('button');
        const spanTime = document.createElement('span');

        const btnTime = document.createElement('button');

        li.classList.add('card');

        if (card.edit) {
            infoEditCard = card;
            const input = document.createElement('input');
            input.value = card.text;
            input.classList.add('card-time')
            input.autofocus = true;
            li.append(input)
        } else {
            const span = document.createElement('span');
            span.classList.add('js--card-span');
            span.textContent = card.text;
            li.append(span);
        }

        btnTime.classList.add('js--card-time');
        btnTime.textContent = 'Time';

        spanTime.textContent = card.time ? getTime(card.time) : 0

        btnDone.classList.add('js--card-close');
        btnDone.innerText = 'Done';

        btnRemove.classList.add('js--card-remove');
        btnRemove.innerText = 'Remove';

        btnApp.classList.add('js--card-app');
        btnApp.innerText = 'App';

        btnDown.classList.add('js--card-down');
        btnDown.innerText = 'Down';

        card.work && li.classList.add('done')

        li.setAttribute('data-id', card.id);
        li.append(btnTime)
        li.append(spanTime)
        li.append(btnDone);
        li.append(btnRemove);
        if (index !== 0) {
            li.append(btnApp);
        }
        if (cardService.getCards().length - 1 !== index) li.append(btnDown);
        list.append(li);
    })

    const inputCard = document.querySelector('input[autofocus]');
    if (inputCard) {
        inputCard.addEventListener("blur", (e) => {

            infoEditCard.text = e.target.value;
            infoEditCard.edit = !infoEditCard.edit;
            cardService.editCard(infoEditCard);
            createList();
        });
    }
}

btnAddCard.addEventListener('submit', (e) => {
    e.preventDefault();
    cardService.addCard(e.target.text.value);
    createList();
    e.target.text.value = ''
});

createList()


const objCard = (e) => {
    const idCard = parseInt(e.target.parentElement.getAttribute('data-id'));
    let thisCard;
    cardService.getCards().forEach(value => {
        if (value.id === idCard) thisCard = value;
    });
    return thisCard
}

body.addEventListener('click', (e) => {

    if (e.target.classList.contains('js--card-close')) {
        const thisCard = objCard(e);

        thisCard.work = !thisCard.work;
        cardService.editCard(thisCard);
        createList();
    } else if (e.target.classList.contains('js--card-remove')) {
        const idCard = parseInt(e.target.parentElement.getAttribute('data-id'));

        cardService.removeCard(idCard);
        createList();
    } else if (e.target.classList.contains('js--card-app')) {
        const idCard = parseInt(e.target.parentElement.getAttribute('data-id'));

        cardService.appCard(idCard);
        createList();
    } else if (e.target.classList.contains('js--card-down')) {
        const idCard = parseInt(e.target.parentElement.getAttribute('data-id'));

        cardService.downCard(idCard);
        createList();
    } else if (e.target.classList.contains('js--card-span')) {
        const thisCard = objCard(e);

        thisCard.edit = !thisCard.edit;
        cardService.editCard(thisCard);
        createList();
    } else if (e.target.classList.contains('js--card-time')) {
        const thisCard = objCard(e);
        const input = document.createElement('input');

        input.type = 'time'
        input.value = '00:00'
        e.target.before(input)
        e.target.disabled = true;

        if (input) {
            input.addEventListener("blur", (e) => {
                const newDate_NO_TIME = new Date().setHours(0, 0, 0, 0);
                let newDate = newDate_NO_TIME;

                newDate = new Intl.DateTimeFormat().format(newDate)
                newDate = newDate.split('.').reverse().join('-');
                let time = new Date(newDate + "T" + e.target.value);

                const spentTime = time - newDate_NO_TIME;

                if (thisCard.time) {
                    thisCard.time += spentTime;
                } else {
                    thisCard.time = spentTime;
                }
                cardService.editCard(thisCard);
                createList();
                e.target.remove();
                btn.disabled = false
            });
        }
    }
});