(function(){//Función anónima para no contaminar el scope general
    self.Board = function(width, height){
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        
    }

    self.Board.prototype = {
        get elements(){//Método para obtener los elementos, debe de sobreescribirse
            //al de la clase canvas
            var elements = this.bars.map(function(bar){//Se decide pasar una copia del arreglo
                return bar;//No pasar por referencia, recolector de basura no puede con él
            });
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
        this.speed = 3;
        board.ball = this;
        this.kind = "circle";
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI/12;

        
    }
    self.Ball.prototype = {
        move: function(){
            this.x += this.speed_x * this.direction;
            this.y += this.speed_y;
        },
        get width(){
            return this.radius * 2;
        },
        get height(){
            return this.radius * 2;
        },
        collision: function(bar){//Se genera la reacción de la pelota, se recibe la barra
            //de la colisión
            var relative_intersect_y = ( bar.y + (bar.height/2)) - this.y;
            var normalize_intersect_y = relative_intersect_y/(bar.height/2);
            //Se calcula el ángulo con el que se mueve la pelota
            this.bounce_angle = normalize_intersect_y * this.max_bounce_angle;
            this.speed_y = this.speed * (-1) * Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);
            if(this.x > (this.board.width/2)){//Se cambia la dirección si se logra colisionar
                //con una barra
                this.direction = -1;
            }else{
                this.direction = 1;
            }
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
        clean: function(){//Función para borrar la pantalla
            this.ctx.clearRect(0,0,this.board.width,this.board.height);
        },
        draw: function(){
            for(var i = this.board.elements.length - 1 ; i>=0; i--){
                var el = this.board.elements[i];
                draw(this.ctx,el);
            };
        },
        check_collisions: function(){
            for(var i = this.board.bars.length - 1 ; i>=0; i--){
                var bar = this.board.bars[i];
                if(hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
            };
        },
        play: function(){
            if(this.board.playing){//Se mueve la bola solo si está en juego
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
            /*
            this.clean();
            this.draw();
            this.board.ball.move();
            */

        }
    }

    function hit(a,b){//Revisa si objeto a colisiona con b
        var hit = false;
        //Colisiones horizontales
        if(b.x + b.width >= a.x && b.x < a.x + a.width){
            //Colisiones verticales
            if(b.y + b.height >= a.y && b.y < a.y + a.height){
                hit = true;
            }
        }
        //Colision de a con b
        if(b.x <= a.x && b.x + b.width >= a.x + a.width){
            if(b.y <= a.y && b.y + b.height >= a.y + a.height){
                hit = true;
            }
        }
        //Colision de b con a
        if(a.x <= b.x && a.x + a.width >= b.x + b.width){
            if(a.y <= b.y && a.y + a.height >= b.y + b.height){
                hit = true;
            }
        }
        return hit;
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
var bar_2 = new Bar(20,100,40,100,board);
var bar = new Bar(735,100,40,100,board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas, board);
var ball = new Ball(350,100,10,board);

requestAnimationFrame(controller);//Esta linea es para que se vea la animación de que se están
//moviendo las barras

document.addEventListener("keydown",function(ev){
    //console.log(ev.keyCode);// Para ver el código que recibe el teclado

    //ev.preventDefault();//Para evitar que la página baje en el navegador
    if(ev.keyCode == 38){//Se presionó la tecla hacia arriba
        ev.preventDefault();
        bar.up();
    }else if(ev.keyCode == 40){//Se presionó la tecla hacia arbajo
        ev.preventDefault();
        bar.down();
    }else if(ev.keyCode == 87){//Se presionó la tecla 'w'
        ev.preventDefault();
        bar_2.up();
    }else if(ev.keyCode == 83){//Se presionó la tecla 's'
        ev.preventDefault();
        bar_2.down();
    }else if(ev.keyCode == 32){//Se presionó la tecla ' ' -> Espaciadora
        ev.preventDefault();
        board.playing = !board.playing;
    }

    //Se imprime en consola la posición de las barras
    //console.log(""+bar);
    //console.log(""+bar_2);
})//Se accede al DOM mismo para mover las barras

board_view.draw();//Se le instruye al board_view que se muestre una vez para no
//mostrar la página en blanco
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