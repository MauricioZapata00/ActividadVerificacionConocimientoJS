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
            elements.push(this.ball);
            return elements;
        }
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
        draw: function(){
            for(var i = this.board.elements.length - 1 ; i>=0; i--){
                var el = this.board.elements[i];
                draw(this.ctx,el);
            };
        }
    }

    function draw(ctx, element){
        if(element != null && element.hasOwnProperty("kind")){//Se valida que el objeto 
            //tenga una tipo y que no sea nulo (por ahora la bola es nula)
            switch(element.kind){
                case "rectangle":
                    ctx.fillRect(element.x,element.y,element.width,element.height);
                    break;
            }
        }
    }
})();

//Se colocan aquí las variables para que todas las clases tengan acceso a ellas
var board = new Board(800,400);
var bar = new Bar(20,100,40,100,board);
var bar = new Bar(735,100,40,100,board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas, board);

document.addEventListener("keydown",function(ev){
    //console.log(ev.keyCode);// Para ver el código que recibe el teclado

    if(ev.keyCode == 38){//Se presionó la tecla hacia arriba
        bar.up();
    }else if(ev.keyCode == 40){
        bar.down();
    }

    //Se imprime en consola la posición de las barras
    console.log(""+bar);
})//Se accede al DOM mismo para mover las barras

window.addEventListener("load",main)//Esta línea va a cambiar con el tiempo

function main(){//Función que va a correr el juego
    /*
    //Para que funcione, se mueven estas líneas de código al EventListener del DOM
    //Se puede mejorar pero en el video de práctica se decide hacerlo así
    var board = new Board(800,400);
    var bar = new Bar(20,100,40,100,board);
    var bar = new Bar(735,100,40,100,board);
    var canvas = document.getElementById('canvas');
    var board_view = new BoardView(canvas, board);
    */
    board_view.draw();//Se dibuja solo una vez
}