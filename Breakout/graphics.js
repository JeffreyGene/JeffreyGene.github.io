let Graphics = (function(){
        let that = {};
        let canvas;
        let context;
        let canvasTop;
        let contextTop;
        let canvasBottom;
        let contextBottom;
        let canvasMenu;
        let contextMenu;
        that.initialize = function(){
            canvas = document.getElementById('canvas');
            context = canvas.getContext('2d');
            canvasTop = document.getElementById('canvasTop');
            contextTop = canvasTop.getContext('2d');
            canvasBottom = document.getElementById('canvasBottom');
            contextBottom = canvasBottom.getContext('2d');
            canvasMenu = document.getElementById('canvasMenu');
            contextMenu = canvasMenu.getContext('2d');
        };

        that.drawTexture = function(spec) {
            context.save();
            
            context.translate(spec.center.x, spec.center.y);
            context.rotate(spec.rotation);
            context.translate(-spec.center.x, -spec.center.y);
            
            context.drawImage(
                spec.image, 
                spec.center.x - spec.size/2, 
                spec.center.y - spec.size/2,
                spec.size, spec.size);
            
            context.restore();
        }

        that.renderImage = function(image, x, y, width, height){
            context.drawImage(image, x, y, width, height);
        };

        that.drawRectangle = function(x, y, width, height, color){
            context.fillStyle = color;
            context.fillRect(x, y, width, height);
            context.strokeStyle = 'rgba(0, 0, 0, 1)';
            context.strokeRect(x, y, width, height);
        };

        that.drawText = function (text, x, y, font, fillStyle) {
            context.font = font;
            context.fillStyle = fillStyle;
            context.baseline = 'top';
            context.fillText(text, x, y);
        };

        that.drawPauseMenu = function(option){
            that.drawRectangle(0, 0, 1000, 500, 'rgba(220, 220, 220, 0.5)');
            that.drawRectangle(350, 99, 300, 157, 'rgba(0, 0, 0, 1)');
            that.drawRectangle(360, 109, 280, 137, 'rgba(220, 220, 220, 1)');
            
            if(option == 'resume'){
                that.drawRectangle(400, 121.33, 200, 50, 'rgba(0, 0, 255, 1)');
                that.drawText('Resume', 440, 157, '32px Arial, sans-serif', 'rgba(255, 255, 255, 1)');
                that.drawText('Quit', 470, 220, '32px Arial, sans-serif', 'rgba(0, 0, 0, 1)');
            }
            else if(option == 'quit'){
                that.drawRectangle(400, 183.67, 200, 50, 'rgba(0, 0, 255, 1)');
                that.drawText('Resume', 440, 157, '32px Arial, sans-serif', 'rgba(0, 0, 0, 1)');
                that.drawText('Quit', 470, 220, '32px Arial, sans-serif', 'rgba(255, 255, 255, 1)');
            }
            
        }

        that.drawScore = function (text, x, y) {
            contextBottom.fillStyle = 'rgba(220, 220, 220, 1)';
            contextBottom.fillRect(0, 0, 1000, 100);
            contextBottom.strokeStyle = 'rgba(0, 0, 0, 1)';
            contextBottom.strokeRect(0, 0, 1000, 100);
            contextBottom.font = '32px Arial, sans-serif';
            contextBottom.fillStyle = 'rgba(0, 0, 0, 1)';
            contextBottom.baseline = 'top';
            contextBottom.fillText(text, x, y);
        };
        that.drawLives = function (lives, x, y, width, height, color) {
            contextTop.fillStyle = 'rgba(220, 220, 220, 1)';
            contextTop.fillRect(0, 0, 1000, 100);
            contextTop.strokeStyle = 'rgba(0, 0, 0, 1)';
            contextTop.strokeRect(0, 0, 1000, 100);
            for (let i = 0; i < lives; i++) {
                contextTop.fillStyle = color;
                contextTop.fillRect(x - i * (width + 5), y, width, height);
                contextTop.strokeStyle = 'rgba(0, 0, 0, 1)';
                contextTop.strokeRect(x - i * (width + 5), y, width, height);
            }
        };

        that.drawMenu = function(option){
            //Draw background
            contextMenu.fillStyle = 'rgba(220, 220, 220, 1)';
            contextMenu.fillRect(0, 0, 1000, 1000);
            contextMenu.strokeStyle = 'rgba(0, 0, 0, 1)';
            contextMenu.strokeRect(0, 0, 1000, 1000);

            //Draw 'Main Menu'
            contextMenu.font = '48px Arial, sans-serif';
            contextMenu.fillStyle = 'rgba(0, 0, 0, 1)';
            contextMenu.baseline = 'top';
            contextMenu.fillText('Main Menu', 375, 50);

            //Draw menu options
            contextMenu.font = '32px Arial, sans-serif';
            if(option == 'newGame'){
                 //Draw current menu option
                contextMenu.fillStyle = 'rgba(0, 0, 255, 1)';
                contextMenu.fillRect(400, 65, 200, 50);
                contextMenu.strokeStyle = 'rgba(255, 255, 255, 1)';
                contextMenu.strokeRect(400, 65, 200, 50);

                contextMenu.fillStyle = 'rgba(0, 0, 0, 1)';
                contextMenu.fillText('High Scores', 413, 150);
                contextMenu.fillText('Credits', 450, 200);
                contextMenu.fillStyle = 'rgba(255, 255, 255, 1)';
                contextMenu.fillText('New Game', 420, 100);
            }
            else if(option == 'highScores'){
                //Draw current menu option
                contextMenu.fillStyle = 'rgba(0, 0, 255, 1)';
                contextMenu.fillRect(400, 115, 200, 50);
                contextMenu.strokeStyle = 'rgba(255, 255, 255, 1)';
                contextMenu.strokeRect(400, 115, 200, 50);

                contextMenu.fillStyle = 'rgba(0, 0, 0, 1)';
                contextMenu.fillText('New Game', 420, 100);
                contextMenu.fillText('Credits', 450, 200);
                contextMenu.fillStyle = 'rgba(255, 255, 255, 1)';
                contextMenu.fillText('High Scores', 413, 150);
            }
            else if(option == 'credits'){
                //Draw current menu option
                contextMenu.fillStyle = 'rgba(0, 0, 255, 1)';
                contextMenu.fillRect(400, 165, 200, 50);
                contextMenu.strokeStyle = 'rgba(255, 255, 255, 1)';
                contextMenu.strokeRect(400, 165, 200, 50);

                contextMenu.fillStyle = 'rgba(0, 0, 0, 1)';     
                contextMenu.fillText('New Game', 420, 100);
                contextMenu.fillText('High Scores', 413, 150);
                contextMenu.fillStyle = 'rgba(255, 255, 255, 1)';
                contextMenu.fillText('Credits', 450, 200);
            }
        };

        return that;
}());