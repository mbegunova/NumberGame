var colors = [
    '#fbeae2',
    '#ffb082',
    '#d44739',
    '#5d9783',
    '#cae1d4',
    '#e7e9ed'
];

let animations = [
    'pulse',
    'bord_radius',
    'rotate',
    'textpulse',
]

function getRandomInt(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}


class GameField{
//МОЙ КОД
//максимум 5х5 кнопок, по 2 попытки на каждый уровень. Начинаем с 3х3
    lvl = 3; //размер матрицы формируемой на экране
    difficult = 1; //сложность формируемых чисел
    right_answ = 0; //счетчик правильных ответов
    wrong_answ = 0; //счетчик неправильных ответов
    current_number; //текущее выбранное число из массива
    objects; //массив текущих чисел
    points=0;
    playerschoise;

    constructor(lvl, difficult)//в зависимости от степени прохождения создает объекты
    {
        this.lvl = lvl;
        this.difficult = difficult;
        this.create_divs();
        this.create_btns();
        this.current_number = this.objects[getRandomInt(0, this.objects.length-1)];
        document.getElementById('finder').innerText = "Найдите указанное число: " + this.current_number+"";
    }

    animationGone(){ //анимация кнопок слайд влево
        let parent = document.getElementById('parent');
        parent.style.animationName = 'fade';
    }
    imgshow(){
        var done = false;
        let img;
        if(this.playerschoise) {
            img = document.createElement('img');
            img.src = 'images/yes.png';
        }
        else{
            img = document.createElement('img');
            img.src = 'images/no.png';
        }
        img.style.marginTop = '30px';
        let parent = document.getElementById('parent');
        parent.appendChild(img);
        window.setTimeout(() => {img.parentNode.removeChild(img);}, 800);
    }

    update(lvl, difficult){ //обновление очередного поля
        this.animationGone();
        this.removeField();
        this.imgshow();
        setTimeout(()=>{
            this.lvl = lvl;
            this.difficult = difficult;
            this.create_divs();
            this.create_btns();
            this.current_number = this.objects[getRandomInt(0, this.objects.length-1)];
            document.getElementById('finder').innerText = "Найдите указанное число: " + this.current_number+"";
        }, 1000)
    }
    create_divs(){
        let nav, inner_nav;
        let parent = document.getElementById('parent');
        for(var j=0; j<this.lvl;j++){
            nav = document.createElement('div');
            nav.className = 'col-div';
            for(var i=0; i<this.lvl;i++){
                inner_nav = document.createElement('div');
                inner_nav.className = 'row-div';
                nav.appendChild(inner_nav);
            }
            parent.appendChild(nav);
        }
    }

    create_btns(){
        var size;
        if(this.lvl==3) size='big';
        else if(this.lvl==4) size='middle';
        else if(this.lvl==5) size='small';
        this.objects=[];
        let divs = document.getElementsByClassName('row-div');
        for(var j=0; j<this.lvl*this.lvl;j++) {
            let btn = document.createElement('button');
            this.objects[j] = getRandomInt(10, 1500);
            if (this.difficult<9) this.objects[j]*=this.difficult;
            else this.objects[j]*=9;
            btn.innerText = this.objects[j];
            btn.className = 'btn-for-game';
            btn.classList.add(size);
            btn.style.backgroundColor = colors[getRandomInt(0,colors.length-1)];
            btn.style.animationName = animations[getRandomInt(0, animations.length)];
            btn.onclick = function (e) {
                var q = e.target.innerText;
                game.number_check(q);
                game.update(game.lvl, game.difficult);
            }
            divs[j].appendChild(btn);
        }
        let parent = document.getElementById('parent');
        parent.style.animationName = 'show';
    }


    lvlup(){
        if(this.difficult<3)  { this.lvl=3; this.points+=5;}
        else if(this.difficult<6) {this.lvl=4; this.points+=10;}
        else { this.lvl = 5; this.points+=20;}
    }

    number_check(q){
        let level = document.getElementById('level');
        let points = document.getElementById('points');
        if (q!=this.current_number) {
            this.wrong_answ++;
            this.playerschoise=false;
        }
        else{
            this.playerschoise=true;
            this.right_answ++;
            this.difficult++;
        }
        this.lvlup();
        level.innerText = "Уровень "+this.difficult;
        points.innerText = "Всего очков: " + this.points;
    }
    removeField(){
        let parent = document.getElementById('parent');
        parent.innerHTML="";
    }
}

function Timer(){
    sec--;
    let time = document.getElementById('time');
    if (sec<10) time.innerText = "Время: 00:0"+ sec;
    else time.innerText = "Время: 00:"+ sec;
}

function timeIsOver(){     //Панель с результатами
    let time = document.getElementById('time');
    time.innerText ="Время: 00:00";
    game.removeField();
    var finder = document.getElementById('finder');
    finder.parentNode.removeChild(finder);
    var parent = document.getElementById('parent');
    let p = document.createElement('p');
    p.innerText = "Правильных ответов: "+game.right_answ;
    parent.appendChild(p);
    p = document.createElement('p');
    var zn = Math.round(game.right_answ/(game.right_answ+game.wrong_answ)*100);
    p.innerText = "Точность ответов: " ;
    if((game.wrong_answ+game.right_answ)!=0)p.innerText =+ zn +"%";
    parent.appendChild(p);
    p = document.createElement('p');
    p.innerText = "Всего очков: " + game.points;
    parent.appendChild(p);

    let btn = document.createElement('button');
    btn.innerText = "Еще раз";
    btn.className = 'btn-for-game';
    btn.classList.add('big');
    btn.classList.add('again');
    btn.style.backgroundColor = '#fbeae2';
    parent.appendChild(btn);
    btn.addEventListener('click', event => {
        window.location.reload();
    })
}




var sec = 60
var game = new GameField(3, 1);
//создаем поле
//обновлять каждую секунду
let timerId = setInterval(() => Timer(), 1000);
//остановить через 60 секунд
setTimeout(() => {
    clearInterval(timerId);
    timeIsOver();
}, 60000);


