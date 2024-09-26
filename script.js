//проблема в навыках персонажей, энергии и маны всегда недостаточно
// строка 162



//ограничит хар-ки персонажей
const gameParametres = {
    MAX_LEVEL: 10,
    MAX_STAT: 99,
    MIN_STAT: 10
};
//ограничит разнообразие персонажей
const gameClasses = {
    Mage: "Маг",
    Knight: "Рыцарь",
    Hero: "Класс"
};

//персонаж, созданный через форму
let playHero = null;
//персонаж, приходящий с сервера
let enemyHero = null;
//добавление героя игрока на экран
const sendToBattleButton = document.getElementById("sendToBattleButton")
//вывод героя оппонента на экран
const getEnemyButton = document.getElementById("getEnemyButton")
//действие героя игрока
const doSkillButton = document.getElementById("doSkillButton")
//начало баттла
const startBattleButton = document.getElementById("startBattleButton")


function displayPlayerHero(hero) {
    document.getElementById("playerHeroClass").innerHTML = gameClasses[hero.constructor.name];
    document.getElementById("playerHeroName").innerHTML = hero.name;
    document.getElementById("playerHeroLevel").innerHTML = hero.level;
    document.getElementById("playerHeroHp").innerHTML = hero.healthPoints;
    document.getElementById("playerHeroStrength").innerHTML = hero.stats.str;
    document.getElementById("playerHeroIntelligence").innerHTML = hero.stats.int;
    document.getElementById("playerHeroAgility").innerHTML = hero.stats.agi;

    hero.displayHero();
}

function displayEnemyHero(hero) {
    document.getElementById("enemyHeroClass").innerHTML = gameClasses[hero.constructor.name];
    document.getElementById("enemyHeroName").innerHTML = hero.name;
    document.getElementById("enemyHeroLevel").innerHTML = hero.level;
    document.getElementById("enemyHeroHp").innerHTML = hero.healthPoints;
    document.getElementById("enemyHeroStrength").innerHTML = hero.stats.str;
    document.getElementById("enemyHeroIntelligence").innerHTML = hero.stats.int;
    document.getElementById("enemyHeroAgility").innerHTML = hero.stats.agi;

    hero.displayHero();
}
//получение инфы об герое игрока
sendToBattleButton.onclick = () => {
    const heroName = document.getElementById("name").value;
    if (heroName !== "") {
        //COZDANIE
        const heroClass = document.querySelector('input[name="class"]:checked').value;
        const heroLevel = document.getElementById("level").value;
        const heroStats = {};
        heroStats.str = Number(document.getElementById("strength").value);
        if (heroStats.str > gameParametres.MAX_STAT) {
            heroStats.str = gameParametres.MAX_STAT;
        }
        heroStats.int = Number(document.getElementById("intelligence").value);
        if (heroStats.int > gameParametres.MAX_STAT) {
            heroStats.int = gameParametres.MAX_STAT;
        }
        heroStats.agi = Number(document.getElementById("agility").value);
        if (heroStats.agi > gameParametres.MAX_STAT){
            heroStats.agi = gameParametres.MAX_STAT;
        }
        const additionalAbility = document.querySelector('input[name="additionalAbility"]:checked').value;
        const additionalStat = document.getElementById("additionalStat").value;

        //верстка для персонажа
        if (heroClass === "Mage") {
            playHero = new Mage(heroName, heroLevel, 100, heroStats, additionalAbility, additionalStat);
        } else if (heroClass === "Knight") {
            playHero = new Knight(heroName, heroLevel, 100, heroStats, additionalAbility, additionalStat);
        } else {
            console.error("Чето все сломалось(");
            return;
        }

        displayPlayerHero(playHero);
        getEnemyButton.removeAttribute("disabled");
        doSkillButton.removeAttribute("disabled");


    } else {
        alert("Живо введите имя!!!");
    }
};


getEnemyButton.onclick = () => {
    fetch(`https://api-code.practicum-team.ru/heroes`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
            let randomEnemy = data[Math.floor(Math.random() * data.length)];
        console.log(randomEnemy);

        enemyHero = new Hero (
            randomEnemy.title,
            Math.floor(Math.random() * 10) + 1, //уровень
            randomEnemy.hp,
            {
                str: randomEnemy.str,
                int: randomEnemy.int,
                agi: randomEnemy.agi,

            }
        );
        displayEnemyHero(enemyHero);
            if(playHero) {
                startBattleButton.removeAttribute("disabled");
        }
    })
    .catch((error) => console.error("Ошибка: ", error));
};

function countStatsSum(hero) {
    let statsSum = 0;
    statsSum += hero.stats.str;
    statsSum += hero.stats.int;
    statsSum += hero.stats.agi;
    statsSum += hero.healthPoints;

    return statsSum;
}

function arena(firstHero, secondHero) {
    console.log(`Да начнутся же голодные игры между ${firstHero.name} и ${secondHero.name}! ХА-ХА-ХА!`);

    let winner = null;
    let firstHeroSum = countStatsSum(firstHero);
    let secondHeroSum = countStatsSum(secondHero);

    console.log("Сумма значений параметров первого героя: ", firstHeroSum);
    console.log("Сумма значений параметров второго героя: ", secondHeroSum);

    if (firstHeroSum > secondHeroSum) {
        winner = firstHero;
    } else if (firstHeroSum < secondHeroSum) {
        winner = secondHero;
    }


    if(winner) {
        console.log(`УРААААА!! ПОБЕДА ЗА : ${winner.name}`);
        alert(`УРААААА!! ПОБЕДА ЗА : ${winner.name}`);
    } else {//если остался null, значит значения равны
        console.log(`Победила дружба(())`);
        alert(`Победила дружба((`);

    }
    winner_res = window.localStorage.getItem(winner);
    console.log(winner_res); //что это такое вообще


}

startBattleButton.onclick = () => {
    arena(playHero, enemyHero);
};


doSkillButton.onclick = () => {
    if(playHero) {
        if(playHero.constructor.name === "Mage") {
            playHero.healHero(playHero);
        }else if (playHero.constructor.name === "Knight") {
            playHero.gainAgility(playHero);
        } else {
            console.log("Что-то не так блин((");
        }
    } else {
        alert("Сначала добавь игрока!!!!!!");
    }
    displayPlayerHero(playHero);

};
