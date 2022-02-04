(function(){//Función anónima para no contaminar el scope general
    self.Board = function(width, height){
        this.width = width;
        this.height = height;
        this.plating = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    self.Board.prototype = {
        get elements(){//Método para obtener los elementos, debe de sobreescribirse
            //al de la clase canvas
            var elements = this.bars;
            //elements.push(this.ball); //Para que no se tarde mucho en hacer la animación
            elements.push(this.ball);
            return elements;
        }
    }
})();

(function(){//Función anónima para dibujar la bola
    self.Ball = function(x,y,radius,board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.board = board;
        this.speed_y = 0;
        this.speed_x = 3;
        board.ball = this;
        this.kind = "circle";
    }
})();

(function(){//Función anónima para dibujar las barras en la vista
    self.Bar = function(x,y,width,height,board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);//Se pasan las barras al mismo elemento board
        this.kind = "rectangle";//Si es circulo o cuadrado la barra a pintar
        this.speed = 10; // Velocidad con lo que se mueven las barras
    }

    self.Bar.prototype = {
        down: function(){//Funciones para mover la barra hacia abajo
            this.y += this.speed;//Mueve la barra a la velocidad establecida
        },
        up: function(){//Funciones para mover la barra hacia arriba
            this.y -= this.speed;//Mueve la barra a la velocidad establecida
        },
        toString: function(){//Se sobrecarga el método toString para que imprima las
            //coordenadas
            return "x: " + this.x + " y: " + this.y;
        }
    }
})();
(function(){//Función anónima para dibujar la vista
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");//Para dibujar en 2D
    }

    self.BoardView.prototype = {
        clean: function(){//Función para borrar la pantalla
            this.ctx.clearRect(0,0,this.board.width,this.board.height);
        },
        draw: function(){
            for(var i = this.board.elements.length - 1 ; i>=0; i--){
                var el = this.board.elements[i];
                draw(this.ctx,el);
            };
        },
        play: function(){
            board_view.clean();
            board_view.draw();
        }
    }

    function draw(ctx, element){
        /*if(element != null && element.hasOwnProperty("kind")){//Se valida que el objeto 
            //tenga una tipo y que no sea nulo (por ahora la bola es nula)
            switch(element.kind){
                case "rectangle":
                    ctx.fillRect(element.x,element.y,element.width,element.height);
                    break;
            }
        }
        */
        switch(element.kind){
            case "rectangle":
                ctx.fillRect(element.x,element.y,element.width,element.height);
                break;

            case "circle":
                ctx.beginPath();
                ctx.arc(element.x,element.y,element.radius,0,7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }
})();

//Se colocan aquí las variables para que todas las clases tengan acceso a ellas
var board = new Board(800,400);
var bar = new Bar(20,100,40,100,board);
var bar_2 = new Bar(735,100,40,100,board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas, board);
var ball = new Ball(350,100,10,board);

requestAnimationFrame(controller);//Esta linea es para que se vea la animación de que se están
//moviendo las barras

document.addEventListener("keydown",function(ev){
    //console.log(ev.keyCode);// Para ver el código que recibe el teclado

    ev.preventDefault();//Para evitar que la página baje en el navegador
    if(ev.keyCode == 38){//Se presionó la tecla hacia arriba
        bar.up();
    }else if(ev.keyCode == 40){//Se presionó la tecla hacia arbajo
        bar.down();
    }else if(ev.keyCode == 87){//Se presionó la tecla 'w'
        bar_2.up();
    }else if(ev.keyCode == 83){//Se presionó la tecla 's'
        bar_2.down();
    }

    //Se imprime en consola la posición de las barras
    //console.log(""+bar);
    //console.log(""+bar_2);
})//Se accede al DOM mismo para mover las barras

window.addEventListener("load",controller)//Esta línea va a cambiar con el tiempo

function controller(){//Función que va a correr el juego
    /*
    //Para que funcione, se mueven estas líneas de código al EventListener del DOM
    //Se puede mejorar pero en el video de práctica se decide hacerlo así
    var board = new Board(800,400);
    var bar = new Bar(20,100,40,100,board);
    var bar = new Bar(735,100,40,100,board);
    var canvas = document.getElementById('canvas');
    var board_view = new BoardView(canvas, board);
    */
    /*
    board_view.clean();
    board_view.draw();//Se dibuja solo una vez
    */
    board_view.play();
    requestAnimationFrame(controller);
}