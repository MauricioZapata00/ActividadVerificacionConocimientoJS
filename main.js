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
        get_elements(){//Método para obtener los elementos
            var elements = this.bars;
            elements.push(ball);
            return elements;
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
})();

window.addEventListener("load",main)//Esta línea va a cambiar con el tiempo

function main(){//Función que va a correr el juego
    var board = new Board(800,400);
    var canvas = document.getElementById('canvas');
    var board_view = new BoardView(canvas, board);
}